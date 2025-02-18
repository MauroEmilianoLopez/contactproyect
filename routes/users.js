import { Router } from "express";
import {
  listUser,
  detailUser,
  createUser,
  editUser,
  saveUser,
} from "../controllers/users.js";

import upload from "../middlewares/upload.js";

const userRouter = new Router();

userRouter.get("/", listUser);
userRouter.get("/create", createUser);
userRouter.get("/edit/:id", editUser);
userRouter.get("/show/:id", detailUser);
userRouter.post("/save", upload.any(), saveUser);

export default userRouter;
