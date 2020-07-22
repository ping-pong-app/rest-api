import { BaseError } from "./base.error";
import { Rest } from "../rest.models";

export class BadRequestError extends BaseError {
    readonly statusCode = Rest.STATUS_BAD_REQUEST;
    
    constructor(message: string | object = "Bad request!") {
        super(message);
    }
}
