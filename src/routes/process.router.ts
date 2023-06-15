import { Router } from 'express';
import {
  getAllProcesses,
  getProcessById,
  createProcess,
  updateProcess,
  deleteProcess,
} from '../controllers/process.controller';

const router = Router();

router.get('/', getAllProcesses);
router.get('/:id', getProcessById);
router.post('/', createProcess);
router.put('/:id', updateProcess);
router.delete('/:id', deleteProcess);