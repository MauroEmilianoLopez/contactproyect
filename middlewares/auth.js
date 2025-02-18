const auth = (req, res, next) => {
  const session = req.session || null;
  if (session && session.user) {
    return next();
  }
  return res.redirect("/");
};
export default auth;
