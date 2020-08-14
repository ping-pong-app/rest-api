import admin from "firebase-admin";
import UserRecord = admin.auth.UserRecord;
import { FirebaseService } from "./firebase.service";
import { FirebaseConfig } from "../config/firebase.config";
import UpdateRequest = admin.auth.UpdateRequest;

export class UserService {
    
    public static async getUserDisplayName(userId: string): Promise<string> {
        const user =  await FirebaseService.getUserInfo(userId);
        return user.displayName || user.email || "";
    }
    
    public static async getUser(userId: string): Promise<UserRecord> {
        return FirebaseService.getUserInfo(userId);
    }
    
    public static async updateUser(userId: string): Promise<UserRecord> {
        // const user = await FirebaseService.getUserInfo(userId);
        
        const upd: UpdateRequest = {
            disabled: false,
            displayName: "",
            emailVerified: true,
            photoURL: "",
        };
        
        return await FirebaseConfig.getAuth().updateUser("", upd);
    }
    
}
