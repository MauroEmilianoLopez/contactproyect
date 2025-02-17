const user = (req, res, next) => {
  const session = req.session || null;
  res.locals.user = session ? session.user : null;
  next();
};
export default user;
