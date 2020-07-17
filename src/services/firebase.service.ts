import { FirebaseConfig } from "../config/firebase.config";
import admin from "firebase-admin";
import UserRecord = admin.auth.UserRecord;

export class FirebaseService {
    
    public static async checkIfUserExists(email: string): Promise<UserRecord> {
        return await FirebaseConfig.getAuth().getUserByEmail(email);
    }
    
}
