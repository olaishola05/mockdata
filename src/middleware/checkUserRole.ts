import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils'
import { User, PrismaClient } from '@prisma/client';



export const checkUserRole = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userPrismaClient = new PrismaClient();
        const user: User | null = await userPrismaClient.user.findUnique({
            where: {
                id: req.user.id,
            },
        });

        if (!user) {
            return next(new UnauthorizedError(user.firstName));
        }

        if (!roles.includes(user.role)) {
            return next(new ForbiddenError());
        }

        next();
    }
}
