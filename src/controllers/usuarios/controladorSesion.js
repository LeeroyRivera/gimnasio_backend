const sesion = require("../../models/usuarios/sesion");
const { validationResult } = require("express-validator");

exports.listarSesionesPorUsuario = async (req, res) => {
  const { id_usuario } = req.query;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    const sesiones = await sesion.findAll({ where: { id_usuario } });
    res.status(200).json(sesiones);
  } catch (error) {
    res.status(500).json({ error: "Error al listar sesiones" + error });
  }
};
