import { PingResponseType } from "./enums/ping-response.type";
import { Ping } from "./ping.model";

export class PingResponse {
    public id?: string;
    public pingId: string;
    public response: PingResponseType;
    public userId: string;
    public createdAt: any;
    public updatedAt: any;
}

export class PingAggregated extends Ping {
    public responses: PingResponse[];
    
    constructor(ping: Ping, responses: PingResponse[]) {
        super();
        this.responses = responses || [];
        this.id = ping.id;
        this.groupId = ping.groupId;
        this.pingerId = ping.pingerId;
        this.createdAt = ping.createdAt;
        this.updatedAt = ping.updatedAt;
    }
}
