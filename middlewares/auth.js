const auth = (req, res, next) => {
  const session = req.session || null;
  if (session && session.user.isAdmin) {
    return next();
  }
  // Volver a la ruta anterior
  const previous = req.get("Referer") || "/";
  return res.redirect(previous);
};
export default auth;
