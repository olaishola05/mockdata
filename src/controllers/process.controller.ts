import { Request, Response, NextFunction } from 'express';
import {Process, PrismaClient } from '@prisma/client';
import { BadRequestError, NotFoundError, asyncHandler } from '../utils';
import { errorResponse } from '../middleware';

const processPrismaClient = new PrismaClient();

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

export const getAllProcesses = asyncHandler(async (req: Request, res: Response, next: NextFunction, error: any): Promise<void> => {
  const processes: Process[] = await processPrismaClient.process.findMany({});
    res.status(200).json({
      status: 'success',
      message: 'All processes fetched successfully',
      data: processes,
      nHits: processes.length, 
    });

    next(errorResponse(req, res, next, error))
})

export const getProcessById = asyncHandler(async (req: Request, res: Response, next: NextFunction, error: any): Promise<void> => {
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

    next(errorResponse(req, res, next, error))
})

export const createProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction, error: any): Promise<void> => {
  const processData: Process = req.body;

  const { firstName, lastName, phone, assigneeId } = processData;

  if (!firstName || !lastName || !phone || !assigneeId) {
    return next(new BadRequestError('Please provide all required fields'))
  }
  
  const process: Process = await processPrismaClient.process.create({
      data: {
        firstName: processData.firstName,
        lastName: processData.lastName,
        phone: processData.phone,
        assignee: {connect: {id: processData.assigneeId}},
      }
    });
    res.status(201).json({
      status: 'success',
      message: 'Process created successfully',
      data: process,
    });

    next(errorResponse(req, res, next, error))
})

export const updateProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction, error: any): Promise<void> => {
  const processId = req.params.id;
  const checkProcess = await checkProcessExist(processId);

  if (!checkProcess) {
    return next(new NotFoundError('process'))
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
      data: process,
    });

    next(errorResponse(req, res, next, error))
});

export const deleteProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction, error: any): Promise<void> => {
  const processId = req.params.id;
  const checkProcess = await checkProcessExist(processId);

  if (!checkProcess) {
    return next(new NotFoundError('process'))
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

    next(errorResponse(req, res, next, error))
})
