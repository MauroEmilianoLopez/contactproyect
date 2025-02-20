import { PrismaClient, Prisma } from "@prisma/client"; // Importa el cliente de Prisma para interactuar con la base de datos
const prisma = new PrismaClient(); // Crea una nueva instancia del cliente Prisma para realizar consultas a la base de datos

// Función para mostrar la vista de login con un posible mensaje de error
export const login = (req, res) => {
  const { error = null } = req.query; // Extrae el error de los parámetros de la URL (si existe)
  return res.render("auth/login", { error }); // Renderiza la vista de login, pasando el mensaje de error si está presente
};

// Función para manejar el proceso de login y validación del usuario
export const access = async (req, res) => {
  try {
    // Busca al usuario en la base de datos según el email proporcionado en la solicitud (req.body.email)
    const user = await prisma.contact.findUnique({
      where: {
        email: req.body.email, // Email del usuario
        isActive: true, // Verifica que el usuario esté activo
      },
      include: {
        photo: true, // Incluye la foto del usuario en la respuesta
      },
    });

    if (user != null) {
      // Si se encuentra un usuario válido
      req.session.user = user; // Guarda la información del usuario en la sesión
      return res.redirect("/users"); // Redirige a la página de usuarios
    }

    // Si el usuario no está registrado o activo, redirige con un mensaje de error
    const error = new URLSearchParams({
      error: "El usuario no esta registrado u activo", // Mensaje de error
    });
    return res.redirect(`/?${error.toString()}`); // Redirige a la página de inicio con el mensaje de error
  } catch (error) {
    // Si ocurre un error durante la búsqueda en la base de datos, maneja el error
    if (error.code) {
      res.status(500).render("Error", {
        error: {
          code: error.code, // Código del error
          msg: error.message, // Mensaje del error
          field: error.meta, // Detalles adicionales del error
        },
        link: req.get("Referer") || "/users",
      });
    }
    return res.status(500).send(error); // Responde con el error genérico si no es posible procesar el error correctamente
  }
};

// Función para cerrar la sesión del usuario
export const logout = (req, res) => {
  req.session.destroy(); // Destruye la sesión actual del usuario
  return res.redirect("/"); // Redirige al usuario a la página de inicio
};
