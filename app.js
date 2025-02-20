// Importa el módulo 'join' de 'path' para trabajar con rutas de archivos
import { join } from "node:path";
// Importa Express, el framework para servidor web
import express from "express";
// Importa el middleware para manejar sesiones
import session from "express-session";
// Importa el middleware para gestionar cookies
import cookie from "cookie-parser";

// Crea una instancia de la aplicación Express
const app = express();
// Define el puerto del servidor, usando una variable de entorno o el puerto 3030 por defecto
const port = process.env.PORT || 3030;
// Función que se ejecuta cuando el servidor está listo
const init = () => console.log(`ready on http://localhost:${port}`);

// Configura el motor de plantillas (view engine) como 'ejs'
app.set("view engine", "ejs");
// Define la carpeta donde se encuentran las vistas (archivos ejs)
app.set("views", join(process.cwd(), "views"));

// Configura el middleware de sesión
app.use(
  session({
    secret: "contact_proyect", // Clave secreta para firmar la sesión
    resave: false, // Evita guardar la sesión si no ha sido modificada
    saveUninitialized: true, // Guarda una sesión incluso si no ha sido inicializada
  })
);

// Configura el middleware para manejar cookies
app.use(cookie());

// Permite que la aplicación procese solicitudes con cuerpos JSON
app.use(express.json());
// Permite que la aplicación procese datos enviados en formularios (urlencoded)
app.use(express.urlencoded({ extended: true }));
// Configura la carpeta 'public' como carpeta estática para servir archivos como imágenes, CSS, JS, etc.
app.use(express.static(join(process.cwd(), "public")));

// Importa y usa el middleware que maneja la sesión de usuario
import user from "./middlewares/user.js";
app.use(user);

// Rutas de autenticación, las rutas se manejan en un archivo separado
import authRouter from "./routes/auth.js";
app.use(authRouter);

// Importa y usa el middleware de autenticación para proteger rutas
import auth from "./middlewares/auth.js";
app.use(auth);

// Rutas de usuario, las rutas se manejan en un archivo separado
import userRouter from "./routes/users.js";
app.use("/users", userRouter);

// Rutas de categoría, las rutas se manejan en un archivo separado
import categoryRouter from "./routes/category.js";
app.use("/categories", categoryRouter);

// Maneja cualquier ruta no definida (404)
app.get("*", (req, res) =>
  res.render("404", {
    link: req.get("Referer") || "/users", // Redirige a la página anterior o a los usuarios
  })
);

// Inicia el servidor en el puerto definido
app.listen(port, init);
