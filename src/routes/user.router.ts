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

userRouter.get("/", [authenticate, checkUserRole("ADMIN")], getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;