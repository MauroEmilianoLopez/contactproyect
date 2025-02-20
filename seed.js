// Importa PrismaClient desde Prisma para interactuar con la base de datos
import { PrismaClient } from "@prisma/client";
// Crea una nueva instancia de PrismaClient
const prisma = new PrismaClient();

// Función principal asincrónica para sembrar datos en la base de datos
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
        // Asocia el archivo de imagen con el usuario
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
        // Asocia el archivo de imagen con el usuario
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
        // Asocia el archivo de imagen con el usuario
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
        // Asocia el archivo de imagen con el usuario
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
        // Asocia el archivo de imagen con el usuario
        fileId: files.find(
          ({ filename }) => filename === "jesus-eduardo-kawhati.jpg"
        ).id,
      },
    }),
  ]);

  // Crear 3 categorías principales
  const category1 = await prisma.category.create({
    data: {
      name: "Educación", // Crea la categoría principal "Educación"
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: "Rubro", // Crea la categoría principal "Rubro"
    },
  });

  const category3 = await prisma.category.create({
    data: {
      name: "Sector", // Crea la categoría principal "Sector"
    },
  });

  // Crear subcategorías para cada categoría principal
  await prisma.category.createMany({
    data: [
      { name: "Inicial", parentId: category1.id }, // Subcategoría "Inicial" de la categoría "Educación"
      { name: "Secundaria", parentId: category1.id }, // Subcategoría "Secundaria" de la categoría "Educación"
      { name: "Terciaria", parentId: category1.id }, // Subcategoría "Terciaria" de la categoría "Educación"
      { name: "Universitaria", parentId: category1.id }, // Subcategoría "Universitaria" de la categoría "Educación"
      { name: "Gastronomia", parentId: category2.id }, // Subcategoría "Gastronomia" de la categoría "Rubro"
      { name: "Logistica", parentId: category2.id }, // Subcategoría "Logistica" de la categoría "Rubro"
      { name: "Agronomia", parentId: category2.id }, // Subcategoría "Agronomia" de la categoría "Rubro"
      { name: "Publico", parentId: category3.id }, // Subcategoría "Publico" de la categoría "Sector"
      { name: "Privado", parentId: category3.id }, // Subcategoría "Privado" de la categoría "Sector"
    ],
  });

  // Imprime un mensaje indicando que los datos se sembraron exitosamente
  console.log("Datos sembrados exitosamente.");
}

// Llama a la función principal
main()
  .catch((e) => {
    // Si ocurre un error, lo muestra en la consola y termina el proceso
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Finalmente, desconecta Prisma de la base de datos
    await prisma.$disconnect();
  });
