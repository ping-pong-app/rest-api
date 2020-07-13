import { NextFunction, Request, Response, Router } from "express";

export type MiddlewareSetupFunction = (router: Router) => void;

export type RouteHandler = (request: Request, response: Response, next: NextFunction) => Promise<void> | void;

export type ErrorWithCode = Error & { code?: string };

export type HttpMethod = "get" | "post" | "delete" | "put" | "patch" | "option" | "head";

export type Route = {
    path: string;
    method: HttpMethod;
    handler: RouteHandler | RouteHandler[]
};

export type AuthConfiguration = {
    authServerUrl: string;
    realm: string;
    clientId: string;
    clientSecret?: string;
};

export interface JsonWebToken {
    sub: string;
    exp: Date;
    iss: string;
    azp: string;
    scope: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    realm_access: {
        roles: string[];
    };
    resource_access: {
        [key: string]: {
            roles: string[];
        }
    };
}
