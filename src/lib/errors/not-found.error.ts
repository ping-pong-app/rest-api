import { BaseError } from "./base.error";

export class NotFoundError extends BaseError {
    readonly statusCode = 404;
    
    constructor(message: string | object = "Not found!") {
        super(message);
    }
}
