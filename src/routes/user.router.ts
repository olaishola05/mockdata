import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}
  from '../controllers/user.controller';
import { authenticate, checkUserRole } from '../middleware';

const userRouter = Router();

userRouter.get("/", [authenticate, checkUserRole(["ADMIN"])], getAllUsers);
userRouter.get('/:id', authenticate, getUserById);
userRouter.put('/:id', authenticate, checkUserRole(["ADMIN", "USER"]), updateUser);
userRouter.delete("/:id", [authenticate, checkUserRole(["ADMIN", "USER"])], deleteUser);

export default userRouter;