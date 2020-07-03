export abstract class BaseError extends Error {
    readonly statusCode!: number;
    readonly name!: string;
    
    protected constructor(message: object | string) {
        super(JSON.stringify(message));
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
