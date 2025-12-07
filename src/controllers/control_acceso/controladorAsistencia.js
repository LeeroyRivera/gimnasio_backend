const Asistencia = require("../../models/control_acceso/asistencia");
const CodigoQrAcceso = require("../../models/control_acceso/codigo_qr_acceso");
const Usuario = require("../../models/usuarios/usuario");
const Cliente = require("../../models/usuarios/cliente");
const { validationResult } = require("express-validator");
const { Op, fn, col } = require("sequelize");

/**
 * Registrar asistencia mediante escaneo de QR
 * - Si es la primera vez del día -> registra entrada
 * - Si ya tiene entrada sin salida -> registra salida y calcula duración
 */
exports.registrarAsistenciaQR = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { id_usuario, codigo_qr } = req.body;

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar que el código QR existe y está activo
    const codigoQR = await CodigoQrAcceso.findOne({
      where: { codigo_qr, estado: true },
    });

    if (!codigoQR) {
      return res
        .status(404)
        .json({ error: "Código QR no encontrado o inactivo" });
    }

    // Verificar si el código QR está expirado
    const ahora = new Date();
    if (codigoQR.fecha_Expiracion && codigoQR.fecha_Expiracion < ahora) {
      return res.status(403).json({ error: "Código QR expirado" });
    }

    // Buscar si ya tiene una asistencia activa (entrada sin salida) del mismo día
    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    const asistenciaActiva = await Asistencia.findOne({
      where: {
        id_usuario,
        fecha_entrada: { [Op.gte]: inicioDelDia },
        fecha_salida: null,
      },
      order: [["fecha_entrada", "DESC"]],
    });

    if (asistenciaActiva) {
      // Registrar salida y calcular duración
      const fechaSalida = new Date();
      const duracion = Math.floor(
        (fechaSalida - asistenciaActiva.fecha_entrada) / 1000 / 60
      ); // minutos

      await asistenciaActiva.update({
        fecha_salida: fechaSalida,
        duracion_minutos: duracion,
      });

      return res.status(200).json({
        mensaje: "Salida registrada exitosamente",
        asistencia: asistenciaActiva,
      });
    } else {
      // Registrar entrada
      const nuevaAsistencia = await Asistencia.create({
        id_usuario,
        id_codigo_qr: codigoQR.id_codigo_qr,
        fecha_entrada: ahora,
        tipo_acceso: "QR",
        estado_acceso: "Permitido",
      });

      return res.status(201).json({
        mensaje: "Entrada registrada exitosamente",
        asistencia: nuevaAsistencia,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error al registrar asistencia por QR: " + error.message,
    });
  }
};

/**
 * Registrar asistencia manual (sin QR)
 */
exports.registrarAsistenciaManual = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { id_usuario, tipo = "entrada", notas } = req.body;

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    if (tipo === "entrada") {
      // Verificar si ya tiene entrada del día
      const entradaExistente = await Asistencia.findOne({
        where: {
          id_usuario,
          fecha_entrada: { [Op.gte]: inicioDelDia },
          fecha_salida: null,
        },
      });

      if (entradaExistente) {
        return res
          .status(409)
          .json({ error: "El usuario ya tiene una entrada registrada hoy" });
      }

      // Crear entrada manual
      const nuevaAsistencia = await Asistencia.create({
        id_usuario,
        fecha_entrada: new Date(),
        tipo_acceso: "Manual",
        estado_acceso: "Permitido",
        notas,
      });

      return res.status(201).json({
        mensaje: "Entrada manual registrada exitosamente",
        asistencia: nuevaAsistencia,
      });
    } else if (tipo === "salida") {
      // Buscar entrada sin salida
      const asistenciaActiva = await Asistencia.findOne({
        where: {
          id_usuario,
          fecha_entrada: { [Op.gte]: inicioDelDia },
          fecha_salida: null,
        },
        order: [["fecha_entrada", "DESC"]],
      });

      if (!asistenciaActiva) {
        return res.status(404).json({
          error: "No se encontró una entrada activa para este usuario",
        });
      }

      // Registrar salida y calcular duración
      const fechaSalida = new Date();
      const duracion = Math.floor(
        (fechaSalida - asistenciaActiva.fecha_entrada) / 1000 / 60
      );

      await asistenciaActiva.update({
        fecha_salida: fechaSalida,
        duracion_minutos: duracion,
        notas: notas || asistenciaActiva.notas,
      });

      return res.status(200).json({
        mensaje: "Salida manual registrada exitosamente",
        asistencia: asistenciaActiva,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Tipo debe ser 'entrada' o 'salida'" });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error al registrar asistencia manual: " + error.message,
    });
  }
};

