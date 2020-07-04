import { ValidationError } from "../lib";

export class Validator {

    public static assertNotNull(value: any, fieldName?: string, entity?: string): void {
        if (!value) {
            const error = new ValidationError("Field must not be null!");
            if (fieldName) {
                error.setFieldName(fieldName);
            }
            if (entity) {
                error.setEntity(entity);
            }
            throw error;
        }
    }
    
    public static assertNotBlank(value: string, fieldName?: string, entity?: string): void {
        if (!value || value.trim().length === 0) {
            const error = new ValidationError("Field must not be blank!");
            if (fieldName) {
                error.setFieldName(fieldName);
            }
            if (entity) {
                error.setEntity(entity);
            }
            throw error;
        }
    }
    
}
