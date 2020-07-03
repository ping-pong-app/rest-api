import { GroupEntity } from "../../persistence";
import { Group } from "../../lib";

export class GroupsMapper {
    
    public static fromEntity(entity: GroupEntity): Group {
        const group = new Group();
        group.id = entity.id;
        group.name = entity.name;
        group.ownerId = entity.ownerId;
        return group;
    }
    
}
