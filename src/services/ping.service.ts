import { NotFoundError, Ping } from "../lib";
import { FirebaseService } from "./firebase.service";
import { GroupsService } from "./groups.service";
import { Validator } from "./validator";
import { Logger } from "./logger";

export class PingService {
    
    public static async pingGroup(ping: Ping, userId: string) {
        Validator.assertNotNull(ping, null, "Ping");
        Validator.assertNotBlank(ping.groupId, "groupId", "Ping");
        
        if (await GroupsService.isMemberOfGroup(userId, ping.groupId)) {
            const topic = `PING.${ping.groupId}`;
            const data = {
                userId,
                groupId: ping.groupId
            };
            Logger.info("User %s pinged group %s!", userId, ping.groupId);
            await FirebaseService.sendCloudMessage(topic, data);
        } else {
            throw new NotFoundError("Group not found!");
        }
    }
    
}
