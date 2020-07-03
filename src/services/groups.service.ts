import { GroupEntity } from "../persistence";
import { EntityList, Group, Http404Error, QueryParameters } from "../lib";
import { GroupsMapper } from "./mappers/groups.mapper";
import { PersistenceManager } from "../config";

export class GroupsService {
    
    public static async findAll(queryParams: QueryParameters): Promise<EntityList<Group>> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        
        const groups = await repository.find({
            take: queryParams.limit,
            skip: queryParams.offset
        });
        const groupCount = await repository.count({
            take: queryParams.limit,
            skip: queryParams.offset
        });
        
        return new EntityList<Group>(groups, groupCount);
    }
    
    public static async find(groupId: string): Promise<Group> {
        const entity = await GroupsService.findEntity(groupId);
        if (entity === null) {
            throw new Http404Error("Group with given id doesn't exist!");
        }
        return GroupsMapper.fromEntity(entity);
    }
    
    private static async findEntity(groupId: string): Promise<GroupEntity | null> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        const group = await repository.findOne(groupId);
        if (group) {
            return group;
        }
        return null;
    }
    
}
