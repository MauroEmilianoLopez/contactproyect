# Proyecto de Gestión de Contactos

## Descripción

Este proyecto es una plataforma para gestionar usuarios y categorías de contactos, permitiendo la creación, edición, eliminación y visualización de usuarios, junto con la asignación de categorías y subcategorías. Los usuarios pueden tener roles como administradores o no, con funcionalidades restringidas dependiendo de su rol.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para el servidor.
- **Express.js**: Framework para crear aplicaciones web.
- **Prisma**: ORM para la conexión con la base de datos.
- **EJS**: Motor de plantillas para renderizar vistas.
- **Multer**: Middleware para la carga de archivos.
- **Express-session**: Middleware para manejar sesiones de los usuarios.
- **Cookie-parser**: Middleware para manejar las cookies.

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu entorno local:

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/MauroEmilianoLopez/contactproyect.git
   cd contactproyect
   ```

2. **Instalar dependencias**:

   Asegúrate de tener Node.js y npm instalados. Si no los tienes, puedes descargarlos desde [nodejs.org](https://nodejs.org/).

   Luego, instala las dependencias del proyecto:

   ```bash
   npm install
   ```

3. **Configuración de la base de datos**:

   El proyecto usa Prisma como ORM. Para configurarlo, sigue estos pasos:

   - Crea un archivo `.env` en la raíz del proyecto y añade la configuración de tu base de datos:

     ```bash
     DATABASE_URL="file:./data.db"
     ```

   - Corre las migraciones para crear las tablas en la base de datos:

     ```bash
     npx prisma migrate dev
     ```

   - Crea el cliente de Prisma para menejar los datos y las tablas:
     ```bash
     npx prisma generate
     ```

4. **Ejecutar el proyecto**:

   Para iniciar el servidor, ejecuta:

   ```bash
   npm start
   ```

   El servidor debería estar disponible en `http://localhost:3030`.

## Rutas

### Auth Routes

- `GET /`: Muestra el formulario de inicio de sesión.
- `POST /access`: Maneja la autenticación de los usuarios.
- `GET /logout`: Cierra la sesión del usuario.

### User Routes

- `GET /users`: Muestra la lista de usuarios.
- `GET /users/create`: Muestra el formulario para crear un nuevo usuario (solo administradores).
- `POST /users/save`: Guarda un nuevo usuario (solo administradores).
- `GET /users/edit/:id`: Muestra el formulario para editar un usuario específico (confirmación de usuario o administrador).
- `POST /users/update/:id`: Actualiza los datos de un usuario.
- `POST /users/status`: Cambia el estado de un usuario (solo administradores).

### Category Routes

- `GET /categories/create`: Muestra el formulario para crear una nueva categoría (solo administradores).
- `POST /categories/save`: Guarda una nueva categoría (solo administradores).
- `GET /categories/edit/:id`: Muestra el formulario para editar una categoría (solo administradores).
- `POST /categories/remove`: Elimina una categoría (solo administradores).
- `POST /categories/addSubcategory`: Añade una subcategoría a una categoría (solo administradores).
- `POST /categories/removeSubcategory`: Elimina una subcategoría de una categoría (solo administradores).

## Middlewares

- **Auth Middleware**: Asegura que el usuario esté autenticado antes de acceder a ciertas rutas.
- **Admin Middleware**: Verifica si el usuario tiene permisos de administrador antes de permitirle acceder a ciertas rutas.
- **Confirm Middleware**: Verifica si el usuario tiene acceso a editar o eliminar su propio perfil o si tiene permisos de administrador.

## Estructura de la Base de Datos

- **Usuarios (contactos)**:

  - `id`: ID único del usuario.
  - `name`: Nombre completo del usuario.
  - `email`: Correo electrónico del usuario.
  - `phone`: Teléfono de contacto.
  - `address`: Dirección del usuario.
  - `gender`: Género del usuario.
  - `age`: Edad del usuario.
  - `link`: Enlace a su perfil profesional (LinkedIn, por ejemplo).
  - `isAdmin`: Booleano que define si el usuario es administrador.
  - `fileId`: Relación con la tabla de archivos (imagen del usuario).

- **Categorías**:

  - `id`: ID único de la categoría.
  - `name`: Nombre de la categoría.
  - `parentId`: ID de la categoría principal (para subcategorías).

- **Archivos**:
  - `id`: ID único del archivo.
  - `filename`: Nombre del archivo.
