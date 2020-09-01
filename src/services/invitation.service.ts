import {
    ConflictError,
    EntityIdentifier,
    EntityList,
    ExtendedInvitation,
    Group,
    Invitation,
    NotFoundError,
    User
} from "../lib";
import { GroupEntity, InvitationEntity } from "../persistence";
import { GroupsService } from "./groups.service";
import { FirebaseService } from "./firebase.service";
import { InvitationMapper } from "./mappers/invitation.mapper";
import { Validator } from "./validator";
import { GroupsMapper } from "./mappers/groups.mapper";
import { UserMapper } from "./mappers/user.mapper";


export class InvitationService {
    
    public static async getUserInvites(userId: string): Promise<EntityList<ExtendedInvitation>> {
        // Retrieve list of invitations
        const invitations = await FirebaseService.getDatabase()
            .collection(InvitationEntity.TABLE_NAME)
            .where("userId", "==", userId)
            .get();
        
        if (invitations.size === 0) {
            return new EntityList<ExtendedInvitation>([], 0);
        }
        
        // Get group ids from it
        const groupIds = invitations.docs.map(entity => {
            return FirebaseService.getDatabase().doc("groups/" + entity.get("groupId"));
        });
        
        // Retrieve groups
        const groupEntities = await FirebaseService.getDatabase()
            .getAll(...groupIds);
        
        // Map groups to dto
        const groups = groupEntities.map(groupEntity => {
            return GroupsMapper.fromEntity(groupEntity);
        });
        
        // Retrieve owner ids from groups
        const userIds = groups.map(group => {
            return group.ownerId;
        });
        
        // Retrieve users from firebase auth
        const users = (await FirebaseService.getUsersInfo(userIds)).map(user => {
            return UserMapper.fromRecord(user);
        });
        
        // Map invites to dto
        const invites = invitations.docs.map(entity => {
            return InvitationMapper.fromEntity(entity);
        });
        
        const extendedInvites = await InvitationService.mergeData(invites, users, groups);
        
        return new EntityList<ExtendedInvitation>(extendedInvites, extendedInvites.length);
    }
    
    public static async getGroupInvites(ownerId: string, groupId: string): Promise<EntityList<Invitation>> {
        if (await GroupsService.isOwnerOfGroup(ownerId, groupId)) {
            
            const invitations = await FirebaseService.getDatabase()
                .collection(InvitationEntity.TABLE_NAME)
                .where("groupId", "==", groupId)
                .get();
            
            if (invitations.size === 0) {
                return new EntityList<Invitation>([], 0);
            }
            
            const invites = invitations.docs.map(entity => {
                return InvitationMapper.fromEntity(entity);
            });
            
            return new EntityList<Invitation>(invites, invites.length);
        } else {
            throw new NotFoundError("Group not found!");
        }
    }
    
    public static async inviteUser(invitation: Invitation, userId: string): Promise<EntityIdentifier> {
        Validator.assertNotNull(invitation);
        Validator.assertNotBlank(invitation.email, "email", "Invitation");
        Validator.assertNotBlank(invitation.groupId, "groupId", "Invitation");
        
        
        if (await GroupsService.isOwnerOfGroup(userId, invitation.groupId)) {
    
            const user = await FirebaseService.checkIfUserExists(invitation.email);
            
            if (user.uid === userId) {
                throw new ConflictError("Cannot invite self!");
            }
            
            const existingInvitation = await FirebaseService.getDatabase()
                .collection(InvitationEntity.TABLE_NAME)
                .where("userId", "==", user.uid)
                .where("groupId", "==", invitation.groupId)
                .get();
            
            if (existingInvitation.empty) {
                
                const invite = new InvitationEntity();
                invite.groupId = invitation.groupId;
                invite.userId = user.uid;
                
                const savedEntity = await FirebaseService.getDatabase()
                    .collection(InvitationEntity.TABLE_NAME)
                    .add(invite.raw());
                
                const group = await GroupsService.find(invite.groupId, userId);
                
                // Notify user of invite (push notification)
                const topic = `INVITE.${user.uid}`;
                const data = {
                    invitationId: savedEntity.id,
                    groupId: group.id,
                    groupName: group.name
                };
                await FirebaseService.sendCloudMessage(topic, data);
                
                return new EntityIdentifier(savedEntity.id);
            } else {
                throw new ConflictError("Invitation for given user already exists!");
            }
        } else {
            throw new NotFoundError("Group not found!");
        }
    }
    
    public static async acceptInvite(invitationId: string, userId: string): Promise<Group> {
        const invitation = await FirebaseService.getDatabase()
            .collection(InvitationEntity.TABLE_NAME)
            .doc(invitationId)
            .get();
        
        if (invitation.exists && invitation.get("userId") === userId) {
            
            await GroupsService.addUserToGroup(invitation.get("groupId"), invitation.get("userId"));
            
            await FirebaseService.getDatabase()
                .collection(InvitationEntity.TABLE_NAME)
                .doc(invitation.id)
                .delete();
            
            const group = await FirebaseService.getDatabase()
                .collection(GroupEntity.TABLE_NAME)
                .doc(invitation.get("groupId"))
                .get();
            
            const topic = `INVITE.GROUP.${invitation.get("groupId")}`;
            const data = {
                groupId: invitation.get("groupId"),
                groupName: group.get("name")
            };
            await FirebaseService.sendCloudMessage(topic, data);
            
            return GroupsMapper.fromEntity(group);
            
        } else {
            throw new NotFoundError("Invitation not found!");
        }
    }
    
    public static async rejectInvite(invitationId: string, userId: string) {
        const invitation = await FirebaseService.getDatabase()
            .collection(InvitationEntity.TABLE_NAME)
            .doc(invitationId)
            .get();
        
        if (invitation.exists && invitation.get("userId") === userId) {
            await FirebaseService.getDatabase()
                .collection(InvitationEntity.TABLE_NAME)
                .doc(invitation.id)
                .delete();
        } else {
            throw new NotFoundError("Invitation not found!");
        }
    }
    
    public static async cancelInvite(invitationId: string, ownerId: string) {
        const invitationRef = FirebaseService.getDatabase()
            .collection(InvitationEntity.TABLE_NAME)
            .doc(invitationId);
        
        const invitation = await invitationRef.get();
        
        if (invitation.exists) {
            if (await GroupsService.isOwnerOfGroup(ownerId, invitation.get("groupId"))) {
                await invitationRef.delete();
            } else {
                throw new NotFoundError("Invitation not found!");
            }
        } else {
            throw new NotFoundError("Invitation not found!");
        }
    }
    
    private static async mergeData(invitations: Invitation[], users: User[], groups: Group[]): Promise<ExtendedInvitation[]> {
        
        type Identifier = Partial<{ id: string }>;
        
        const buildMap = (collection: Identifier[]) => {
            const map: { [key: string]: Identifier } = {};
            collection.forEach(elem => {
                map[elem.id || ""] = elem;
            });
            
            return map;
        };
        
        const groupsMap = buildMap(groups);
        const usersMap = buildMap(users);
        
        return invitations.map(invitation => {
            const extended = Object.assign(new ExtendedInvitation(), invitation);
            extended.group = ((groupsMap as any)[invitation.groupId] as Group);
            extended.user = ((usersMap as any)[extended.group.ownerId] as User);
            return extended;
        });
    }
    
}
