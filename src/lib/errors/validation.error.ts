import { BaseError } from "./base.error";

export class ValidationError extends BaseError {
    readonly statusCode = 422;
    public entity: string;
    public fieldName: string;
    
    constructor(message: string | object = "Validation failed!") {
        super(message);
    }
    
    public setEntity(entity: string): ValidationError {
        this.entity = entity;
        return this;
    }
    
    public setFieldName(fieldName: string): ValidationError {
        this.fieldName = fieldName;
        return this;
    }
}
