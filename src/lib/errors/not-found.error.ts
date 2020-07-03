import { BaseError } from "./base.error";

export class Http404Error extends BaseError {
    readonly statusCode = 404;
    
    constructor(message: string | object = "Not found!") {
        super(message);
    }
}
