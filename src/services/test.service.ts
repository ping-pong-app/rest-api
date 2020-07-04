import { PersistenceManager } from "../config";
import { GroupEntity } from "../persistence";


const testGroups: GroupEntity[] = [
    {
        name: "3. stuk",
        ownerId: "1"
    },
    {
        name: "klapa",
        ownerId: "2"
    }
];

export class TestService {
    
    public static async fillInitialData(): Promise<void> {
        await TestService.fillGroups();
    }
    
    private static async fillGroups(): Promise<void> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        await repository.insert(testGroups);
    }
    
    public static async emptyData(): Promise<void> {
        await TestService.emptyGroups();
    }
    
    private static async emptyGroups(): Promise<void> {
        const repository = PersistenceManager.getInstance().getRepository(GroupEntity);
        await repository
            .createQueryBuilder()
            .delete()
            .from(GroupEntity)
            .execute();
    }
    
}
