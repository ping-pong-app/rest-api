import { Http404Error, Invitation } from "../lib";
import { PersistenceManager } from "../config";
import { GroupEntity, GroupMemberEntity, InvitationEntity } from "../persistence";
import { InvitationMapper } from "./mappers/invitation.mapper";


export class InvitationService {

    public static async inviteUser(invitation: Invitation, userId: string): Promise<Invitation> {
        const groupRepository = PersistenceManager.getRepository(GroupEntity);
        const repository = PersistenceManager.getRepository(InvitationEntity);
        
        const group = await groupRepository.findOne(invitation.groupId, {
            where: {
                ownerId: userId
            }
        });
        
        if (group) {
            const entity = new InvitationEntity();
            entity.userId = invitation.userId;
            entity.group = group;
    
            await repository.insert(entity);
    
            // TODO: Notify user of invite (push notification)
            return InvitationMapper.fromEntity(entity);
        } else {
            throw new Http404Error("Group not found!");
        }
    }
    
    public static async acceptInvite(invitationId: string, userId: string) {
        const repository = PersistenceManager.getRepository(InvitationEntity);
        const membershipRepository = PersistenceManager.getRepository(GroupMemberEntity);
        
        const invitation = await repository.findOne(invitationId, {
            where: {
                userId
            }
        });
        
        if (invitation && invitation.group.id) {
            
            const membership = new GroupMemberEntity();
            membership.userId = userId;
            membership.group = invitation?.group;
    
            await membershipRepository.insert(membership);
    
            await InvitationService.removeAllInvitesForGroup(invitation.group.id, userId);
            
        } else {
            throw new Http404Error("Invitation not found!");
        }
    }
    
    public static async rejectInvite(invitationId: string, userId: string) {
        const repository = PersistenceManager.getRepository(InvitationEntity);
        
        const invitation = await repository.findOne(invitationId, {
            where: {
                userId
            }
        });
        
        if (invitation && invitation.group.id) {
            await InvitationService.removeAllInvitesForGroup(invitation.group.id, userId);
        } else {
            throw new Http404Error("Invitation to group not found!");
        }
    }
    
    private static async removeAllInvitesForGroup(groupId: string, userId: string): Promise<void> {
        const repository = PersistenceManager.getRepository(InvitationEntity);
        await repository.createQueryBuilder()
            .delete()
            .from(InvitationEntity)
            .where("user_id = :userId", {userId})
            .andWhere("group_id = :groupId", {groupId})
            .execute();
    }

}
