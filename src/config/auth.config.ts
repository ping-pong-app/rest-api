import { AuthConfiguration } from "./common.models";
import { Router } from "express";
import KeycloakClass, { Keycloak } from "keycloak-connect";


export class AuthConfigurator {
    
    private static configuration: AuthConfiguration;
    
    private static instance: Keycloak;
    
    public static configure(router: Router) {
        
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
        
        AuthConfigurator.instance = new KeycloakClass({}, {
            "auth-server-url": AuthConfigurator.configuration.authServerUrl,
            realm: AuthConfigurator.configuration.realm,
            resource: AuthConfigurator.configuration.clientId,
            "bearer-only": true,
            "ssl-required": "external",
            "confidential-port": 0,
        });
        
        router.use(AuthConfigurator.instance.middleware());
    }
    
    public static getConfiguration(): AuthConfiguration {
        return AuthConfigurator.configuration;
    }
    
    public static getInstance(): Keycloak {
        return AuthConfigurator.instance;
    }
    
}
