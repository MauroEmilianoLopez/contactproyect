import { Router } from "express";
import {
  listUser,
  detailUser,
  createUser,
  editUser,
  saveUser,
  updateUser,
  setCategoriesUser,
  setStatusUser,
} from "../controllers/users.js";

import upload from "../middlewares/upload.js";

const userRouter = new Router();

userRouter.get("/", listUser);
userRouter.get("/create", createUser);
userRouter.get("/edit/:id", editUser);
userRouter.get("/show/:id", detailUser);
userRouter.post("/update/:id", [upload.any()], updateUser);
userRouter.post("/setCategories/:id", setCategoriesUser);
userRouter.post("/save", [upload.any()], saveUser);
userRouter.post("/status", setStatusUser);

export default userRouter;
