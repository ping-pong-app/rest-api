import { BaseError } from "./base.error";

export class InternalServerError extends BaseError {
    readonly statusCode = 500;
    
    constructor(message: string | object = "Server error!") {
        super(message);
    }
}
