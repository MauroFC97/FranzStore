export const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId) {
    if (req.session.role === "admin") {
      return next();
    } else {
      return res.status(401).json({ message: "Usted no está autorizado" });
    }
  }
};
