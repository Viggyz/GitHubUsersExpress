import { CustomError } from "./custom-error";

export class RateLimitExceededError extends CustomError {
    statusCode = 429;

    constructor() {
        super("Rate Limit Exceeded");

        Object.setPrototypeOf(this, RateLimitExceededError.prototype);
    }

    serializeErrors() {
        return [{ message: "Rate Limit Exceeded" }]
    }

}