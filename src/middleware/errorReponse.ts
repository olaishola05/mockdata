import { Request, Response, NextFunction } from 'express';

const errorResponse = (err: any, req: Request, res: Response, next: NextFunction) => {
  const customError: boolean = err.constructor.name === 'NodeError' || err.constructor.name === 'SyntaxError' || err.constructor.name === 'TypeError' ? false : true;

  res.status(err.statusCode || 500).json({
    response: 'Error',
    error: {
      type: customError === false ? "UnhandledError" : err.constructor.name,
      path: req.path,
      statusCode: err.statusCode || 500,
      message: err.message || 'Internal Server Error',
    }
  });

  next(err);
}

export default errorResponse;