import { BaseError } from "./base.error";

export class UnathorizedError extends BaseError {
    readonly statusCode = 401;
    
    constructor(message: string | object = "Unauthorized!") {
        super(message);
    }
}
