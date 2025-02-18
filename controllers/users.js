import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = (req, res) => {
  return res.render("user/create", {});
};
export const listUser = async (req, res) => {
  const { page = 0 } = req.query;
  const query = {};
  query.where = { isAdmin: false };
  query.skip = Number(page) * 2;
  query.take = 2;
  const users = await prisma.contact.findMany(query);
  return res.render("user/list", { users, page });
};
export const editUser = async (req, res) => {
  const { id = 0 } = req.params;
  const user = await prisma.contact.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      photo: true,
    },
  });
  return res.render("user/edit", { user });
};
export const detailUser = async (req, res) => {
  const { id = 0 } = req.params;
  const user = await prisma.contact.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      photo: true,
    },
  });
  return res.render("user/detail", { contact: user });
};
