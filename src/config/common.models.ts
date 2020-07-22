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

export interface Environment {
    readonly serviceName: string;
    readonly serviceVersion: string;
    readonly serviceEnvironment: string;
}
