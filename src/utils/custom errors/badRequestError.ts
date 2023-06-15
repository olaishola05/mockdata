import BaseError from "./baseError";

class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, 400);
  }
}

export default BadRequestError;