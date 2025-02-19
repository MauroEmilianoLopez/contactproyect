import { Router } from "express";
import {
  detailCategory,
  createCategory,
  editCategory,
  saveCategory,
  removeSubCategory,
  addSubCategory,
  removeCategory,
} from "../controllers/category.js";

const categoryRouter = new Router();

categoryRouter.get("/create", createCategory);
categoryRouter.get("/edit/:id", editCategory);
categoryRouter.get("/show/:id", detailCategory);
categoryRouter.post("/save", saveCategory);
categoryRouter.post("/removeSubcategory", removeSubCategory);
categoryRouter.post("/addSubcategory", addSubCategory);
categoryRouter.post("/remove", removeCategory);

export default categoryRouter;
