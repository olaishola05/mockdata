import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { BadRequestError } from "../utils";

const reqBodyValidator = (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error: any) {
      next(new BadRequestError(error.message));
      // res.status(400).json({
      //     status: "error",
      //     message: error.message,
      //     statusCode: 400,
      // });
    }
};


export default reqBodyValidator;
