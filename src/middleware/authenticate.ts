import { Request, Response, NextFunction } from 'express';
import { jwtTokenVerifier, UnauthorizedError } from '../utils';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: any;
}

const authenticate = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // res.status(401).json({ message: 'Access denied. No token provided.' });
    next(new UnauthorizedError('user'));
    return;
  }

  let decoded: string | JwtPayload;

  try {
    decoded = jwtTokenVerifier(token);
    console.log(decoded, req.user)
    res.locals.jwtPayload = decoded;
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export default authenticate;