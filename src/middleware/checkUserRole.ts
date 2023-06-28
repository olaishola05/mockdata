import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils'
import { User, PrismaClient, Role } from '@prisma/client';

export const checkUserRole = (role: Role[]) => {
    return async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userPrismaClient = new PrismaClient();

        const email = res.locals.jwtPayload?.email;

        if (!email) {
            return next(new UnauthorizedError('user that is not logged in'));
        }

        const user: User | null = await userPrismaClient.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return next(new UnauthorizedError('user account'));
        }

        if (!role.includes(user.role)) {
            return next(new ForbiddenError());
        }

        next();
    }
}
