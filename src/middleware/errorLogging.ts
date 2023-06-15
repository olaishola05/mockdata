import { Request, Response, NextFunction } from 'express';

const errorLogging = (error: any, req: Request, res: Response, next: NextFunction) => {
  const customError: boolean = error.constructor.name === 'NodeError' || error.constructor.name === 'SyntaxError' ? false : true;

  console.log('ERROR');
  console.log(`Type: ${error.constructor.name === 'NodeError' ? 'UnhandledError' : error.constructor.name}`);
  console.log('Path: ' + req.path);
  console.log(`Status code: ${error.statusCode || 500}`);
  console.log(error.stack);
};

export default errorLogging;