// Importa el enrutador de Express y las funciones de los controladores
import { Router } from "express";
import {
  listUser, // Muestra la lista de usuarios
  detailUser, // Muestra los detalles de un usuario específico
  createUser, // Muestra el formulario para crear un nuevo usuario
  editUser, // Muestra el formulario para editar un usuario existente
  saveUser, // Guarda un nuevo usuario
  updateUser, // Actualiza la información de un usuario
  setCategoriesUser, // Asocia categorías a un usuario
  setStatusUser, // Cambia el estado activo/inactivo de un usuario
} from "../controllers/users.js"; // Importa los controladores de usuarios

// Importa los middlewares
import upload from "../middlewares/upload.js"; // Middleware para manejar la carga de archivos
import confirm from "../middlewares/confirm.js"; // Middleware para confirmar acceso de un usuario (autorización)
import admin from "../middlewares/admin.js"; // Middleware para comprobar si el usuario es administrador

// Crea una nueva instancia de Router
const userRouter = new Router();

// Define las rutas para las operaciones de usuarios, algunas protegidas por middlewares

// Ruta GET para listar todos los usuarios (accesible por cualquier usuario)
userRouter.get("/", listUser);

// Ruta GET para mostrar el formulario de creación de un nuevo usuario (solo accesible por administradores)
userRouter.get("/create", [admin], createUser);

// Ruta GET para mostrar el formulario de edición de un usuario (accesible solo si el usuario es el propietario o admin)
userRouter.get("/edit/:id", [confirm], editUser);

// Ruta GET para mostrar los detalles de un usuario específico
userRouter.get("/show/:id", detailUser);

// Ruta POST para actualizar la información de un usuario (solo si el usuario es el propietario o admin, y con archivos permitidos)
userRouter.post("/update/:id", [confirm, upload.any()], updateUser);

// Ruta POST para asociar categorías a un usuario
userRouter.post("/setCategories/:id", setCategoriesUser);

// Ruta POST para guardar un nuevo usuario (solo accesible por administradores, y con archivos permitidos)
userRouter.post("/save", [admin, upload.any()], saveUser);

// Ruta POST para cambiar el estado activo/inactivo de un usuario (solo accesible por administradores)
userRouter.post("/status", [admin], setStatusUser);

// Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación
export default userRouter;
