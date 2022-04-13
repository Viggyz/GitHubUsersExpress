import { CustomError } from './custom-error';

export class CacheConnectionError extends CustomError {
    statusCode = 500;

    constructor() {
        super("Failed to Connect to Cache");

        Object.setPrototypeOf(this, CacheConnectionError.prototype);
    }

    serializeErrors() {
        return [{ message: "Unable to connect to cache" }];
    }
}