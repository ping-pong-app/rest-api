import { BaseError } from "./base.error";
import { Rest } from "../rest.models";

export class UnathorizedError extends BaseError {
    readonly statusCode = Rest.STATUS_UNAUTHORIZED;
    
    constructor(message: string | object = "Unauthorized!") {
        super(message);
    }
}
