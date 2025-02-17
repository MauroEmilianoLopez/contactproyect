import { Router } from "express";
import {
  listCategory,
  detailCategory,
  createCategory,
  editCategory,
} from "../controllers/category.js";

const categoryRouter = new Router();

categoryRouter.get("/", listCategory);
categoryRouter.get("/create", createCategory);
categoryRouter.get("/edit/:id", editCategory);
categoryRouter.get("/show/:id", detailCategory);

export default categoryRouter;
