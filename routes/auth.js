import { Router } from "express";
import { login, access, logout } from "../controllers/auth.js";
const authRouter = new Router();

authRouter.get("/", login);
authRouter.post("/access", access);
authRouter.get("/logout", logout);

export default authRouter;
