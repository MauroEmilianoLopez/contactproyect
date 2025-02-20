// Middleware que verifica si el usuario está autenticado y activo
const auth = (req, res, next) => {
  const session = req.session || null; // Obtiene la sesión actual del usuario (si existe)

  // Verifica si la sesión existe, si el usuario está presente en la sesión y si el usuario está activo
  if (session && session.user && session.user.isActive) {
    return next(); // Si el usuario está autenticado y activo, continúa con la ejecución de la siguiente función
  }

  // Si el usuario no está autenticado o no está activo, redirige al usuario a la página principal
  return res.redirect("/");
};

export default auth; // Exporta el middleware para que pueda ser utilizado en otras partes de la aplicación
