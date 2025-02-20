// Middleware que verifica si el usuario tiene permisos de administrador
const admin = (req, res, next) => {
  const session = req.session || null; // Obtiene la sesión actual del usuario (si existe)

  // Verifica si la sesión existe y si el usuario es administrador
  if (session && session.user.isAdmin) {
    return next(); // Si el usuario es administrador, continúa con la ejecución de la siguiente función
  }

  // Si no es administrador, redirige al usuario a la página de usuarios
  return res.redirect("/users");
};

export default admin; // Exporta el middleware para que pueda ser utilizado en otras partes de la aplicación
