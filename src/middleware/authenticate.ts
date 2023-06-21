import { Request, Response, NextFunction } from 'express';
import { jwtTokenVerifier } from '../utils';

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = <string>req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  let decoded: any;

  try {
    decoded = jwtTokenVerifier(token);
    // req.user = decoded;
    // res.locals.jwtPayload = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
    return;
  }
};

export default authenticate;