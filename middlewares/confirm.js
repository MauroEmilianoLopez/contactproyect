// Middleware que verifica si el usuario es administrador o si su ID coincide con el de la ruta
const confirm = (req, res, next) => {
  const session = req.session || null; // Obtiene la sesión actual del usuario (si existe)
  const user = session?.user || null; // Extrae el usuario de la sesión (si existe)
  const isAdmin = user?.isAdmin; // Verifica si el usuario tiene privilegios de administrador

  // Si el usuario es administrador, permite el acceso a la siguiente función
  if (isAdmin) {
    return next();
  }

  // Si el usuario no es administrador, pero su ID coincide con el de la ruta, permite el acceso
  if (user.id == req.params.id) {
    return next();
  }

  // Si ninguna de las condiciones anteriores se cumple, redirige al usuario a la página de usuarios
  return res.redirect("/users");
};

export default confirm; // Exporta el middleware para que pueda ser utilizado en otras partes de la aplicación
