import admin from "firebase-admin";
import DocumentReference = admin.firestore.DocumentReference;
import {
    EntityIdentifier,
    EntityList,
    Group,
    GroupMembership,
    NotFoundError,
    QueryParameters
} from "../lib";
import { GroupsMapper } from "./mappers/groups.mapper";
import { Validator } from "./validator";
import { FirebaseService } from "./firebase.service";
import { GroupEntity, GroupMembershipEntity, InvitationEntity } from "../persistence";
import { InvitationMapper } from "./mappers/invitation.mapper";

export class GroupsService {
    
    public static async findAll(queryParams: QueryParameters, userId: string): Promise<EntityList<Group>> {
        const groupIds = await GroupsService.getGroupsUserBelongsTo(userId);
        
        if (groupIds.length > 0) {
            const queryResult = await FirebaseService.getDatabase().getAll(...groupIds);
    
            const groups = queryResult.map(row => {
                return GroupsMapper.fromEntity(row);
            });
    
            return new EntityList<Group>(groups, groups.length);
        } else {
            return new EntityList<Group>([], 0);
        }
    }
    
    public static async find(groupId: string, userId: string): Promise<Group> {
        if (await GroupsService.isMemberOfGroup(userId, groupId)) {
            const entity = await FirebaseService.getDatabase()
                .collection(GroupEntity.TABLE_NAME)
                .doc(groupId)
                .get();
            return GroupsMapper.fromEntity(entity);
        } else {
            // If user does not belong to group, 404 is returned
            throw new NotFoundError("Group with given id doesn't exist!");
        }
    }
    
    public static async findGroupMembers(groupId: string, userId: string): Promise<EntityList<GroupMembership>> {
        if (await GroupsService.isMemberOfGroup(userId, groupId)) {
            
            const queryResult = await FirebaseService.getDatabase()
                .collection(GroupMembershipEntity.TABLE_NAME)
                .where("groupId", "==", groupId)
                .get();
            
            try {
                const memberIds = queryResult.docs.map(entity => {
                    return entity.get("userId");
                });
                
                const users = await FirebaseService.getUsersInfo(memberIds);
                const members = InvitationMapper.fromUserRecords(users, groupId);
                
                return new EntityList<GroupMembership>(members, members.length);
            } catch (err) {
                // Fallback: if failing to retrieve user data from firebase,
                //           return only persisted entities.
                
                const members = queryResult.docs.map(entity => {
                    const membership = new GroupMembership();
                    membership.userId = entity.get("userId");
                    membership.groupId = entity.get("groupId");
                    return membership;
                });
                return new EntityList(members, members.length);
            }
        } else {
            throw new NotFoundError("Group not found!");
        }
    }
    
    public static async create(group: Group, ownerId: string): Promise<EntityIdentifier> {
        
        Validator.assertNotNull(group, null, "Group");
        Validator.assertNotBlank(group.name, "name", "Group");
        
        const entity = GroupsMapper.toEntity(group);
        entity.ownerId = ownerId;
        
        const savedEntity = await FirebaseService.getDatabase()
            .collection(GroupEntity.TABLE_NAME)
            .add(entity.raw());
        
        await GroupsService.addUserToGroup(savedEntity.id, ownerId);
        
        return new EntityIdentifier(savedEntity.id);
    }
    
    public static async delete(groupId: string, ownerId: string): Promise<void> {
        if (await GroupsService.isOwnerOfGroup(ownerId, groupId)) {
            
            // Delete group
            await FirebaseService.getDatabase().collection(GroupEntity.TABLE_NAME).doc(groupId).delete();
            
            // Delete group membership
            const membersRef = await FirebaseService.getDatabase()
                .collection(GroupMembershipEntity.TABLE_NAME)
                .where("groupId", "==", groupId)
                .get();
            
            if (membersRef.size > 0) {
                const batch = FirebaseService.getDatabase().batch();
                membersRef.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
    
            // Delete group invitations
            const invitesRef = await FirebaseService.getDatabase()
                .collection(InvitationEntity.TABLE_NAME)
                .where("groupId", "==", groupId)
                .get();
            
            if (invitesRef.size > 0) {
                const batch = FirebaseService.getDatabase().batch();
                invitesRef.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
        } else {
            throw new NotFoundError("Group with given id doesn't exist!");
        }
    }
    
    public static async addUserToGroup(groupId: string, userId: string): Promise<void> {
        const membership = new GroupMembershipEntity();
        membership.groupId = groupId;
        membership.userId = userId;
        
        await FirebaseService.getDatabase()
            .collection(GroupMembershipEntity.TABLE_NAME)
            .add(membership.raw());
    }
    
    public static async isOwnerOfGroup(userId: string, groupId: string): Promise<boolean> {
        const group = await FirebaseService.getDatabase()
            .collection(GroupEntity.TABLE_NAME)
            .doc(groupId)
            .get();
        
        return (group.get("ownerId") as string) === userId;
    }
    
    public static async isMemberOfGroup(userId: string, groupId: string): Promise<boolean> {
        const groupIds = await GroupsService.getGroupsUserBelongsTo(userId);
        return groupIds.filter(group => group.id === groupId).length > 0;
    }
    
    private static async getGroupsUserBelongsTo(userId: string): Promise<DocumentReference[]> {
        const membershipRef = FirebaseService.getDatabase().collection(GroupMembershipEntity.TABLE_NAME);
        const joinedGroups = await membershipRef.where("userId", "==", userId).get();
        return joinedGroups.docs.map(row => {
            return FirebaseService.getDatabase().doc("groups/" + row.get("groupId"));
        });
    }
}
