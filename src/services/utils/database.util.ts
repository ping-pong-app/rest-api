import admin from "firebase-admin";
import QuerySnapshot = admin.firestore.QuerySnapshot;
import { FirebaseService } from "../firebase.service";

export class DatabaseUtil {
    
    public static async deleteQuery(ref: QuerySnapshot): Promise<void> {
        if (ref.size > 0) {
            const batch = FirebaseService.getDatabase().batch();
            ref.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }
    }
    
}
