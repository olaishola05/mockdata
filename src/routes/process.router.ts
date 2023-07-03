import { Router } from "express";
import { getAllProcesses, getProcessById, createProcess, updateProcess, deleteProcess } from "../controllers/process.controller";
import { authenticate, reqBodyValidator, checkUserRole } from "../middleware";
import { processSchema } from "../utils";

const processRouter = Router();

processRouter.get("/", authenticate, getAllProcesses);
processRouter.get("/:id", authenticate, getProcessById);
processRouter.post("/", [reqBodyValidator(processSchema), authenticate, checkUserRole(["ADMIN", "TASK_MANAGER", "TEAM_LEAD"])], createProcess);
processRouter.put("/:id", [authenticate, checkUserRole(["ADMIN", "TASK_MANAGER", "TEAM_LEAD"])], updateProcess);
processRouter.delete("/:id", deleteProcess);

export default processRouter;