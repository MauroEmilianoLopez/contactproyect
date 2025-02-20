// Importa el enrutador de Express y las funciones de los controladores
import { Router } from "express";
import { login, access, logout } from "../controllers/auth.js"; // Importa los controladores de autenticación

// Crea una nueva instancia de Router
const authRouter = new Router();

// Define las rutas para el inicio de sesión, el acceso y el cierre de sesión

// Ruta GET para renderizar el formulario de login
authRouter.get("/", login);

// Ruta POST para procesar los datos del login e intentar autenticar al usuario
authRouter.post("/access", access);

// Ruta GET para cerrar la sesión del usuario y redirigirlo
authRouter.get("/logout", logout);

export default authRouter; // Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación
