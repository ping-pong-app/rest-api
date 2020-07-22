import { BaseError } from "./base.error";
import { Rest } from "../rest.models";

export class ConflictError extends BaseError {
    readonly statusCode = Rest.STATUS_CONFLICT;
    
    constructor(message: string | object = "Conflict!") {
        super(message);
    }
}
