import { PersistenceManager } from "./pg.config";
import { MiddlewareSetupFunction, Route } from "./common.models";
import { Router } from "express";
import { FirebaseConfig } from "./firebase.config";


export const initConfiguration = async () => {
    await FirebaseConfig.initialize();
    await PersistenceManager.connect();
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
