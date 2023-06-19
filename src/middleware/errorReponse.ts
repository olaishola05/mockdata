import { Request, Response, NextFunction } from 'express';

const errorResponse = (req: Request, res: Response, next: NextFunction, err: any) => {
  const customErrors = ['NodeError', 'SyntaxError', 'TypeError'];
  const isCustomError = err && !customErrors.includes(err.constructor.name);

  const statusCode = err && err.statusCode || 500;
  const message = err && err.message || 'Internal Server Error';

  res.status(statusCode).json({
    response: 'Error',
    error: {
      type: isCustomError ? err.constructor.name : 'UnhandledError',
      path: req.path,
      statusCode,
      message,
    }
  });

  next(err);
}

export default errorResponse;