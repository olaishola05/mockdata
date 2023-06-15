import { Request, Response, NextFunction } from "express";
import { User, PrismaClient } from '@prisma/client';
import { asyncHandler, NotFoundError, BadRequestError } from "../utils";
import { errorResponse } from "../middleware";

const userPrismaClient = new PrismaClient();

const checkUserExist = async (userId: string): Promise<User | null> => {
  const user: User | null = await userPrismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
}

export const getAllUsers = asyncHandler(
  async (error: any, req: Request, res: Response, next: NextFunction): Promise<void> => {
    const users: User[] = await userPrismaClient.user.findMany({
      include: {
        processes: true,
      },
    });
    res.status(200).json({
      status: 'success',
      message: 'All users',
      data: users,
      nHits: users.length,
    });

    next(errorResponse(error, req, res, next))
  }
)

export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user: User | null = await userPrismaClient.user.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return next(new NotFoundError('user'))
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
})

export const createUser = asyncHandler(async (error: any, req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userData: User = req.body;
  const { firstName, lastName, email, password } = userData;

  if (!firstName || !lastName || !email || !password) {
    return next(new BadRequestError('Please provide all required fields'))
  }
  const user: User = await userPrismaClient.user.create({
    data: { ...userData }
  });
  res.status(201).json({
    status: 'success',
    data: user,
  });

  next(errorResponse(error, req, res, next))
})

export const updateUser = asyncHandler(async (error: any, req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.id;
  const checkUser = await checkUserExist(userId);

  if (!checkUser) {
    return next(new NotFoundError('user'))
  }
  const userData: User = req.body;
  const updatedUser: User = await userPrismaClient.user.update({
    where: {
      id: userId,
    },
    data: { ...userData },
  });
  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });

  next(errorResponse(error, req, res, next))
})

export const deleteUser = asyncHandler(async (error: any, req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.id;
  const checkUser = await checkUserExist(userId);

  if (!checkUser) {
    return next(new NotFoundError('user'))
  }

  const deletedUser: User = await userPrismaClient.user.delete({
    where: {
      id: userId,
    },
  });
  res.status(200).json({
    status: 'success',
    data: deletedUser,
  });

  next(errorResponse(error, req, res, next))
})