import { Connection, createConnection } from "typeorm";

export class PersistenceManager {
    
    private static connection: Connection;
    
    public static async connect(): Promise<void> {
        
        const {
            APP_DB,
            APP_DB_HOST,
            APP_DB_PORT,
            APP_DB_USER,
            APP_DB_PASSWORD,
            APP_DB_AUTO_DDL
        } = process.env;
        
        PersistenceManager.connection = await createConnection({
            type: "postgres",
            host: APP_DB_HOST || "localhost",
            database: APP_DB || "ping-api",
            port: parseInt(APP_DB_PORT || "5432", 10),
            username: APP_DB_USER || "postgres",
            password: APP_DB_PASSWORD || "postgres",
            synchronize: APP_DB_AUTO_DDL === "true",
            logging: true,
            entities: ["dist/persistence/**/*.js"]
        });
        
        // console.log(PersistenceManager.connection);
    }
    
    public static getInstance(): Connection {
        return PersistenceManager.connection;
    }
    
}
