import { PrismaClient, Prisma } from "@prisma/client"; // Importa el cliente de Prisma para interactuar con la base de datos
const prisma = new PrismaClient(); // Crea una nueva instancia del cliente Prisma para realizar consultas a la base de datos

// Función para mostrar la vista de creación de categorías
export const createCategory = (req, res) => {
  return res.render("category/create", {}); // Renderiza la vista para crear una nueva categoría
};

// Función para mostrar la vista de edición de categorías
export const editCategory = (req, res) => {
  return res.render("category/edit", {}); // Renderiza la vista para editar una categoría existente
};

// Función para mostrar los detalles de una categoría, incluyendo sus subcategorías
export const detailCategory = async (req, res) => {
  const category = await prisma.category.findUnique({
    where: {
      id: Number(req.params.id), // Obtiene la categoría usando su ID desde los parámetros de la URL
    },
    include: {
      subcategories: true, // Incluye las subcategorías asociadas con esta categoría
    },
  });
  return res.render("category/detail", { category }); // Renderiza la vista con los detalles de la categoría
};

// Función para guardar una nueva categoría en la base de datos
export const saveCategory = async (req, res) => {
  try {
    // Crea una nueva categoría en la base de datos con el nombre proporcionado en la solicitud
    let category = await prisma.category.create({
      data: {
        name: req.body.name, // Toma el nombre de la categoría desde el cuerpo de la solicitud
      },
    });
    return res.redirect(`/categories/show/${category.id}`); // Redirige a la página de detalles de la nueva categoría
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

// Función para eliminar una subcategoría de una categoría principal
export const removeSubCategory = async (req, res) => {
  try {
    // Obtiene la categoría principal y sus subcategorías
    const parentCategory = await prisma.category.findUnique({
      where: { id: Number(req.body.parentId) },
      include: { subcategories: true }, // Incluye las subcategorías de la categoría principal
    });
    // Obtiene la subcategoría que se quiere eliminar
    const currentCategory = await prisma.category.findUnique({
      where: { id: Number(req.body.subcategory) },
    });

    // Elimina la subcategoría de la base de datos
    await prisma.category.delete({ where: { id: currentCategory.id } });

    // Actualiza la categoría principal para quitar la subcategoría eliminada
    await prisma.category.update({
      where: { id: parentCategory.id },
      data: {
        subcategories: {
          set: parentCategory.subcategories
            .map((category) => ({ id: category.id })) // Mapea las subcategorías para eliminarlas correctamente
            .filter((category) => category.id != currentCategory.id), // Filtra la subcategoría eliminada
        },
      },
      include: { subcategories: true }, // Incluye las subcategorías actualizadas
    });
    return res.redirect(`/categories/show/${parentCategory.id}`); // Redirige a la página de detalles de la categoría principal
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

// Función para agregar una nueva subcategoría a una categoría principal
export const addSubCategory = async (req, res) => {
  try {
    // Crea una nueva subcategoría con el nombre y la categoría principal
    const newSub = await prisma.category.create({
      data: { name: req.body.name, parentId: Number(req.body.parentId) },
    });
    return res.redirect(`/categories/show/${newSub.parentId}`); // Redirige a la página de detalles de la categoría principal
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

// Función para eliminar una categoría, junto con sus subcategorías
export const removeCategory = async (req, res) => {
  try {
    // Obtiene la categoría principal y sus subcategorías
    const category = await prisma.category.findUnique({
      where: { id: Number(req.body.parentId) },
      include: { subcategories: true }, // Incluye las subcategorías de la categoría principal
    });

    // Actualiza la categoría principal para eliminar todas sus subcategorías
    await prisma.category.update({
      where: { id: category.id },
      data: {
        subcategories: {
          set: [], // Elimina todas las subcategorías de la categoría
        },
      },
      include: { subcategories: true },
    });

    // Elimina la categoría principal de la base de datos
    await prisma.category.delete({ where: { id: category.id } });

    // Elimina todas las subcategorías asociadas
    await Promise.all(
      category.subcategories.map(
        async (category) =>
          await prisma.category.delete({ where: { id: category.id } })
      )
    );

    return res.redirect("/users/"); // Redirige a la página de usuarios después de eliminar la categoría
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
