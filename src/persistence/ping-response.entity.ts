import { BaseEntity } from "./base.entity";
import { PingResponseType } from "../lib";


export class PingResponseEntity implements BaseEntity {
    
    public static readonly TABLE_NAME = "ping_responses";
    
    public pingId: string;
    
    public userId: string;
    
    public response: PingResponseType;
    
    raw(): any {
        return {
            pingId: this.pingId,
            userId: this.userId,
            response: this.response
        };
    }
    
}
