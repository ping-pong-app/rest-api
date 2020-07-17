import admin, { initializeApp, auth } from "firebase-admin";
import App = admin.app.App;
import Auth = admin.auth.Auth;
import DecodedIdToken = admin.auth.DecodedIdToken;


export class FirebaseConfig {
    
    private static application: App;
    
    private static auth: Auth;
    
    public static initialize() {
        const {GOOGLE_APPLICATION_CREDENTIALS} = process.env;
        
        console.log(`Initializing FirebaseAuth... Reading service account credentials from '${GOOGLE_APPLICATION_CREDENTIALS}'`);
        FirebaseConfig.application = initializeApp();
        FirebaseConfig.auth = auth();
        console.log("FirebaseAuth initialized!");
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
    
}
