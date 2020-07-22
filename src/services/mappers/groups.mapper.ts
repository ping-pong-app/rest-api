import admin from "firebase-admin";
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import Timestamp = admin.firestore.Timestamp;

import { Group } from "../../lib";
import { GroupEntity } from "../../persistence";
import FieldValue = admin.firestore.FieldValue;

export class GroupsMapper {
    
    public static fromEntity(entity: DocumentSnapshot): Group {
        const group = new Group();
        group.id = entity.id;
        group.name = entity.get("name");
        group.ownerId = entity.get("ownerId");
        group.updatedAt = (entity.get("updatedAt") as Timestamp).toDate();
        group.createdAt = (entity.get("createdAt") as Timestamp).toDate();
        return group;
    }
    
    public static toEntity(group: Group): GroupEntity {
        const entity = new GroupEntity();
        entity.name = group.name;
        entity.createdAt = FieldValue.serverTimestamp();
        entity.updatedAt = FieldValue.serverTimestamp();
        return entity;
    }
    
}
