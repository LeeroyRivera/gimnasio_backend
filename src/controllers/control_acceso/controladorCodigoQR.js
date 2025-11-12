const CodigoQrAcceso = require("../../models/control_acceso/codigo_qr_acceso");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

exports.listarTodos = async (req, res) => {
  try {
    const codigos = await CodigoQrAcceso.findAll();
    return res.status(200).json(codigos);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al listar códigos QR: " + error });
  }
};

exports.generarManual = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const { codigo_qr, horas_validez } = req.body;

    // Evitar duplicados si así se requiere
    const existe = await CodigoQrAcceso.findOne({ where: { codigo_qr } });
    if (existe) {
      return res.status(409).json({ error: "El código QR ya existe" });
    }

    const ahora = new Date();
    // Desactivar el último código activo si está vigente
    const ultimoActivo = await CodigoQrAcceso.findOne({
      where: { estado: true, fecha_Expiracion: { [Op.gt]: ahora } },
      order: [["fecha_Generacion", "DESC"]],
    });
    if (ultimoActivo) {
      await ultimoActivo.update({ estado: false, fecha_Expiracion: ahora });
    }

    const horas = Number.isFinite(Number(horas_validez)) //isFinite verifica si es un número finito, no NaN
      ? Number(horas_validez)
      : 24; // por defecto 24h
    const expiracion = new Date(ahora.getTime() + horas * 60 * 60 * 1000);

    const creado = await CodigoQrAcceso.create({
      codigo_qr,
      fecha_Generacion: ahora,
      fecha_Expiracion: expiracion,
      estado: true,
      tipo_codigo: "Manual",
    });

    return res.status(201).json(creado);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al generar código QR manual: " + error });
  }
};

exports.generarAutomatico = async () => {
  try {
    const ahora = new Date();

    // 1) Verificar si ya existe un código activo (no expirado y estado=true)
    const existente = await CodigoQrAcceso.findOne({
      where: {
        estado: true,
        fecha_Expiracion: { [Op.gt]: ahora },
      },
      order: [["fecha_Generacion", "DESC"]],
    });

    if (existente) {
      console.log(
        "Ya existe un código QR activo, no se genera uno nuevo:",
        existente.id_codigo_qr
      );
      return existente;
    }

    // 2) Generar uno nuevo si no hay activo
    const codigo_qr = `QR-${Date.now()}`;

    const creado = await CodigoQrAcceso.create({
      codigo_qr,
      fecha_Generacion: ahora,
    });

    console.log("Código QR automático generado:", creado.id_codigo_qr);
    return creado;
  } catch (error) {
    console.error("Error al generar código QR automático:", error);
  }
};
