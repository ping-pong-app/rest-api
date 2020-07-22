import { NotFoundError, Invitation, EntityList } from "../lib";
import { InvitationEntity } from "../persistence";
import { GroupsService } from "./groups.service";
import { FirebaseService } from "./firebase.service";
import { InvitationMapper } from "./mappers/invitation.mapper";


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

    public static async inviteUser(invitation: Invitation, userId: string): Promise<void> {
        if (await GroupsService.isOwnerOfGroup(userId, invitation.groupId)) {
            
            const existingInvitation = await FirebaseService.getDatabase()
                .collection(InvitationEntity.TABLE_NAME)
                .where("userId", "==", invitation.userId)
                .where("groupId", "==", invitation.groupId)
                .get();
            
            if (!existingInvitation.empty) {
                const invite = new InvitationEntity();
                invite.groupId = invitation.groupId;
                invite.userId = invitation.userId;
    
                const savedEntity = await FirebaseService.getDatabase()
                    .collection(InvitationEntity.TABLE_NAME)
                    .add(invite.raw());
    
                // Notify user of invite (push notification)
                await InvitationService.notifyUserOnInvite(savedEntity.id, invitation.userId);
            } else {
                await InvitationService.notifyUserOnInvite("existingInvitation.", invitation.userId);
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
        
        if (invitation.exists) {
            
            await GroupsService.addUserToGroup(invitation.get("groupId"), userId);
            
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
    
        if (invitation.exists) {
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
