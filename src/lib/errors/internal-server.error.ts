import { BaseError } from "./base.error";
import { Rest } from "../rest.models";

export class InternalServerError extends BaseError {
    readonly statusCode = Rest.STATUS_INTERNAL_SERVER_ERROR;
    
    constructor(message: string | object = "Server error!") {
        super(message);
    }
}
