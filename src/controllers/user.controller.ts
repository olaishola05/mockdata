import { Request, Response, NextFunction } from "express";
import { User, PrismaClient } from '@prisma/client';
import { asyncHandler, NotFoundError } from "utils";
import { errorResponse } from "middleware";

const userPrismaClient = new PrismaClient();

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

export const getUserById = asyncHandler (async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user: User | null = await userPrismaClient.user.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      processes: true,
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

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: User = req.body;
    const user: User = await userPrismaClient.user.create({
      data: {...userData}
    });
    res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const userData: User = req.body;
    const updatedUser: User = await userPrismaClient.user.update({
      where: {
        id: userId,
      },
      data: {...userData},
    });
    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const deletedUser: User = await userPrismaClient.user.delete({
      where: {
        id: userId,
      },
    });
    res.status(200).json({
      status: 'success',
      data: deletedUser,
    });
  } catch (error) {
    console.log(error);
  }
}