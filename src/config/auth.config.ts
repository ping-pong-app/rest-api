import { AuthConfiguration } from "./common.models";


export class AuthConfigurator {
    
    private static configuration: AuthConfiguration;
    
    public static async configure(): Promise<void> {
        
        const {
            APP_AUTH_SERVER_URL,
            APP_AUTH_REALM,
            APP_AUTH_CLIENT_ID,
            APP_AUTH_CLIENT_SECRET
        } = process.env;
        
        AuthConfigurator.configuration = {
            authServerUrl: APP_AUTH_SERVER_URL || "https://keycloak.mjamsek.com/auth",
            realm: APP_AUTH_REALM || "",
            clientId: APP_AUTH_CLIENT_ID || "",
            clientSecret: APP_AUTH_CLIENT_SECRET
        };
        
    }
    
    public static getConfiguration(): AuthConfiguration {
        return AuthConfigurator.configuration;
    }
    
}
