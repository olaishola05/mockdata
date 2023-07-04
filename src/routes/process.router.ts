import { Router } from "express";
import { getAllProcesses, getProcessById, createProcess, updateProcess, deleteProcess } from "../controllers/process.controller";
import { authenticate, reqBodyValidator, checkUserRole } from "../middleware";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { processSchema, taskSchema } from "../utils";

const processRouter = Router();

processRouter.get("/", authenticate, getAllProcesses);
processRouter.post("/", [reqBodyValidator(processSchema), authenticate, checkUserRole(["ADMIN", "TASK_MANAGER", "TEAM_LEAD"])], createProcess);
processRouter.get("/:id", authenticate, getProcessById);
processRouter.put("/:id", [authenticate, checkUserRole(["ADMIN", "TASK_MANAGER", "TEAM_LEAD"])], updateProcess);
processRouter.get("/:id/tasks", authenticate, getAllTasks);
processRouter.post("/:id/tasks", [reqBodyValidator(taskSchema), authenticate, checkUserRole(["ADMIN", "TASK_MANAGER", "TEAM_LEAD"])], createTask);
processRouter.get("/:processId/tasks/:id", authenticate, getTaskById);
processRouter.put("/:processId/tasks/:id", [authenticate, checkUserRole(["ADMIN", "TASK_MANAGER", "TEAM_LEAD"])], updateTask);
processRouter.delete("/:id", deleteProcess);
processRouter.delete("/:processId/tasks/:id", deleteTask);

export default processRouter;