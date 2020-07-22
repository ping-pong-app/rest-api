import { NextFunction, Request, Response, Router } from "express";
import { BaseError, NotFoundError, ValidationError } from "../../lib";
import { ErrorWithCode } from "../../config";


export const handle404Error = (router: Router) => {
    router.use((_: Request, __: Response) => {
        throw new NotFoundError("Path not found!");
    });
};

export const handleCustomError = (router: Router) => {
    router.use((err: ErrorWithCode, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof BaseError) {
            
            if (err instanceof ValidationError) {
                const validationBody: any = {
                    status: err.statusCode,
                    message: err.message,
                    type: err.name
                };
                if (err.fieldName) {
                    validationBody.fieldName = err.fieldName;
                }
                if (err.entity) {
                    validationBody.entity = err.entity;
                }
                res.status(err.statusCode).json(validationBody);
            } else {
                res.status(err.statusCode).json({
                    status: err.statusCode,
                    message: err.message,
                    type: err.name
                });
            }
            
        } else {
            next(err);
        }
    });
};

export const handleUnknownError = (router: Router) => {
    router.use((err: ErrorWithCode, req: Request, res: Response, _: NextFunction) => {
        console.error(err);
        if (process.env.NODE_ENV === "production") {
            res.status(500).json({
                status: 500,
                message: err.message
            });
        } else {
            res.status(500).json({
                status: 500,
                message: err.message,
                stack: err.stack
            });
        }
    });
};
