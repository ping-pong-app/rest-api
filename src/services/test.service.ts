import { PersistenceManager } from "../config";
import { GroupEntity } from "../persistence";


const testGroups: GroupEntity[] = [
    {
        name: "3. stuk",
        ownerId: "c184bb71-8ba1-45d7-90d9-38aa88f06dc2"
    },
    {
        name: "klapa",
        ownerId: "c184bb71-8ba1-45d7-90d9-38aa88f06dc2"
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
