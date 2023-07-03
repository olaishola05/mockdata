import { Request, Response, NextFunction } from "express";
import { Process, PrismaClient, User } from "@prisma/client";
import { BadRequestError, ForbiddenError, NotFoundError, asyncHandler } from '../utils';
import { getUser } from "./task.controller";

const processPrismaClient = new PrismaClient();

const checkProcessExist = async (processId: string): Promise<Process | null> => {
  const process: Process | null = await processPrismaClient.process.findUnique({
    where: {
      id: processId,
    },
    include: {
      user: true,
    },
  });
  return process;
}

export const createProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  const { name, color, icon } = req.body;

  const user: User | null = await getUser(userId!);

  if (!user) {
    return next(new NotFoundError('user'))
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'TEAM_LEAD' && user?.role !== 'TASK_MANAGER') {
    return next(new ForbiddenError('You are not authorized to create a process'))
  }
 
  const process: Process = await processPrismaClient.process.create({
    data: {
      name,
      color,
      icon,
      user: { connect: { id: userId } },
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'process created successfully',
    data: process,
  });
});

export const getAllProcesses = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const processes: Process[] = await processPrismaClient.process.findMany({
    include: {
      user: true,
    }
  });
  res.status(200).json({
    status: 'success',
    message: 'processes fetched successfully',
    data: processes,
  });
});

export const getProcessById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const processId = req.params.id;
  const process = await checkProcessExist(processId);

  if (!process) {
    return next(new NotFoundError('process'))
  }
  res.status(200).json({
    status: 'success',
    message: 'process found successfully',
    data: process,
  });
});

export const updateProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const processId = req.params.id;
  const userId = req.user?.id;
  
  const user: User | null = await getUser(userId!);

  if (!user) {
    return next(new NotFoundError('user'))
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'TEAM_LEAD' && user?.role !== 'TASK_MANAGER') {
    return next(new ForbiddenError('You are not authorized to update a process'))
  }

  const process: Process | null = await checkProcessExist(processId);

  if (!process) {
    return next(new NotFoundError('process'))
  }

  const updatedProcess: Process = await processPrismaClient.process.update({
    where: {
      id: processId,
    },
    data: {
      ...req.body,
      updatedAt: new Date(),
    }
  });

  res.status(200).json({
    status: 'success',
    message: 'process updated successfully',
    data: updatedProcess,
  });
});

export const deleteProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const processId = req.params.id;
  const userId = req.user?.id;
  
  const user: User | null = await getUser(userId!);

  if (!user) {
    return next(new NotFoundError('user'))
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'TEAM_LEAD' && user?.role !== 'TASK_MANAGER') {
    return next(new ForbiddenError('You are not authorized to delete this process'))
  }

  const process: Process | null = await checkProcessExist(processId);

  if (!process) {
    return next(new NotFoundError('process'))
  }

  await processPrismaClient.process.delete({
    where: {
      id: processId,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'process deleted successfully',
  });
});