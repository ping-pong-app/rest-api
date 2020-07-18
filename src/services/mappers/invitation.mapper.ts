import { InvitationEntity } from "../../persistence";
import { Invitation } from "../../lib";

export class InvitationMapper {
    
    public static fromEntity(entity: InvitationEntity): Invitation {
        const invitation = new Invitation();
        invitation.id = entity.id;
        invitation.userId = entity.userId;
        if (entity.group) {
            invitation.groupId = entity.group.id;
        }
        return invitation;
    }
    
}
