import { NextFunction, Request, Response } from "express";
import { FirebaseConfig } from "../../config/firebase.config";

export const developmentModeFilter = async (req: Request, res: Response, next: NextFunction) => {
    const {NODE_ENV} = process.env;
    if (NODE_ENV === "production") {
        res.status(403).send();
    } else {
        next();
    }
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    try {
        res.locals.jwt = await FirebaseConfig.verifyToken(token);
        next();
    } catch (err) {
        res.status(401)
            .header("WWW-Authenticate", "Bearer realm=\"ping-pong\", charset=\"UTF-8\"")
            .json({
                error: "Unauthorized!",
                status: 401
            });
    }
};
