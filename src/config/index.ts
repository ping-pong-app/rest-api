import { MiddlewareSetupFunction, Route } from "./common.models";
import { Router } from "express";
import { FirebaseConfig } from "./firebase.config";
import { CronConfig } from "./cron.config";
import { EnvConfig } from "./env.config";
import { LogConfig } from "./log.config";
import { PingService } from "../services";


export const initServerConfiguration = (router: Router) => {
    router.use(LogConfig.getLoggerMiddleware());
};

export const initConfiguration = async () => {
    await EnvConfig.initialize();
    await FirebaseConfig.initialize();
    await CronConfig.initialize();
    await PingService.initialize();
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

export {
    RouteHandler,
    MiddlewareSetupFunction,
    Route,
    ErrorWithCode,
    HttpMethod,
    Environment
} from "./common.models";
