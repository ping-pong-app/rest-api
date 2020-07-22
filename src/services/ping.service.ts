import { NotFoundError, Ping } from "../lib";
import { FirebaseService } from "./firebase.service";
import { GroupsService } from "./groups.service";
import { Validator } from "./validator";

export class PingService {
    
    public static async pingGroup(ping: Ping, userId: string) {
        Validator.assertNotNull(ping);
        Validator.assertNotBlank(ping.groupId);
        
        if (await GroupsService.isMemberOfGroup(userId, ping.groupId)) {
            const topic = `PING.${ping.groupId}`;
            const data = {
                userId,
                groupId: ping.groupId
            };
            await FirebaseService.sendCloudMessage(topic, data);
        } else {
            throw new NotFoundError("Group not found!");
        }
    }
    
}
