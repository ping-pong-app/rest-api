import { PersistenceManager } from "../config";
import { GroupEntity, GroupMemberEntity } from "../persistence";


const testGroups: GroupEntity[] = [
    {
        id: "b8c37402-9c00-472f-9c8d-82be30b9b72d",
        name: "3. stuk",
        ownerId: "BFTEQGbDsSXRRLDnGfo3GbBmiUZ2",
        createdAt: new Date(),
        updatedAt: new Date(),
        members: []
    },
    {
        id: "58db5ef7-6d68-46fc-9932-e8b7af6e08ee",
        name: "klapa",
        ownerId: "BFTEQGbDsSXRRLDnGfo3GbBmiUZ2",
        createdAt: new Date(),
        updatedAt: new Date(),
        members: []
    }
];

const groupMemberships: GroupMemberEntity[] = [
    {
        userId: "BFTEQGbDsSXRRLDnGfo3GbBmiUZ2",
    },
    {
        userId: "BFTEQGbDsSXRRLDnGfo3GbBmiUZ2"
    },
    {
        userId: "aZ8SKZyALsTNojzAQ6XUNXIFMgS2"
    },
];

export class TestService {
    
    public static async fillInitialData(): Promise<void> {
        await TestService.fillGroups();
    }
    
    private static async fillGroups(): Promise<void> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        await repository.insert(testGroups);
        
        groupMemberships[0].group = testGroups[0];
        groupMemberships[1].group = testGroups[1];
        groupMemberships[2].group = testGroups[0];
        
        const membershipRepository = PersistenceManager.getInstance().getRepository(GroupMemberEntity);
        await membershipRepository.insert(groupMemberships);
    }
    
    public static async emptyData(): Promise<void> {
        await TestService.emptyGroups();
    }
    
    private static async emptyGroups(): Promise<void> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        const membershipRepository = PersistenceManager.getInstance().getRepository(GroupMemberEntity);
    
        await membershipRepository
            .createQueryBuilder()
            .delete()
            .from(GroupMemberEntity)
            .execute();
        await repository
            .createQueryBuilder()
            .delete()
            .from(GroupEntity)
            .execute();
    }
    
}
