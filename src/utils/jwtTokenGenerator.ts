import jwt from 'jsonwebtoken';


export const jwtTokenGenerator = (payload: any) => {
    return jwt.sign({
        user_id: payload.user.id, email: payload.email
    }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
}

export const jwtTokenVerifier = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY!);
}