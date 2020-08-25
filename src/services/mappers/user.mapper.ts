import admin from "firebase-admin";
import UserRecord = admin.auth.UserRecord;
import { User } from "../../lib";

export class UserMapper {
    
    public static fromRecord(record: UserRecord): User {
        const user = new User();
        user.id = record.uid;
        user.email = record.email || "";
        user.displayName = record.displayName || record.email || "";
        user.photoUrl = record.photoURL || "";
        return user;
    }
    
}
