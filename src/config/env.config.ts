import { Environment } from "./common.models";

export class EnvConfig {
    
    private static environment: Environment;
    
    public static initialize() {
        const {
            APP_SERVICE_VERSION = "1.0.0-SNAPSHOT",
            APP_SERVICE_NAME = "ping-api",
            APP_SERVICE_ENV = "dev"
        } = process.env;
        
        EnvConfig.environment = {
            serviceEnvironment: APP_SERVICE_ENV,
            serviceName: APP_SERVICE_NAME,
            serviceVersion: APP_SERVICE_VERSION
        };
    }
    
    public static getEnvironment(): Environment {
        return EnvConfig.environment;
    }
    
}
