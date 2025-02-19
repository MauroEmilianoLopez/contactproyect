import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const createCategory = (req, res) => {
  return res.render("category/create", {});
};

export const editCategory = (req, res) => {
  return res.render("category/edit", {});
};

export const detailCategory = async (req, res) => {
  const category = await prisma.category.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      subcategories: true,
    },
  });
  return res.render("category/detail", { category });
};

export const saveCategory = async (req, res) => {
  try {
    let category = await prisma.category.create({
      data: {
        name: req.body.name,
      },
    });
    return res.redirect(`/categories/show/${category.id}`);
  } catch (error) {
    return res.status(500).send({
      error: {
        code: error.code,
        msg: error.message,
        field: error.meta,
      },
    });
  }
};
export const removeSubCategory = async (req, res) => {
  try {
    const parentCategory = await prisma.category.findUnique({
      where: { id: Number(req.body.parentId) },
      include: { subcategories: true },
    });
    const currentCategory = await prisma.category.findUnique({
      where: { id: Number(req.body.subcategory) },
    });

    await prisma.category.delete({ where: { id: currentCategory.id } });
    await prisma.category.update({
      where: { id: parentCategory.id },
      data: {
        subcategories: {
          set: parentCategory.subcategories
            .map((category) => ({ id: category.id }))
            .filter((category) => category.id != currentCategory.id),
        },
      },
      include: { subcategories: true },
    });
    return res.redirect(`/categories/show/${parentCategory.id}`);
  } catch (error) {
    return res.status(500).send({
      error: {
        code: error.code,
        msg: error.message,
        field: error.meta,
      },
    });
  }
};

export const addSubCategory = async (req, res) => {
  try {
    const newSub = await prisma.category.create({
      data: { name: req.body.name, parentId: Number(req.body.parentId) },
    });
    return res.redirect(`/categories/show/${newSub.parentId}`);
  } catch (error) {
    return res.status(500).send({
      error: {
        code: error.code,
        msg: error.message,
        field: error.meta,
      },
    });
  }
};

export const removeCategory = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.body.parentId) },
      include: { subcategories: true },
    });

    await prisma.category.update({
      where: { id: category.id },
      data: {
        subcategories: {
          set: [],
        },
      },
      include: { subcategories: true },
    });
    await prisma.category.delete({ where: { id: category.id } });

    await Promise.all(
      category.subcategories.map(
        async (category) =>
          await prisma.category.delete({ where: { id: category.id } })
      )
    );

    return res.redirect("/users/");
  } catch (error) {
    return res.status(500).send({
      error: {
        code: error.code,
        msg: error.message,
        field: error.meta,
      },
    });
  }
};
