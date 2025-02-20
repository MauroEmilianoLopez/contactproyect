import { PrismaClient, Prisma } from "@prisma/client"; // Importa el cliente de Prisma para interactuar con la base de datos
const prisma = new PrismaClient(); // Crea una nueva instancia del cliente Prisma para realizar consultas a la base de datos

// Función para mostrar la vista de creación de un nuevo usuario
export const createUser = (req, res) => {
  return res.render("user/create", {}); // Renderiza la vista para crear un nuevo usuario
};

// Función para listar los usuarios con paginación y filtrado
export const listUser = async (req, res) => {
  const { page = 0 } = req.query; // Obtiene la página solicitada desde los parámetros de la URL (por defecto es 0)
  const query = {}; // Inicializa la consulta para obtener usuarios
  query.where = { isAdmin: false }; // Filtra para obtener solo usuarios no administradores
  if (!req.session.user.isAdmin) {
    query.where.isActive = true; // Si el usuario no es administrador, solo se muestran usuarios activos
  }
  query.skip = Number(page) * 2; // Implementa la paginación: salta a los usuarios correspondientes a la página solicitada
  query.take = 2; // Limita la consulta a 2 usuarios por página
  const users = await prisma.contact.findMany(query); // Realiza la consulta de usuarios
  const categories = await prisma.category.findMany({
    where: { parentId: null }, // Obtiene las categorías principales (sin subcategorías)
    include: { subcategories: true }, // Incluye las subcategorías asociadas
  });
  return res.render("user/list", { users, page, categories }); // Renderiza la vista con la lista de usuarios y categorías
};

// Función para mostrar la vista de edición de un usuario
export const editUser = async (req, res) => {
  const { id = 0 } = req.params; // Obtiene el ID del usuario desde los parámetros de la URL
  const user = await prisma.contact.findUnique({
    where: { id: Number(id) }, // Busca al usuario con el ID proporcionado
    include: { photo: true }, // Incluye la foto del usuario en la consulta
  });
  return res.render("user/edit", { contact: user }); // Renderiza la vista de edición con los datos del usuario
};

// Función para mostrar los detalles de un usuario, incluyendo sus categorías
export const detailUser = async (req, res) => {
  const { id = 0 } = req.params; // Obtiene el ID del usuario desde los parámetros de la URL
  const mainCategories = await prisma.category.findMany({
    where: { parentId: null }, // Obtiene las categorías principales
    include: { subcategories: true }, // Incluye las subcategorías asociadas
  });
  const user = await prisma.contact.findUnique({
    where: { id: Number(id) }, // Busca al usuario con el ID proporcionado
    include: {
      photo: true, // Incluye la foto del usuario
      categories: { include: { parent: true } }, // Incluye las categorías del usuario y su categoría principal
    },
  });
  return res.render("user/detail", {
    contact: user,
    categories: mainCategories,
  }); // Renderiza la vista con los detalles del usuario y categorías
};

// Función para guardar un nuevo usuario en la base de datos
export const saveUser = async (req, res) => {
  try {
    let file;
    if (req.files && req.files.length) {
      file = await prisma.file.create({
        data: { filename: req.files[0].filename }, // Guarda el archivo (foto u otro archivo) si se ha subido uno
      });
    }
    req.body.isAdmin = String(req.body.email).includes("@dasc.com"); // Define si el usuario es administrador basado en su email
    let contact = await prisma.contact.create({
      data: {
        name: req.body.name, // Nombre del usuario
        email: req.body.email, // Email del usuario
        phone: req.body.phone, // Teléfono del usuario
        age: Number(req.body.age), // Edad del usuario
        address: req.body.address, // Dirección del usuario
        gender: req.body.gender, // Género del usuario
        link: req.body.link, // Enlace del usuario
        isAdmin: req.body.isAdmin, // Si el usuario es administrador
        fileId: file ? file.id : null, // ID del archivo asociado (si existe)
      },
    });
    return res.redirect(`/users/show/${contact.id}`); // Redirige a la página de detalles del usuario recién creado
  } catch (error) {
    return res.status(500).send({
      error: {
        code: error.code, // Código del error
        msg: error.message, // Mensaje de error
        field: error.meta, // Detalles adicionales del error
      },
    });
  }
};

