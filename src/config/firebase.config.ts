import admin, { initializeApp, auth, messaging } from "firebase-admin";
import App = admin.app.App;
import Auth = admin.auth.Auth;
import DecodedIdToken = admin.auth.DecodedIdToken;
import Messaging = admin.messaging.Messaging;


export class FirebaseConfig {
    
    private static application: App;
    
    private static auth: Auth;
    
    private static messaging: Messaging;
    
    public static initialize() {
        const {GOOGLE_APPLICATION_CREDENTIALS} = process.env;
        
        console.log(`Initializing Firebase... Reading service account credentials from '${GOOGLE_APPLICATION_CREDENTIALS}'`);
        FirebaseConfig.application = initializeApp();
        FirebaseConfig.auth = auth();
        console.log("Firebase Authentication component initialized!");
        FirebaseConfig.messaging = messaging();
        console.log("Firebase Cloud Messaging component initialized!");
        
        console.log("Firebase initialized!");
    }
    
    public static async verifyToken(token: string | undefined): Promise<DecodedIdToken> {
        if (token) {
            const bareToken = token.replace("Bearer ", "");
            try {
                return await FirebaseConfig.auth.verifyIdToken(bareToken);
            } catch (err) {
                throw err;
            }
        } else {
            throw new Error("Token not provided!");
        }
    }
    
    public static getAuth(): Auth {
        return FirebaseConfig.auth;
    }
    
    public static getMessaging(): Messaging {
        return FirebaseConfig.messaging;
    }
    
}
