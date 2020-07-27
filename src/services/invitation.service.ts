import { NotFoundError, Invitation, EntityList, EntityIdentifier, ConflictError } from "../lib";
import { InvitationEntity } from "../persistence";
import { GroupsService } from "./groups.service";
import { FirebaseService } from "./firebase.service";
import { InvitationMapper } from "./mappers/invitation.mapper";
import { Validator } from "./validator";


export class InvitationService {
    
    public static async getUserInvites(userId: string): Promise<EntityList<Invitation>> {
        const invitations = await FirebaseService.getDatabase()
            .collection(InvitationEntity.TABLE_NAME)
            .where("userId", "==", userId)
            .get();
        
        const invites = invitations.docs.map(entity => {
            return InvitationMapper.fromEntity(entity);
        });
        
        return new EntityList<Invitation>(invites, invites.length);
    }
    
    public static async getGroupInvites(ownerId: string, groupId: string): Promise<EntityList<Invitation>> {
        if (await GroupsService.isOwnerOfGroup(ownerId, groupId)) {
            
            const invitations = await FirebaseService.getDatabase()
                .collection(InvitationEntity.TABLE_NAME)
                .where("groupId", "==", groupId)
                .get();
            
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
                
                // Notify user of invite (push notification)
                await InvitationService.notifyUserOnInvite(savedEntity.id, user.uid);
                return new EntityIdentifier(savedEntity.id);
            } else {
                throw new ConflictError("Invitation for given user already exists!");
            }
        } else {
            throw new NotFoundError("Group not found!");
        }
    }
    
    public static async acceptInvite(invitationId: string, userId: string) {
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
    
    private static async notifyUserOnInvite(invitationId: string, userId: string) {
        const topic = `INVITE.${userId}`;
        const data = {
            invitationId,
            userId
        };
        await FirebaseService.sendCloudMessage(topic, data);
    }
    
}
