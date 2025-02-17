import { Router } from "express";
import {
  listUser,
  detailUser,
  createUser,
  editUser,
} from "../controllers/users.js";

const userRouter = new Router();

userRouter.get("/", listUser);
userRouter.get("/create", createUser);
userRouter.get("/edit/:id", editUser);
userRouter.get("/show/:id", detailUser);

export default userRouter;
