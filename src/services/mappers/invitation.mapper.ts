import admin from "firebase-admin";
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import UserRecord = admin.auth.UserRecord;

import { GroupMembership, Invitation } from "../../lib";

export class InvitationMapper {
    
    public static fromEntity(entity: DocumentSnapshot): Invitation {
        const invitation = new Invitation();
        invitation.id = entity.id;
        invitation.userId = entity.get("userId");
        invitation.groupId = entity.get("groupId");
        return invitation;
    }
    
    public static fromUserRecords(records: UserRecord[], groupId: string): GroupMembership[] {
        return records.map(record => {
            const member = new GroupMembership();
            member.groupId = groupId;
            member.userId = record.uid;
            member.displayName = record.displayName || "";
            member.email = record.email || "";
            member.photo = record.photoURL || "";
            return member;
        });
    }
    
}
