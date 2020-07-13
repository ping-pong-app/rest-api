import { AuthConfiguration, JsonWebToken } from "./common.models";
import { Request, Router } from "express";
import KeycloakClass, { Keycloak } from "keycloak-connect";


export class AuthConfigurator {
    
    private static configuration: AuthConfiguration;
    
    private static instance: Keycloak;
    
    public static configure(router: Router) {
        
        const {
            APP_AUTH_SERVER_URL = "https://keycloak.mjamsek.com/auth",
            APP_AUTH_REALM = "",
            APP_AUTH_CLIENT_ID = "",
            APP_AUTH_CLIENT_SECRET
        } = process.env;
        
        AuthConfigurator.configuration = {
            authServerUrl: APP_AUTH_SERVER_URL,
            realm: APP_AUTH_REALM,
            clientId: APP_AUTH_CLIENT_ID,
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
    
    public static getToken(req: Request): string | null {
        const authHeader = req.header("Authorization");
        if (authHeader) {
            if (authHeader.startsWith("Bearer")) {
                return authHeader.replace("Bearer ", "");
            }
            return authHeader;
        }
        return null;
    }
    
    public static decodeToken<T extends JsonWebToken>(token: string): T | null {
        if (!token) {
            return null;
        }
        const base64EncodedParts = token.split(".");
        if (base64EncodedParts.length > 1) {
            const base64Payload = base64EncodedParts[1];
            const decoded = Buffer.from(base64Payload, "base64").toString();
            return JSON.parse(decoded);
        }
        return null;
    }
    
    public static getDecodedToken<T extends JsonWebToken>(request: Request): T | null {
        const token = AuthConfigurator.getToken(request);
        if (token) {
            return AuthConfigurator.decodeToken(token);
        }
        return null;
    }
    
}
