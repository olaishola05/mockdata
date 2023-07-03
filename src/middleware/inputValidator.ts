import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z } from "zod";

const reqBodyValidator = (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();

    } catch (error: any) {
      let err = error
      if (err instanceof z.ZodError) {
        err = err = err.issues.map((e: any) => ({ path: e.path[0], message: e.message }));
      }
      res.status(400).json({
        status: 'error',
        message: err,
      });
    }
};


export default reqBodyValidator;
