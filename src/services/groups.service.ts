import admin from "firebase-admin";
import FieldValue = admin.firestore.FieldValue;
import DocumentReference = admin.firestore.DocumentReference;
import { EntityList, Group, NotFoundError, QueryParameters } from "../lib";
import { GroupsMapper } from "./mappers/groups.mapper";
import { Validator } from "./validator";
import { FirebaseService } from "./firebase.service";
import { GroupEntity, GroupMemberEntity } from "../persistence";

export class GroupsService {
    
    public static async findAll(queryParams: QueryParameters, userId: string): Promise<EntityList<Group>> {
        const groupIds = await GroupsService.getGroupsUserBelongsTo(userId);
        const queryResult = await FirebaseService.getDatabase().getAll(...groupIds);
        
        const groups = queryResult.map(row => {
            return GroupsMapper.fromEntity(row);
        });
        
        return new EntityList<Group>(groups, groups.length);
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
    
    public static async create(group: Group, ownerId: string): Promise<Group> {
        
        Validator.assertNotNull(group, "#", "Group");
        Validator.assertNotBlank(group.name, "name", "Group");
        
        // Create group
        
        const entity = new GroupEntity();
        entity.name = group.name;
        entity.ownerId = ownerId;
        entity.createdAt = FieldValue.serverTimestamp();
        entity.updatedAt = FieldValue.serverTimestamp();
        
        const savedEntity = await FirebaseService.getDatabase()
            .collection(GroupEntity.TABLE_NAME)
            .add(entity.raw());
        
        await GroupsService.addUserToGroup(savedEntity.id, ownerId);
    
        return new Group();
    }
    
    public static async delete(groupId: string, ownerId: string): Promise<void> {
        if (await GroupsService.isOwnerOfGroup(ownerId, groupId)) {
            await FirebaseService.getDatabase().collection(GroupEntity.TABLE_NAME).doc(groupId).delete();
        } else {
            throw new NotFoundError("Group with given id doesn't exist!");
        }
    }
    
    public static async addUserToGroup(groupId: string, userId: string): Promise<void> {
        const membership = new GroupMemberEntity();
        membership.groupId = groupId;
        membership.userId = userId;
    
        await FirebaseService.getDatabase()
            .collection(GroupMemberEntity.TABLE_NAME)
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
        const membershipRef = FirebaseService.getDatabase().collection(GroupMemberEntity.TABLE_NAME);
        const joinedGroups = await membershipRef.where("userId", "==", userId).get();
        return joinedGroups.docs.map(row => {
            return FirebaseService.getDatabase().doc("groups/" + row.get("groupId"));
        });
    }
}
