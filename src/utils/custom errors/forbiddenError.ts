import BaseError from "./baseError";

class ForbiddenError extends BaseError {
    constructor() {
        super(`You are not authorized to access this resource.`, 403);
    }
}

export default ForbiddenError;