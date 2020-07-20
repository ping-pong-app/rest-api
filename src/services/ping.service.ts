import { Ping } from "../lib";
import { FirebaseService } from "./firebase.service";

export class PingService {
    
    public static async pingGroup(ping: Ping, userId: string) {
        await FirebaseService.pingGroup(ping.groupId, userId);
    }
    
}
