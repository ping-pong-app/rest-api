import { NextFunction, Request, Response } from "express";
import { AuthConfigurator } from "../../config/auth.config";

export const developmentModeFilter = async (req: Request, res: Response, next: NextFunction) => {
    const {NODE_ENV} = process.env;
    if (NODE_ENV === "production") {
        res.status(403).send();
    } else {
        next();
    }
};

export const propagateTokenPayload = async (req: Request, res: Response, next: NextFunction) => {
    const token = AuthConfigurator.getDecodedToken(req);
    if (token) {
        res.locals.jwt = token;
    }
};