/**
 * Listar asistencias de un usuario específico
 */
exports.listarAsistenciasUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { id_usuario } = req.params;
    const { desde, hasta, limit = 50, offset = 0 } = req.query;

    const whereClause = { id_usuario };

    // Filtros opcionales de fecha
    if (desde || hasta) {
      whereClause.fecha_entrada = {};
      if (desde) {
        whereClause.fecha_entrada[Op.gte] = new Date(desde);
      }
      if (hasta) {
        const hastaDate = new Date(hasta);
        hastaDate.setHours(23, 59, 59, 999);
        whereClause.fecha_entrada[Op.lte] = hastaDate;
      }
    }

    const asistencias = await Asistencia.findAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          attributes: ["id_usuario", "username", "email"],
          include: [
            {
              model: Cliente,
              attributes: ["nombre", "apellido"],
            },
          ],
        },
        {
          model: CodigoQrAcceso,
          attributes: ["codigo_qr", "tipo_codigo"],
        },
      ],
      order: [["fecha_entrada", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.status(200).json({
      total: asistencias.length,
      asistencias,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al listar asistencias del usuario: " + error.message,
    });
  }
};

/**
 * Listar asistencias agrupadas por día
 */
exports.listarAsistenciasPorDia = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { desde, hasta } = req.query;

    const whereClause = {};

    // Filtros de fecha
    if (desde || hasta) {
      whereClause.fecha_entrada = {};
      if (desde) {
        whereClause.fecha_entrada[Op.gte] = new Date(desde);
      }
      if (hasta) {
        const hastaDate = new Date(hasta);
        hastaDate.setHours(23, 59, 59, 999);
        whereClause.fecha_entrada[Op.lte] = hastaDate;
      }
    }

    const asistenciasPorDia = await Asistencia.findAll({
      attributes: [
        [fn("DATE", col("fecha_entrada")), "fecha"],
        [fn("COUNT", col("id")), "total_asistencias"],
        [fn("COUNT", fn("DISTINCT", col("id_usuario"))), "usuarios_unicos"],
      ],
      where: whereClause,
      group: [fn("DATE", col("fecha_entrada"))],
      order: [[fn("DATE", col("fecha_entrada")), "DESC"]],
      raw: true,
    });

    return res.status(200).json({
      total_dias: asistenciasPorDia.length,
      asistencias_por_dia: asistenciasPorDia,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al listar asistencias por día: " + error.message,
    });
  }
};

/**
 * Listar asistencias para panel de administración (filtros opcionales por usuario y fecha)
 */
exports.listarAsistenciasAdmin = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { id_usuario, desde, hasta } = req.query;

    const whereClause = {};

    if (id_usuario) {
      whereClause.id_usuario = id_usuario;
    }

    if (desde || hasta) {
      whereClause.fecha_entrada = {};
      if (desde) {
        whereClause.fecha_entrada[Op.gte] = new Date(desde);
      }
      if (hasta) {
        const hastaDate = new Date(hasta);
        hastaDate.setHours(23, 59, 59, 999);
        whereClause.fecha_entrada[Op.lte] = hastaDate;
      }
    }

    const asistencias = await Asistencia.findAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          attributes: ["id_usuario", "username", "email"],
          include: [
            {
              model: Cliente,
              attributes: ["nombre", "apellido"],
            },
          ],
        },
        {
          model: CodigoQrAcceso,
          attributes: ["codigo_qr", "tipo_codigo"],
        },
      ],
      order: [["fecha_entrada", "DESC"]],
    });

    return res.status(200).json({ total: asistencias.length, asistencias });
  } catch (error) {
    return res.status(500).json({
      error:
        "Error al listar asistencias para administración: " + error.message,
    });
  }
};

// Listar asistencias del usuario autenticado
exports.listarAsistenciasUsuarioAutenticado = async (req, res) => {
  try {
    const idUsuario = req.user?.id;
    if (!idUsuario) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const asistencias = await Asistencia.findAll({
      where: { id_usuario: idUsuario },
      order: [["fecha_entrada", "DESC"]],
    });

    return res.status(200).json(asistencias);
  } catch (error) {
    return res.status(500).json({
      error:
        "Error al listar asistencias del usuario autenticado: " + error.message,
    });
  }
};
