import { Request, Response, NextFunction } from 'express';
import {Task, PrismaClient, User } from '@prisma/client';
import { BadRequestError, ForbiddenError, NotFoundError, taskSchemaType, asyncHandler } from '../utils';

const taskPrismaClient = new PrismaClient();
const userPrismaClient = new PrismaClient();

const checkTaskExist = async (taskId: string): Promise<Task | null> => {
  const task: task | null = await taskPrismaClient.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      assignee: true,
    },
  });
  return task;
}

const getUser = async (userId: string): Promise<User | null> => {
    const user: User | null = await userPrismaClient.user.findUnique({
    where: {
      id: userId,
    }
  });
    return user;
}


const generateTaskId = (): string => {
  const taskId = Math.floor(100000000 + Math.random() * 900000000);
  return `IT${taskId}`;
}

export const getAllTasks = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const tasks: Task[] = await taskPrismaClient.task.findMany({});

  if(!tasks) {
    return next(new NotFoundError('taskes'))
  }

    res.status(200).json({
      nHits: tasks.length, 
      status: 'success',
      message: 'All taskes fetched successfully',
      data: tasks,
    });

})

export const getTaskById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const taskId = req.params.id;
    const task = await checkTaskExist(taskId);

    if (!task) {
      return next(new NotFoundError('task'))
    }
    res.status(200).json({
      status: 'success',
      message: 'task found successfully',
      data: task,
    });
})

export const createTask = asyncHandler(async (req: Request<{}, {}, taskSchemaType["body"]>, res: Response, next: NextFunction): Promise<void> => {
  const taskData = req.body;
  const userId = req.user?.id;
  const user = await getUser(userId!);

  const { firstName, lastName, phone, description } = taskData;

  if (!firstName || !lastName || !phone || !description) {
    return next(new BadRequestError('Please provide all required fields'))
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'TEAM_LEAD' && user?.role !== 'TASK_MANAGER') {
    return next(new ForbiddenError("You don't have permission to perform this action"));
  }
  
  const task: Task = await taskPrismaClient.task.create({
      data: {
        firstName: taskData.firstName,
        lastName: taskData.lastName,
        phone: taskData.phone,
        description: taskData.description,
        taskId: generateTaskId(),
        assignee: {connect: {id: user.id}},
      }
    });
    res.status(201).json({
      status: 'success',
      message: 'task created successfully',
      data: task,
    });
})

export const updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const taskId = req.params.id;
  const checktask = await checkTaskExist(taskId);
  const user = await getUser(req.user?.id!);

  if (!checktask) {
    return next(new NotFoundError('task'))
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'TEAM_LEAD' && user?.role !== 'TASK_MANAGER') {
    return next( new ForbiddenError("You don't have permission to perform this action"));
  }
  
  const taskData: Task = req.body;
  const task: Task = await taskPrismaClient.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...taskData,
      }
    });
    res.status(201).json({
      status: 'success',
      message: 'task updated successfully',
      data: {
        ...task,
        updatedAt: new Date(),
      },
    });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const taskId = req.params.id;
  const checktask = await checkTaskExist(taskId);
  const user = await getUser(req.user?.id!);

  if (!checktask) {
    return next(new NotFoundError('task'))
  }

  if(user?.role !== 'ADMIN' && user?.role !== 'TEAM_LEAD' && user?.role !== 'TASK_MANAGER') {
    return next( new ForbiddenError("You don't have permission to perform this action"));
  }
  
  await taskPrismaClient.task.delete({
      where: {
        id: taskId,
      },
    });
    res.status(201).json({
      status: 'success',
      message: 'task deleted successfully',
    });
})
