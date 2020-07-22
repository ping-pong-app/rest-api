import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;
import UserRecord = admin.auth.UserRecord;
import Message = admin.messaging.Message;
import Firestore = admin.firestore.Firestore;

import { FirebaseConfig } from "../config/firebase.config";
import { BadRequestError, Optional } from "../lib";


export class FirebaseService {
    
    public static getDatabase(): Firestore {
        return FirebaseConfig.getDatabase();
    }
    
    public static async verifyToken(token: string | undefined): Promise<DecodedIdToken> {
        if (token) {
            const bareToken = token.replace("Bearer ", "");
            try {
                return await FirebaseConfig.getAuth().verifyIdToken(bareToken);
            } catch (err) {
                throw err;
            }
        } else {
            throw new Error("Token not provided!");
        }
    }
    
    public static async checkIfUserExists(email: Optional<string>): Promise<UserRecord> {
        if (!email) {
            throw new BadRequestError();
        }
        return await FirebaseConfig.getAuth().getUserByEmail(email);
    }
    
    public static async getUserInfo(userId: string): Promise<UserRecord> {
        return await FirebaseConfig.getAuth().getUser(userId);
    }
    
    public static async getUsersInfo(userIds: string[]): Promise<UserRecord[]> {
        const identifiers = userIds.map(id => {
            return {
                uid: id
            };
        });
        const usersResult = await FirebaseConfig.getAuth().getUsers(identifiers);
        return usersResult.users;
    }
    
    public static async sendCloudMessage(topic: string, data: any): Promise<void> {
        if (!data.timestamp) {
            data.timestamp = new Date().toISOString();
        }
        
        const message: Message = {topic, data};
        await FirebaseConfig.getMessaging().send(message);
    }
    
}
