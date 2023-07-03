import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticate, reqBodyValidator, checkUserRole } from '../middleware';
import { taskSchema } from '../utils';

const taskRouter = Router();

taskRouter.get('/', authenticate, getAllTasks);
taskRouter.get('/:id', authenticate, getTaskById);
taskRouter.post('/', [reqBodyValidator(taskSchema), authenticate, checkUserRole(["ADMIN", "TASK_MANAGER", "TEAM_LEAD"])], createTask);
taskRouter.put('/:id', [authenticate, checkUserRole(["ADMIN", "TASK_MANAGER", "TEAM_LEAD"])], updateTask);
taskRouter.delete('/:id', deleteTask);

export default taskRouter;