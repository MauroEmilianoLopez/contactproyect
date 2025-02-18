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
  return res.render("user/edit", { contact: user });
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

export const saveUser = async (req, res) => {
  try {
    let file;
    if (req.files && req.files.length) {
      file = await prisma.file.create({
        data: { filename: req.files[0].filename },
      });
    }
    req.body.isAdmin = String(req.body.email).includes("@dasc.com");
    let contact = await prisma.contact.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: Number(req.body.age),
        address: req.body.address,
        gender: req.body.gender,
        link: req.body.link,
        isAdmin: req.body.isAdmin,
        fileId: file ? file.id : null,
      },
    });
    return res.redirect(`/users/show/${contact.id}`);
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

export const updateUser = async (req, res) => {
  try {
    let file;
    let contact = await prisma.contact.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (req.files && req.files.length && contact.fileId != null) {
      await prisma.file.update({
        where: {
          id: Number(contact.fileId),
        },
        data: { filename: req.files[0].filename },
      });
    }

    if (req.files && req.files.length && contact.fileId == null) {
      file = await prisma.file.create({
        data: { filename: req.files[0].filename },
      });
    }

    req.body.isAdmin = String(req.body.email).includes("@dasc.com");
    let contactUpdate = await prisma.contact.update({
      where: {
        id: contact.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: Number(req.body.age),
        address: req.body.address,
        gender: req.body.gender,
        link: req.body.link,
        isAdmin: req.body.isAdmin,
        fileId: contact.fileId ? contact.fileId : file.id,
      },
    });
    return res.redirect(`/users/show/${contact.id}`);
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
