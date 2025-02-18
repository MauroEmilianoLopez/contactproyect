import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Crear archivos (imágenes) para los usuarios
  const files = await Promise.all([
    prisma.file.create({ data: { filename: "alejandro-alonso.jpg" } }),
    prisma.file.create({ data: { filename: "alex-sanchez-muñoz.jpg" } }),
    prisma.file.create({ data: { filename: "jose-preda.jpg" } }),
    prisma.file.create({ data: { filename: "barvara-perez-arce.jpg" } }),
    prisma.file.create({ data: { filename: "jesus-eduardo-kawhati.jpg" } }),
  ]);

  // Crear 5 usuarios con imágenes asociadas
  const users = await Promise.all([
    prisma.contact.create({
      data: {
        name: "Alejandro Alonso",
        email: "alejandroalosno@gmail.com",
        phone: "2664505150",
        address: "Falucho 877",
        gender: "Masculino",
        age: 25,
        link: "https://www.linkedin.com/in/alejandro-alonso-406b25162/",
        isAdmin: false,
        fileId: files.find(
          ({ filename }) => filename === "alejandro-alonso.jpg"
        ).id,
      },
    }),
    prisma.contact.create({
      data: {
        name: "Alex Sanchez Muñoz",
        email: "alex_sanches@gmail.com",
        phone: "987654321",
        address: "Caninos 250",
        gender: "Masculino",
        age: 30,
        link: "https://www.linkedin.com/in/alex-sanchez-mu%C3%B1oz-a6752122a/",
        isAdmin: false,
        fileId: files.find(
          ({ filename }) => filename === "alex-sanchez-muñoz.jpg"
        ).id,
      },
    }),
    prisma.contact.create({
      data: {
        name: "José Preda",
        email: "josepreda@dasc.com",
        gender: "Masculino",
        isAdmin: true,
        fileId: files.find(({ filename }) => filename === "jose-preda.jpg").id,
      },
    }),
    prisma.contact.create({
      data: {
        name: "Barvara Perez Arce",
        email: "bar_sanchez@gmail.com",
        phone: "11952665586",
        address: "Barrio Las Moreiras Casa 4",
        gender: "Femenino",
        age: 35,
        link: "https://www.linkedin.com/in/barbarapda/",
        isAdmin: false,
        fileId: files.find(
          ({ filename }) => filename === "barvara-perez-arce.jpg"
        ).id,
      },
    }),
    prisma.contact.create({
      data: {
        name: "Jesus Eduardo Kawhati",
        email: "edu_jesus@gmail.com",
        phone: "+549261228578",
        address: "Hilario Gomez 1250",
        gender: "Masculino",
        age: 40,
        link: "https://www.linkedin.com/in/jekahwati/",
        isAdmin: false,
        fileId: files.find(
          ({ filename }) => filename === "jesus-eduardo-kawhati.jpg"
        ).id,
      },
    }),
  ]);

  // Crear 3 categorías principales
  const category1 = await prisma.category.create({
    data: {
      name: "Educación",
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: "Rubro",
    },
  });

  const category3 = await prisma.category.create({
    data: {
      name: "Sector",
    },
  });

  // Crear subcategorías para cada categoría principal
  await prisma.category.createMany({
    data: [
      { name: "Inicial", parentId: category1.id },
      { name: "Secundaria", parentId: category1.id },
      { name: "Terciaria", parentId: category1.id },
      { name: "Universitaria", parentId: category1.id },
      { name: "Gastronomia", parentId: category2.id },
      { name: "Logistica", parentId: category2.id },
      { name: "Agronomia", parentId: category2.id },
      { name: "Publico", parentId: category3.id },
      { name: "Privado", parentId: category3.id },
    ],
  });

  console.log("Datos sembrados exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