// Función para actualizar los datos de un usuario existente
export const updateUser = async (req, res) => {
  try {
    let file;
    let contact = await prisma.contact.findUnique({
      where: { id: Number(req.params.id) }, // Obtiene el usuario con el ID proporcionado
    });

    // Si el usuario tiene un archivo y se sube un nuevo archivo, actualiza el archivo
    if (req.files && req.files.length && contact.fileId != null) {
      await prisma.file.update({
        where: { id: Number(contact.fileId) },
        data: { filename: req.files[0].filename },
      });
    }

    // Si el usuario no tiene un archivo y se sube uno, crea un nuevo archivo
    if (req.files && req.files.length && contact.fileId == null) {
      file = await prisma.file.create({
        data: { filename: req.files[0].filename },
      });
    }

    req.body.isAdmin = String(req.body.email).includes("@dasc.com"); // Define si el usuario es administrador basado en su email
    let contactUpdate = await prisma.contact.update({
      where: { id: contact.id }, // Actualiza el usuario con el ID correspondiente
      data: {
        name: req.body.name, // Actualiza el nombre del usuario
        email: req.body.email, // Actualiza el email del usuario
        phone: req.body.phone, // Actualiza el teléfono del usuario
        age: Number(req.body.age), // Actualiza la edad del usuario
        address: req.body.address, // Actualiza la dirección del usuario
        gender: req.body.gender, // Actualiza el género del usuario
        link: req.body.link, // Actualiza el enlace del usuario
        isAdmin: req.body.isAdmin, // Actualiza si el usuario es administrador
        fileId: contact.fileId ? contact.fileId : file.id, // Actualiza el archivo asociado
      },
    });
    return res.redirect(`/users/show/${contact.id}`); // Redirige a la página de detalles del usuario actualizado
  } catch (error) {
    return res.status(500).send({
      error: {
        code: error.code, // Código del error
        msg: error.message, // Mensaje de error
        field: error.meta, // Detalles adicionales del error
      },
    });
  }
};

// Función para asignar categorías a un usuario
export const setCategoriesUser = async (req, res) => {
  try {
    let subcategories = Object.keys(req.body); // Obtiene las claves de las subcategorías desde el cuerpo de la solicitud

    subcategories = subcategories.filter((key) => key != "categories"); // Filtra la clave "categories" si existe

    let allCategories = subcategories.map((key) => ({
      id: Number(req.body[key]),
    })); // Mapea las claves a un formato de categoría con ID

    // Si el usuario tiene categorías seleccionadas, las concatena con las nuevas categorías
    if (req.body.categories) {
      let categories = Array.from(req.body.categories); // Convierte las categorías seleccionadas en un array
      if (categories.length > 0) {
        categories = categories.filter((element) => element != null); // Filtra los valores nulos
        categories = categories.map((element) => ({ id: Number(element) })); // Mapea las categorías a un formato con ID
        categories = categories.concat(allCategories); // Concatena las categorías seleccionadas con las nuevas
        allCategories = [...new Set(categories)]; // Elimina duplicados de la lista de categorías
      }
    }

    const result = await prisma.contact.update({
      where: { id: Number(req.params.id) }, // Actualiza las categorías del usuario con el ID proporcionado
      data: {
        categories: { set: allCategories }, // Asocia las categorías al usuario
      },
      include: { categories: true }, // Incluye las categorías del usuario en la respuesta
    });
    return res.redirect(`/users/show/${req.params.id}`); // Redirige a la página de detalles del usuario actualizado
  } catch (error) {
    return res.status(500).send({
      error: {
        code: error.code, // Código del error
        msg: error.message, // Mensaje de error
        field: error.meta, // Detalles adicionales del error
      },
    });
  }
};

// Función para activar o desactivar el estado de un usuario
export const setStatusUser = async (req, res) => {
  try {
    const user = await prisma.contact.findUniqueOrThrow({
      where: { id: Number(req.body.userId) }, // Obtiene el usuario por ID
    });
    await prisma.contact.update({
      where: { id: user.id }, // Actualiza el estado de activación del usuario
      data: { isActive: !user.isActive }, // Cambia el estado de activación (si está activo pasa a inactivo, y viceversa)
    });
    return res.redirect("/users"); // Redirige a la lista de usuarios
  } catch (error) {
    return res.status(500).send({
      error: {
        code: error.code, // Código del error
        msg: error.message, // Mensaje de error
        field: error.meta, // Detalles adicionales del error
      },
    });
  }
};
