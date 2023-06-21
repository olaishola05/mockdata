import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth.controller";
import { reqBodyValidator } from "../middleware";
import {createUserSchema, loginSchema} from "../utils";

const authRouter = Router();

authRouter.post("/signup", reqBodyValidator(createUserSchema), createUser);
authRouter.post("/login",reqBodyValidator(loginSchema), loginUser);

export default authRouter;