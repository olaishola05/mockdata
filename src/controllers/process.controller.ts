import { Request, Response, NextFunction } from 'express';
import {Process, PrismaClient, Role, User } from '@prisma/client';
import { BadRequestError, ForbiddenError, NotFoundError, ProcessSchemaType, asyncHandler } from '../utils';

const processPrismaClient = new PrismaClient();
const userPrismaClient = new PrismaClient();

const checkProcessExist = async (processId: string): Promise<Process | null> => {
  const process: Process | null = await processPrismaClient.process.findUnique({
    where: {
      id: processId,
    },
    include: {
      assignee: true,
    },
  });
  return process;
}

const getUserRole = async (userId: string): Promise<Role | null> => {
    const user: User | null = await userPrismaClient.user.findUnique({
    where: {
      id: userId,
    }
  });
    return user?.role;
}


const generateProcessId = (): string => {
  const processId = Math.floor(100000000 + Math.random() * 900000000);
  return `IT${processId}`;
}

export const getAllProcesses = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const processes: Process[] = await processPrismaClient.process.findMany({});

  if(!processes) {
    return next(new NotFoundError('Processes'))
  }

    res.status(200).json({
      status: 'success',
      message: 'All processes fetched successfully',
      data: processes,
      nHits: processes.length, 
    });

})

export const getProcessById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const processId = req.params.id;
    const process = await checkProcessExist(processId);

    if (!process) {
      return next(new NotFoundError('process'))
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Process found successfully',
      data: process,
    });
})

export const createProcess = asyncHandler(async (req: Request<{}, {}, ProcessSchemaType["body"]>, res: Response, next: NextFunction): Promise<void> => {
  const processData = req.body;
  const userId = req.user?.id;
  const user = await userPrismaClient.user.findUnique({
    where: {
      id: userId,
    }
  });

  const { firstName, lastName, phone } = processData;

  if (!firstName || !lastName || !phone) {
    return next(new BadRequestError('Please provide all required fields'))
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'TEAM_LEAD' && user?.role !== 'TASK_MANAGER') {
    return next(new ForbiddenError("You don't have permission to perform this action"));
  }
  
  const process: Process = await processPrismaClient.process.create({
      data: {
        firstName: processData.firstName,
        lastName: processData.lastName,
        phone: processData.phone,
        processId: generateProcessId(),
        assignee: {connect: {id: user.id}},
      }
    });
    res.status(201).json({
      status: 'success',
      message: 'Process created successfully',
      data: process,
    });
})

export const updateProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const processId = req.params.id;
  const checkProcess = await checkProcessExist(processId);
  const user = req.user;

  if (!checkProcess) {
    return next(new NotFoundError('process'))
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'TEAM_LEAD' && user?.role !== 'TASK_MANAGER') {
    return next( new ForbiddenError("You don't have permission to perform this action"));
  }
  
  const processData: Process = req.body;
  const process: Process = await processPrismaClient.process.update({
      where: {
        id: processId,
      },
      data: {
        ...processData,
      }
    });
    res.status(201).json({
      status: 'success',
      message: 'Process updated successfully',
      data: {
        ...process,
        updatedAt: new Date(),
      },
    });
});

export const deleteProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const processId = req.params.id;
  const checkProcess = await checkProcessExist(processId);
  const user = req.user;

  if (!checkProcess) {
    return next(new NotFoundError('process'))
  }

  if(user?.role !== 'ADMIN') {
    return next( new ForbiddenError("You don't have permission to perform this action"));
  }
  
  const process: Process = await processPrismaClient.process.delete({
      where: {
        id: processId,
      },
    });
    res.status(201).json({
      status: 'success',
      message: 'Process deleted successfully',
      data: process,
    });
})
