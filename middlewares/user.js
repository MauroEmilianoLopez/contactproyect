// Middleware que guarda la información del usuario en las variables locales de la respuesta
const user = (req, res, next) => {
  const session = req.session || null; // Obtiene la sesión actual del usuario (si existe)

  // Si la sesión existe, guarda los datos del usuario en res.locals (para accederlo en las vistas)
  res.locals.userSession = session ? session.user : null;

  next(); // Pasa al siguiente middleware o función
};

export default user; // Exporta el middleware para que pueda ser utilizado en otras partes de la aplicación
