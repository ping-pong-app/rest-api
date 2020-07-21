import { FirebaseConfig } from "../config/firebase.config";
import admin from "firebase-admin";
import UserRecord = admin.auth.UserRecord;
import Message = admin.messaging.Message;

export class FirebaseService {
    
    public static async checkIfUserExists(email: string): Promise<UserRecord> {
        return await FirebaseConfig.getAuth().getUserByEmail(email);
    }
    
    public static async getUserInfo(userId: string): Promise<UserRecord> {
        return await FirebaseConfig.getAuth().getUser(userId);
    }
    
    public static async pingGroup(groupId: string, userId: string): Promise<void> {
        const message: Message = {
            topic: `PING.${groupId}`,
            data: {
                userId,
                groupId,
                timestamp: new Date().toISOString()
            }
        };
        
        await FirebaseConfig.getMessaging().send(message);
    }
    
}
