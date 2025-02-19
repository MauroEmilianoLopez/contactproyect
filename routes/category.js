import { Router } from "express";
import {
  detailCategory,
  createCategory,
  editCategory,
  saveCategory,
} from "../controllers/category.js";

const categoryRouter = new Router();

categoryRouter.get("/create", createCategory);
categoryRouter.get("/edit/:id", editCategory);
categoryRouter.get("/show/:id", detailCategory);
categoryRouter.post("/save", saveCategory);

export default categoryRouter;
