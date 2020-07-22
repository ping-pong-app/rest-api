import { NotFoundError, Ping } from "../lib";
import { FirebaseService } from "./firebase.service";
import { GroupsService } from "./groups.service";

export class PingService {
    
    public static async pingGroup(ping: Ping, userId: string) {
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
