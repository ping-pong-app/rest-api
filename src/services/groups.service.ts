import { GroupEntity, GroupMemberEntity } from "../persistence";
import { EntityList, Group, Http404Error, QueryParameters } from "../lib";
import { GroupsMapper } from "./mappers/groups.mapper";
import { PersistenceManager } from "../config";
import { Validator } from "./validator";

export class GroupsService {
    
    public static async findAll(queryParams: QueryParameters, userId: string): Promise<EntityList<Group>> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        
        const queryResult = await repository.createQueryBuilder("groups")
            .innerJoin("groups.members", "memberships")
            .take(queryParams.limit)
            .skip(queryParams.offset)
            .where("memberships.userId = :userId", {userId})
            .getManyAndCount();
        
        return new EntityList<Group>(queryResult[0], queryResult[1]);
    }
    
    public static async find(groupId: string, ownerId: string): Promise<Group> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        
        const groupEntity = await repository.findOne(groupId, {
            where: {
                ownerId
            }
        });
        
        if (groupEntity) {
            return GroupsMapper.fromEntity(groupEntity);
        }
        throw new Http404Error("Group with given id doesn't exist!");
    }
    
    public static async create(group: Group, ownerId: string): Promise<Group> {
        Validator.assertNotNull(group, "#", "Group");
        Validator.assertNotBlank(group.name, "name", "Group");
        
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        const membershipRepository = PersistenceManager.getInstance().getRepository(GroupMemberEntity);
        
        const entity = new GroupEntity();
        entity.name = group.name;
        entity.ownerId = ownerId;
        
        await repository.insert(entity);
        
        const membership = new GroupMemberEntity();
        membership.userId = ownerId;
        membership.group = entity;
        
        await membershipRepository.insert(membership);
        
        return GroupsMapper.fromEntity(entity);
    }
    
    public static async delete(groupId: string, ownerId: string): Promise<void> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        const membershipRepository = PersistenceManager.getInstance().getRepository(GroupMemberEntity);
        
        const deleteResult = await repository.createQueryBuilder()
            .delete()
            .from(GroupEntity)
            .where("id = :id", {id: groupId})
            .andWhere("owner_id = :ownerId", {ownerId})
            .execute();
        
        if ((deleteResult.affected || 0) > 0) {
            await membershipRepository.createQueryBuilder()
                .delete()
                .from(GroupMemberEntity)
                .where("group_id = :groupId", {groupId})
                .execute();
        }
    }
    
}
