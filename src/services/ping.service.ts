import { EntityIdentifier, EntityList, NotFoundError, Ping, PingAggregated, PingResponse } from "../lib";
import { FirebaseService } from "./firebase.service";
import { GroupsService } from "./groups.service";
import { Validator } from "./validator";
import { Logger } from "./logger";
import { GroupEntity, PingEntity, PingResponseEntity } from "../persistence";
import { PingMapper } from "./mappers/ping.mapper";
import { UserService } from "./user.service";
import { getNHoursBack, HOUR } from "./utils/time.util";
import { response } from "express";
import { DatabaseUtil } from "./utils/database.util";

export class PingService {
    
    public static async initialize() {
        console.log(`Initializing Pings... Cleaning old pings`);
        await PingService.cleanupOldPings();
        console.log(`Pings Initialized!`);
    }
    
    public static async getPings(userId: string): Promise<EntityList<Ping>> {
        const userGroups = await GroupsService.findAll(userId);
        const groupIds = userGroups.entities.map(entity => entity.id);
        
        const pingsRef = await FirebaseService.getDatabase()
            .collection(PingEntity.TABLE_NAME)
            .where("groupId", "in", groupIds)
            .get();
        
        const pings = pingsRef.docs.map(pingEntity => {
            return PingMapper.fromEntity(pingEntity);
        });
        
        return new EntityList(pings, pings.length);
    }
    
    public static async getPingResponses(pingId: string, userId: string): Promise<PingAggregated> {
        
        const pingRef = await FirebaseService.getDatabase()
            .collection(PingEntity.TABLE_NAME)
            .doc(pingId)
            .get();
        
        if (pingRef.exists) {
            const ping = PingMapper.fromEntity(pingRef);
            
            if (await GroupsService.isMemberOfGroup(userId, ping.groupId)) {
                
                const responsesRef = await FirebaseService.getDatabase()
                    .collection(PingResponseEntity.TABLE_NAME)
                    .where("pingId", "==", pingId)
                    .get();
                
                const responses = responsesRef.docs.map(responseEntity => {
                    return PingMapper.responseFromEntity(responseEntity);
                });
                
                return new PingAggregated(ping, responses);
            } else {
                throw new NotFoundError("Group not found!");
            }
        } else {
            throw new NotFoundError("Ping not found!");
        }
    }
    
    public static async pingGroup(ping: Ping, userId: string): Promise<EntityIdentifier> {
        Validator.assertNotNull(ping, null, "Ping");
        Validator.assertNotBlank(ping.groupId, "groupId", "Ping");
        
        if (await GroupsService.isMemberOfGroup(userId, ping.groupId)) {
            
            const group = await FirebaseService.getDatabase()
                .collection(GroupEntity.TABLE_NAME)
                .doc(ping.groupId)
                .get();
            
            if (!group.exists) {
                throw new NotFoundError("Group not found!");
            }
            
            const entity = new PingEntity();
            entity.groupId = group.id;
            entity.pingerId = userId;
            
            const pingRef = await FirebaseService.getDatabase()
                .collection(PingEntity.TABLE_NAME)
                .add(entity.raw());
            
            const username = await UserService.getUserDisplayName(userId);
            
            const topic = `PING.${group.id}`;
            const data = {
                pingId: pingRef.id,
                username,
                userId,
                groupId: ping.groupId,
                groupName: group.get("name")
            };
            
            Logger.info("User %s (%s) pinged group %s (%s)!", username, userId, group.get("name"), group.id);
            
            await FirebaseService.sendCloudMessage(topic, data);
            
            PingService.schedulePingCleanup(pingRef.id);
            
            return new EntityIdentifier(pingRef.id);
        } else {
            throw new NotFoundError("Group not found!");
        }
    }
    
    public static async handlePingResponse(pingResponse: PingResponse): Promise<EntityIdentifier> {
        
        Validator.assertNotNull(pingResponse, null, "PingResponse");
        Validator.assertNotBlank(pingResponse.pingId, "pingId", "PingResponse");
        Validator.assertNotBlank(pingResponse.response, "response", "PingResponse");
        
        const pingRef = await FirebaseService.getDatabase().collection(PingEntity.TABLE_NAME).doc(pingResponse.pingId).get();
        
        if (pingRef.exists) {
            
            const responseEntity = PingMapper.responseToEntity(pingResponse);
            
            const savedEntity = await FirebaseService.getDatabase()
                .collection(PingResponseEntity.TABLE_NAME)
                .add(responseEntity.raw());
            
            const username = UserService.getUserDisplayName(pingResponse.userId);
            const group = await GroupsService.find(pingRef.get("groupId"), pingResponse.userId);
            
            const topic = `PING.REPLY.${group.id}`;
            const data = {
                pingId: pingResponse.pingId,
                userId: pingResponse.userId,
                username,
                groupId: group.id,
                groupName: group.name,
                response: pingResponse.response
            };
            
            await FirebaseService.sendCloudMessage(topic, data);
            
            return new EntityIdentifier(savedEntity.id);
            
        } else {
            throw new NotFoundError("Ping doesn't exists!");
        }
    }
    
    public static async cleanupOldPings() {
        const sixHoursAgo = getNHoursBack(6);
        
        const oldPings = await FirebaseService.getDatabase()
            .collection(PingEntity.TABLE_NAME)
            .where("createdAt", "<", sixHoursAgo)
            .get();
        
        const pingIds = oldPings.docs.map(entity => {
            return FirebaseService.getDatabase().doc("pings/" + entity.id);
        });
        
        // Cleanup ping entities
        await DatabaseUtil.deleteQuery(oldPings);
        
        // Cleanup ping responses
        const batch = FirebaseService.getDatabase().batch();
        pingIds.forEach(pingRef => {
            batch.delete(pingRef);
        });
        await batch.commit();
    }
    
    /**
     * Deletes ping entity (and related responses) after specified time has elapsed. Used for removing specific ping entities.
     * On startup, all entries older than 6h will be removed for stragglers.
     * @param pingId id of ping entity
     */
    private static schedulePingCleanup(pingId: string): void {
        const cleanupInterval = 6 * HOUR;
        // TODO: delete responses as well
        setTimeout(async () => {
            
            await FirebaseService.getDatabase()
                .collection(PingEntity.TABLE_NAME)
                .doc(pingId)
                .delete();
            
            const responsesRef = await FirebaseService.getDatabase()
                .collection(PingResponseEntity.TABLE_NAME)
                .where("pingId", "==", pingId)
                .get();
            await DatabaseUtil.deleteQuery(responsesRef);
            
        }, cleanupInterval);
    }
    
}
