import { Connection, createConnection, EntitySchema } from "typeorm";
import { ObjectType } from "typeorm/common/ObjectType";
import { Repository } from "typeorm/repository/Repository";

export class PersistenceManager {
    
    private static connection: Connection;
    
    public static async connect(): Promise<void> {
        
        const {
            APP_DB = "ping-api",
            APP_DB_HOST = "localhost",
            APP_DB_PORT = "5432",
            APP_DB_USER = "postgres",
            APP_DB_PASSWORD = "postgres",
            APP_DB_AUTO_DDL = "false"
        } = process.env;
        
        console.log(`Connecting to database on postgres://${APP_DB_HOST}:${APP_DB_PORT}/${APP_DB}`);
        try {
            
            PersistenceManager.connection = await createConnection({
                type: "postgres",
                host: APP_DB_HOST,
                database: APP_DB,
                port: parseInt(APP_DB_PORT, 10),
                username: APP_DB_USER,
                password: APP_DB_PASSWORD,
                synchronize: APP_DB_AUTO_DDL === "true",
                logging: true,
                entities: ["dist/persistence/**/*.js"]
            });
            
            console.log("Connected to database!");
        } catch (err) {
            console.error("Error connecting to database!", err);
            process.exit(1);
        }
    }
    
    public static getInstance(): Connection {
        return PersistenceManager.connection;
    }
    
    public static getRepository<E>(target: ObjectType<E> | EntitySchema<E> | string): Repository<E> {
        return PersistenceManager.connection.getRepository(target);
    }
    
}
