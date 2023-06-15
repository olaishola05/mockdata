import { Router } from 'express';
import {
  getAllProcesses,
  getProcessById,
  createProcess,
  updateProcess,
  deleteProcess,
} from '../controllers/process.controller';

const processRouter = Router();

processRouter.get('/', getAllProcesses);
processRouter.get('/:id', getProcessById);
processRouter.post('/', createProcess);
processRouter.put('/:id', updateProcess);
processRouter.delete('/:id', deleteProcess);

export default processRouter;