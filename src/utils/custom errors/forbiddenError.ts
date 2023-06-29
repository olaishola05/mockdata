import BaseError from "./baseError";

class ForbiddenError extends BaseError {
    message: string;
    constructor(message: string = 'You are not authorized to access this resource.') {
        super(message, 403);
        this.message = message;
    }
}

export default ForbiddenError;