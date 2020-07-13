import { GroupEntity } from "../persistence";
import { EntityList, Group, Http404Error, QueryParameters } from "../lib";
import { GroupsMapper } from "./mappers/groups.mapper";
import { PersistenceManager } from "../config";
import { Validator } from "./validator";

export class GroupsService {
    
    public static async findAll(queryParams: QueryParameters, ownerId: string): Promise<EntityList<Group>> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        
        const groups = await repository.find({
            take: queryParams.limit,
            skip: queryParams.offset,
            where: {
                ownerId
            }
        });
        const groupCount = await repository.count({
            take: queryParams.limit,
            skip: queryParams.offset,
            where: {
                ownerId
            }
        });
        
        return new EntityList<Group>(groups, groupCount);
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
        Validator.assertNotBlank(group.name, "name", "Group");
        
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        
        const entity = new GroupEntity();
        entity.name = group.name;
        entity.ownerId = ownerId;
        
        await repository.insert(entity);
        
        return GroupsMapper.fromEntity(entity);
    }
    
    public static async delete(groupId: string, ownerId: string): Promise<void> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        
        await repository.createQueryBuilder()
            .delete()
            .from(GroupEntity)
            .where("id = :id", {id: groupId})
            .andWhere("owner_id = :ownerId", {ownerId})
            .execute();
    }
    
}
