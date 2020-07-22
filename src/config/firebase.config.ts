import admin, { initializeApp, auth, messaging, firestore } from "firebase-admin";
import App = admin.app.App;
import Auth = admin.auth.Auth;
import Messaging = admin.messaging.Messaging;
import Firestore = admin.firestore.Firestore;


export class FirebaseConfig {
    
    private static application: App;
    
    private static auth: Auth;
    
    private static messaging: Messaging;
    
    private static db: Firestore;
    
    public static initialize() {
        const {GOOGLE_APPLICATION_CREDENTIALS} = process.env;
        
        console.log(`Initializing Firebase... Reading service account credentials from '${GOOGLE_APPLICATION_CREDENTIALS}'`);
        FirebaseConfig.application = initializeApp();
        
        FirebaseConfig.auth = auth();
        console.log("Firebase Authentication component initialized!");
        
        FirebaseConfig.db = firestore();
        console.log("Firebase Cloud Firestore component initialized!");
        
        FirebaseConfig.messaging = messaging();
        console.log("Firebase Cloud Messaging component initialized!");
        
        console.log("Firebase initialized!");
    }
    
    public static getAuth(): Auth {
        return FirebaseConfig.auth;
    }
    
    public static getMessaging(): Messaging {
        return FirebaseConfig.messaging;
    }
    
    public static getDatabase(): Firestore {
        return FirebaseConfig.db;
    }
    
}
