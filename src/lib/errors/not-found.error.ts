import { BaseError } from "./base.error";
import { Rest } from "../rest.models";

export class NotFoundError extends BaseError {
    readonly statusCode = Rest.STATUS_NOT_FOUND;
    
    constructor(message: string | object = "Not found!") {
        super(message);
    }
}
