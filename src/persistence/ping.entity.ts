import { BaseEntity } from "./base.entity";
import admin from "firebase-admin";
import FieldValue = admin.firestore.FieldValue;


export class PingEntity implements BaseEntity {
    
    public static readonly TABLE_NAME = "pings";
    
    public groupId: string;
    
    public pingerId: string;
    
    public createdAt: FieldValue;
    
    public updatedAt: FieldValue;
    
    raw(): any {
        return {
            groupId: this.groupId,
            pingerId: this.pingerId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    
}
