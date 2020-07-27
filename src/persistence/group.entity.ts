import admin from "firebase-admin";
import FieldValue = admin.firestore.FieldValue;

import { BaseEntity } from "./base.entity";


export class GroupEntity implements BaseEntity {
    
    public static readonly TABLE_NAME = "groups";
    
    public id?: string;
    
    public name: string;
    
    public ownerId: string;
    
    public createdAt: FieldValue;
    
    public updatedAt: FieldValue;
    
    public raw(): any {
        return {
            name: this.name,
            ownerId: this.ownerId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    
}
