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
