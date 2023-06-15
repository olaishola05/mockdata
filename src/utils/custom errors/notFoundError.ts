import BaseError from "./baseError";

class NotFoundError extends BaseError {
  propertyName: string;
  constructor(propertyName: string) {
    super(`Property ${propertyName} not found.`, 404);
    this.propertyName = propertyName;
  }
}

export default NotFoundError;