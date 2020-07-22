import { Invitation } from "../../lib";
import admin from "firebase-admin";
import DocumentSnapshot = admin.firestore.DocumentSnapshot;

export class InvitationMapper {
    
    public static fromEntity(entity: DocumentSnapshot): Invitation {
        const invitation = new Invitation();
        invitation.id = entity.id;
        invitation.userId = entity.get("userId");
        invitation.groupId = entity.get("groupId");
        return invitation;
    }
    
}
