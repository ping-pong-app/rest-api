import admin from "firebase-admin";
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import Timestamp = admin.firestore.Timestamp;
import { Ping, PingResponse } from "../../lib";
import { PingEntity, PingResponseEntity } from "../../persistence";

export class PingMapper {
    
    public static toEntity(ping: Ping): PingEntity {
        const entity = new PingEntity();
        entity.pingerId = ping.pingerId;
        entity.groupId = ping.groupId;
        return entity;
    }
    
    public static fromEntity(entity: DocumentSnapshot): Ping {
        const ping = new Ping();
        ping.id = entity.id;
        ping.pingerId = entity.get("pingerId");
        ping.groupId = entity.get("groupId");
        ping.updatedAt = (entity.get("updatedAt") as Timestamp).toDate();
        ping.createdAt = (entity.get("createdAt") as Timestamp).toDate();
        return ping;
    }
    
    public static responseToEntity(response: PingResponse): PingResponseEntity {
        const entity = new PingResponseEntity();
        entity.pingId = response.pingId;
        entity.userId = response.userId;
        entity.response = response.response;
        return entity;
    }
    
    public static responseFromEntity(entity: DocumentSnapshot): PingResponse {
        const response = new PingResponse();
        response.id = entity.id;
        response.response = entity.get("response");
        response.userId = entity.get("userId");
        response.pingId = entity.get("pingId");
        response.createdAt = (entity.get("createdAt") as Timestamp).toDate();
        response.updatedAt = (entity.get("updatedAt") as Timestamp).toDate();
        return response;
    }
    
}
