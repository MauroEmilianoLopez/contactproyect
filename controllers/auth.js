import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const login = (req, res) => {
  const { error = null } = req.query;
  return res.render("auth/login", { error });
};
export const access = async (req, res) => {
  try {
    const user = await prisma.contact.findUnique({
      where: {
        email: req.body.email,
      },
      include: {
        photo: true,
      },
    });
    if (user != null) {
      req.session.user = user;
      return res.redirect("/users");
    }
    const error = new URLSearchParams({
      error: "El usuario no esta registrado",
    });
    return res.redirect(`/?${error.toString()}`);
  } catch (error) {
    if (error.code) {
      res.status(500).send({
        error: {
          code: error.code,
          msg: error.message,
          field: error.meta,
        },
      });
    }
    return res.status(500).send(error);
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
