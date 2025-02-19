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
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      subcategories: true,
    },
  });
  return res.render("user/list", { users, page, categories });
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
  const mainCategories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      subcategories: true,
    },
  });
  const user = await prisma.contact.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      photo: true,
      categories: {
        include: {
          parent: true,
        },
      },
    },
  });
  return res.render("user/detail", {
    contact: user,
    categories: mainCategories,
  });
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

export const setCategoriesUser = async (req, res) => {
  try {
    let subcategories = Object.keys(req.body);

    subcategories = subcategories.filter((key) => key != "categories");

    let allCategories = subcategories.map((key) => ({
      id: Number(req.body[key]),
    }));
    if (req.body.categories) {
      let categories = Array.from(req.body.categories);
      if (categories.length > 0) {
        categories = categories.filter((element) => element != null);

        categories = categories.map((element) => ({ id: Number(element) }));

        categories = categories.concat(allCategories);
        allCategories = [...new Set(categories)];
      }
    }

    //return res.status(202).send(allCategories);
    const result = await prisma.contact.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        categories: {
          set: allCategories,
        },
      },
      include: {
        categories: true,
      },
    });
    return res.redirect(`/users/show/${req.params.id}`);
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
