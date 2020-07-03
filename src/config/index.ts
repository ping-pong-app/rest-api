import { PersistenceManager } from "./pg.config";
import { MiddlewareSetupFunction, Route } from "./common.models";
import { Router } from "express";
import { AuthConfigurator } from "./auth.config";


export const initConfiguration = async () => {
    await PersistenceManager.connect();
    await AuthConfigurator.configure();
};

export const applyMiddleware = (setupFunctions: MiddlewareSetupFunction[], router: Router) => {
    setupFunctions.forEach(func => {
        func(router);
    });
};

export const applyRoutes = (routes: Route[], router: Router) => {
    routes.forEach(route => {
        const {path, method, handler} = route;
        (router as any)[method](path, handler);
    });
};

export { PersistenceManager };
export {
    RouteHandler,
    MiddlewareSetupFunction,
    Route,
    AuthConfiguration,
    ErrorWithCode,
    HttpMethod
} from "./common.models";
