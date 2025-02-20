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
  removeCategory, // Elimina una categoría asociada a un usuario
} from "../controllers/users.js"; // Importa los controladores de usuarios

// Importa los middlewares
import upload from "../middlewares/upload.js"; // Middleware para manejar la carga de archivos (imágenes, documentos, etc.)
import confirm from "../middlewares/confirm.js"; // Middleware para confirmar acceso de un usuario (autorización)
import admin from "../middlewares/admin.js"; // Middleware para comprobar si el usuario es administrador

// Crea una nueva instancia de Router, que se utilizará para manejar las rutas relacionadas con usuarios
const userRouter = new Router();

// Define las rutas para las operaciones de usuarios, algunas protegidas por middlewares

// Ruta GET para listar todos los usuarios (accesible por cualquier usuario)
userRouter.get("/", listUser);

// Ruta GET para mostrar el formulario de creación de un nuevo usuario (solo accesible por administradores)
// El middleware 'admin' asegura que solo los administradores puedan acceder a esta ruta
userRouter.get("/create", [admin], createUser);

// Ruta GET para mostrar el formulario de edición de un usuario (accesible solo si el usuario es el propietario o admin)
// El middleware 'confirm' asegura que solo el propietario o un administrador puedan acceder a esta ruta
userRouter.get("/edit/:id", [confirm], editUser);

// Ruta GET para mostrar los detalles de un usuario específico (accesible por cualquier usuario)
userRouter.get("/show/:id", detailUser);

// Ruta POST para actualizar la información de un usuario (solo si el usuario es el propietario o admin, y con archivos permitidos)
// El middleware 'confirm' asegura que solo el propietario o un administrador puedan actualizar los detalles
// El middleware 'upload.any()' permite cargar archivos (por ejemplo, una nueva imagen de perfil)
userRouter.post("/update/:id", [confirm, upload.any()], updateUser);

// Ruta POST para asociar categorías a un usuario (accesible por cualquier usuario, pero con autorización)
userRouter.post("/setCategories/:id", setCategoriesUser);

// Ruta POST para guardar un nuevo usuario (solo accesible por administradores, y con archivos permitidos)
// El middleware 'admin' asegura que solo un administrador pueda crear un nuevo usuario
// El middleware 'upload.any()' permite cargar archivos (por ejemplo, una imagen de perfil)
userRouter.post("/save", [admin, upload.any()], saveUser);

// Ruta POST para cambiar el estado activo/inactivo de un usuario (solo accesible por administradores)
// El middleware 'admin' asegura que solo un administrador pueda cambiar el estado de un usuario
userRouter.post("/status", [admin], setStatusUser);

// Ruta POST para eliminar una categoría asociada a un usuario
userRouter.post("/removeCategory", [], removeCategory); // No se ha aplicado middleware aquí, se podría agregar si es necesario

// Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación
export default userRouter;
