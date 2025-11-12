const sesion = require("../../models/usuarios/sesion");
const { validationResult } = require("express-validator");
const { fn, col, Op } = require("sequelize");

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

exports.listarSesionesPorDia = async (req, res) => {
  const { desde, hasta } = req.query;

  try {
    const where = {};
    if (desde && hasta) {
      // Rango completo [desde 00:00:00, hasta 23:59:59]
      const desdeDate = new Date(desde);
      const hastaDate = new Date(hasta);
      if (isNaN(desdeDate) || isNaN(hastaDate)) {
        return res.status(400).json({ error: "Parámetros de fecha inválidos" });
      }
      // Incluir todo el día final sumando 1 día exclusivo o ajustando al final del día
      const hastaEnd = new Date(hastaDate);
      hastaEnd.setHours(23, 59, 59, 999);
      where.fecha_inicio = { [Op.between]: [desdeDate, hastaEnd] };
    } else if (desde) {
      const desdeDate = new Date(desde);
      if (isNaN(desdeDate)) {
        return res.status(400).json({ error: "Parámetro 'desde' inválido" });
      }
      where.fecha_inicio = { [Op.gte]: desdeDate };
    } else if (hasta) {
      const hastaDate = new Date(hasta);
      if (isNaN(hastaDate)) {
        return res.status(400).json({ error: "Parámetro 'hasta' inválido" });
      }
      const hastaEnd = new Date(hastaDate);
      hastaEnd.setHours(23, 59, 59, 999);
      where.fecha_inicio = { [Op.lte]: hastaEnd };
    }

    const resultados = await sesion.findAll({
      attributes: [
        [fn("DATE", col("fecha_inicio")), "dia"],
        [fn("COUNT", col("id_sesion")), "total"],
      ],
      where,
      group: [fn("DATE", col("fecha_inicio"))],
      order: [[fn("DATE", col("fecha_inicio")), "ASC"]],
      raw: true,
    });

    return res.status(200).json(resultados);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al agrupar sesiones por día: " + error });
  }
};
