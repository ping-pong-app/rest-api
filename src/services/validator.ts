import { Optional, ValidationError } from "../lib";

export class Validator {
    
    /**
     * Asserts given value is not null or undefined or falsy, otherwise throws error
     * @param value value to be tested
     * @param [fieldName] name of field being tested
     * @param [entity] name of entity type being tested
     * @throws ValidationError if given value is null or undefined or falsy
     */
    public static assertNotNull(value: any, fieldName?: string | null, entity?: string | null): void {
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
    
    /**
     * Asserts given value is not empty string, otherwise throws error
     * @param value value to be tested
     * @param [fieldName] name of field being tested
     * @param [entity] name of entity type being tested
     * @throws ValidationError if given string is null, undefined or empty
     */
    public static assertNotBlank(value: Optional<string>, fieldName?: string | null, entity?: string | null): void {
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
