import { NextFunction, Request, Response } from "express";

export const developmentModeFilter = async (req: Request, res: Response, next: NextFunction) => {
    const {NODE_ENV} = process.env;
    if (NODE_ENV === "production") {
        res.status(403).send();
    } else {
        next();
    }
};
