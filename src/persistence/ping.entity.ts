import { BaseEntity } from "./base.entity";


export class PingEntity implements BaseEntity {
    
    public static readonly TABLE_NAME = "pings";
    
    public groupId: string;
    
    public pingerId: string;
    
    raw(): any {
        return {
            groupId: this.groupId,
            pingerId: this.pingerId
        };
    }
    
}
