// Importa el enrutador de Express y las funciones de los controladores
import { Router } from "express";
import {
  detailCategory, // Muestra los detalles de una categoría
  createCategory, // Muestra el formulario para crear una categoría
  editCategory, // Muestra el formulario para editar una categoría existente
  saveCategory, // Guarda una nueva categoría
  removeSubCategory, // Elimina una subcategoría
  addSubCategory, // Añade una subcategoría a una categoría
  removeCategory, // Elimina una categoría
} from "../controllers/category.js"; // Importa los controladores de categorías

import admin from "../middlewares/admin.js"; // Importa el middleware de administrador

// Crea una nueva instancia de Router
const categoryRouter = new Router();

// Define las rutas para las operaciones de categorías, protegidas por el middleware admin

// Ruta GET para mostrar el formulario de creación de categoría (solo accesible para administradores)
categoryRouter.get("/create", [admin], createCategory);

// Ruta GET para mostrar el formulario de edición de categoría (solo accesible para administradores)
categoryRouter.get("/edit/:id", [admin], editCategory);

// Ruta GET para mostrar los detalles de una categoría específica (accesible para todos)
categoryRouter.get("/show/:id", detailCategory);

// Ruta POST para guardar una nueva categoría (solo accesible para administradores)
categoryRouter.post("/save", [admin], saveCategory);

// Ruta POST para eliminar una subcategoría (solo accesible para administradores)
categoryRouter.post("/removeSubcategory", [admin], removeSubCategory);

// Ruta POST para añadir una subcategoría a una categoría (solo accesible para administradores)
categoryRouter.post("/addSubcategory", [admin], addSubCategory);

// Ruta POST para eliminar una categoría (solo accesible para administradores)
categoryRouter.post("/remove", [admin], removeCategory);

// Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación
export default categoryRouter;
