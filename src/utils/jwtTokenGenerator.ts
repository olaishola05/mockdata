import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';


export const jwtTokenGenerator = (payload: User) => {
    return jwt.sign({
        id: payload.id, email: payload.email
    }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
}

export const jwtTokenVerifier = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY!);
}