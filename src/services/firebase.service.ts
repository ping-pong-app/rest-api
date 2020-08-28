import admin from "firebase-admin";
import DecodedIdToken = admin.auth.DecodedIdToken;
import UserRecord = admin.auth.UserRecord;
import Message = admin.messaging.Message;
import Firestore = admin.firestore.Firestore;

import { FirebaseConfig } from "../config/firebase.config";
import { BadRequestError, InternalServerError, Optional, ValidationError } from "../lib";
import { Logger } from "./logger";


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
        try {
            return await FirebaseConfig.getAuth().getUserByEmail(email);
        } catch (err) {
            if (err.code && err.code === "auth/invalid-email") {
                throw new BadRequestError(err.message);
            }
            Logger.error(err.message);
            throw new InternalServerError("Unknown error!");
        }
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
        
        FirebaseService.validateCloudMessage(data);
        
        const message: Message = {topic, data};
        await FirebaseConfig.getMessaging().send(message);
        Logger.debug("Message sent to Firebase Cloud Messaging!");
    }
    
    private static validateCloudMessage(data: any) {
        Object.keys(data).forEach(key => {
            if (typeof data[key] !== "string") {
                throw new ValidationError("Validation failed! Invalid Cloud message format. Only strings are allowed.");
            }
        });
    }
    
}
