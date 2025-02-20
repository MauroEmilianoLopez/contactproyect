// Importa las dependencias necesarias para el manejo de archivos
import multer from "multer"; // Middleware para manejar la subida de archivos
import { join, extname } from "node:path"; // Funciones de Node.js para manejar rutas y extensiones de archivos
import { existsSync, mkdirSync } from "node:fs"; // Funciones de Node.js para manejar el sistema de archivos

// Función que define la carpeta de destino donde se almacenarán los archivos subidos
const destination = (req, file, cb) => {
  const folder = join(process.cwd(), "public", "assets"); // Obtiene la ruta absoluta de la carpeta "assets" dentro de "public"

  // Si la carpeta no existe, la crea de forma recursiva
  if (!existsSync(folder)) {
    mkdirSync(folder, { recursive: true });
  }

  return cb(null, folder); // Devuelve la carpeta como destino para el archivo
};

// Función que define el nombre del archivo que se subirá, asegurando que sea único
const filename = (req, file, cb) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Genera un sufijo único basado en la fecha y un número aleatorio
  cb(null, uniqueSuffix + extname(file.originalname)); // Usa el sufijo único y la extensión del archivo original para crear el nombre final
};

// Función que filtra los tipos de archivo permitidos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
  ]; // Tipos de archivos permitidos

  // Si el archivo es válido, se acepta; si no, se muestra un error
  if (!file || allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Acepta el archivo
  } else {
    cb(new Error("Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)"), false); // Rechaza el archivo y muestra el error
  }
};

// Configura multer para el manejo de archivos
const upload = multer({
  storage: multer.diskStorage({ destination, filename }), // Configura el almacenamiento con las funciones de destino y nombre de archivo
  fileFilter, // Aplica el filtro de archivos permitidos
});

export default upload; // Exporta la configuración de multer para su uso en otras partes de la aplicación
