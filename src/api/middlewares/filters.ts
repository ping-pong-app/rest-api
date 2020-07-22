import { NextFunction, Request, Response } from "express";
import { FirebaseService } from "../../services";
import { EnvConfig } from "../../config/env.config";
import { Rest } from "../../lib";

export const developmentModeFilter = async (req: Request, res: Response, next: NextFunction) => {
    const {NODE_ENV} = process.env;
    if (NODE_ENV === "production") {
        res.status(Rest.STATUS_FORBIDDEN).send();
    } else {
        next();
    }
};

export const versionInfoFilter = async (req: Request, res: Response, next: NextFunction) => {
    
    const env = EnvConfig.getEnvironment();
    
    res.header(Rest.X_SERVICE_NAME, env.serviceName);
    res.header(Rest.X_SERVICE_VERSION, env.serviceVersion);
    res.header(Rest.X_SERVICE_ENV, env.serviceEnvironment);
    
    next();
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header(Rest.AUTHORIZATION);
    try {
        res.locals.jwt = await FirebaseService.verifyToken(token);
        next();
    } catch (err) {
        res.status(Rest.STATUS_UNAUTHORIZED)
            .header(Rest.WWW_AUTHENTICATE, "Bearer realm=\"ping-pong\", charset=\"UTF-8\"")
            .json({
                error: "Unauthorized!",
                status: Rest.STATUS_UNAUTHORIZED
            });
    }
};
