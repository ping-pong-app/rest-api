import { BaseEntity } from "./base.entity";


export class InvitationEntity implements BaseEntity {
    
    public static readonly TABLE_NAME = "invitations";
    
    public id: string;
    
    public userId: string;
    
    public groupId: string;
    
    raw(): any {
        return {
            userId: this.userId,
            groupId: this.groupId
        };
    }
    
}
