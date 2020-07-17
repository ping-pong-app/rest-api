import { Ping } from "../lib";

export class PingService {
    
    public static async pingGroup(ping: Ping) {
        console.log("Pinging group with id: ", ping.groupId);
    }
    
}
