import { BaseEntity } from "./base.entity";


export class GroupMemberEntity implements BaseEntity {
    
    public static readonly TABLE_NAME = "group_memberships";
    
    public userId: string;
    
    public groupId: string;
    
    raw(): any {
        return {
            userId: this.userId,
            groupId: this.groupId
        };
    }
    
}
