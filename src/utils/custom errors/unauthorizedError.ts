import BaseError from "./baseError";

class UnauthorizedError extends BaseError {
  userName: string;
  constructor(userName: string) {
    super(`Dear ${userName}! You are not authorized to access this resource.`, 401);
    this.userName = userName;
  }
}

export default UnauthorizedError;