function autenticacionRol(rolPermitido) {
  return (req, res, next) => {
    if (!req.user || req.user.rol !== rolPermitido) {
      return res
        .status(403)
        .json({ error: "Acceso denegado: rol insuficiente" });
    }
    next();
  };
}
module.exports = { autenticacionRol };
