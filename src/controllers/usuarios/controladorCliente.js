const Cliente = require("../../models/usuarios/cliente");
const { validationResult } = require("express-validator");

exports.actualizarCliente = async (req, res) => {
  const errores = validationResult(req);
  const { id } = req.query;

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const cliente = await Cliente.findOne({ where: { id_cliente: id } });
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    await cliente.update({ ...req.body });

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cliente" + error });
  }
};
