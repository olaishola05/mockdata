import { Request, Response, NextFunction } from "express";
import { User, PrismaClient } from '@prisma/client';
import { asyncHandler, ForbiddenError, NotFoundError } from "../utils";

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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const users: User[] = await userPrismaClient.user.findMany({
      include: {
        processes: true,
      },
    });

    if (!users) {
      return next(new NotFoundError('users'))
    }

    res.status(200).json({
      status: 'success',
      message: 'All users',
      data: users,
      nHits: users.length,
    });
  }
)

export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = await checkUserExist(req.params.id);

  if (!user) {
    res.status(404).json({
      status: 'error',
      message: 'User not found',
      statusCode: 404,
    });
    next(new NotFoundError('user'))
  }

  res.status(200).json({
    status: 'success',
    data: {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      role: user?.role,
      workspace: user?.workspace,
    },
  });

})

export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.id;
  const checkUser = await checkUserExist(userId);
  console.log(req.user, 'req user')
  
  if (!checkUser) {
    return next(new NotFoundError('user'))
  }
  
  
  if(checkUser?.id !== req.user?.id) {
    return next(new ForbiddenError())
  }
  
  const userData: User = req.body;
  const updatedUser: User = await userPrismaClient.user.update({
    where: {
      id: userId,
    },
    data: { 
      ...userData,
      updatedAt: new Date(), 
    },
  });
  res.status(200).json({
    status: 'success',
    message: `User with id ${userId} updated successfully`,
    data: updatedUser,
  });
})

export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.id;
  const checkUser = await checkUserExist(userId);

  if (!checkUser) {
    return next(new NotFoundError('user'))
  }

  if(req.user?.role !== 'ADMIN') {
    return next(new ForbiddenError("You don't have permission to delete this user"))
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
})