import { GroupEntity, GroupMemberEntity } from "../../persistence";
import { Group, GroupMember } from "../../lib";

export class GroupsMapper {
    
    public static fromEntity(entity: GroupEntity): Group {
        const group = new Group();
        group.id = entity.id;
        group.name = entity.name;
        group.ownerId = entity.ownerId;
        group.createdAt = entity.createdAt;
        group.updatedAt = entity.updatedAt;
        group.members = entity.members ?
            entity.members.map(member => GroupsMapper.fromGroupMemberEntity(member)) : [];
        return group;
    }
    
    public static fromGroupMemberEntity(entity: GroupMemberEntity): GroupMember {
        const member = new GroupMember();
        member.userId = entity.userId;
        return member;
    }
    
}
