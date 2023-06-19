import { Request, Response, NextFunction } from 'express';
import {Process, PrismaClient } from '@prisma/client';
import { BadRequestError, NotFoundError, asyncHandler } from '../utils';

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

export const createProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
})

export const updateProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
});

export const deleteProcess = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
})
