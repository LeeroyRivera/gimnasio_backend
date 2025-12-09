const { Op, fn, col, literal } = require("sequelize");
const Asistencia = require("../../models/control_acceso/asistencia");
const Membresia = require("../../models/pagos/membresia");
const PlanMembresia = require("../../models/pagos/plan_membresia");
const Cliente = require("../../models/usuarios/cliente");
const Usuario = require("../../models/usuarios/usuario");

// GET /api/dashboard/admin/hoy
exports.obtenerResumenHoy = async (req, res) => {
  try {
    const hoy = new Date();
    const inicioDia = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      0,
      0,
      0,
      0
    );
    const finDia = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      23,
      59,
      59,
      999
    );

    // Asistencias totales del día
    const asistenciasTotalesHoy = await Asistencia.count({
      where: {
        fecha_entrada: { [Op.between]: [inicioDia, finDia] },
        estado_acceso: "Permitido",
      },
    });

    // Asistencias activas ahora (entró hoy, sin fecha_salida)
    const asistenciasActivasAhora = await Asistencia.count({
      where: {
        fecha_entrada: { [Op.between]: [inicioDia, finDia] },
        fecha_salida: null,
        estado_acceso: "Permitido",
      },
    });

    // Promedio de duración (en minutos) de asistencias de hoy con duracion_minutos calculado
    const promedioDuracion = await Asistencia.findOne({
      attributes: [[fn("AVG", col("duracion_minutos")), "promedio"]],
      where: {
        fecha_entrada: { [Op.between]: [inicioDia, finDia] },
        duracion_minutos: { [Op.ne]: null },
        estado_acceso: "Permitido",
      },
      raw: true,
    });

    const promedioDuracionMinutosHoy = promedioDuracion?.promedio
      ? Number(Number(promedioDuracion.promedio).toFixed(2))
      : 0;

    // Clientes asistidos por tipo de membresía (planes) durante el día
    // Usamos las asociaciones con alias definidos en relaciones.js
    const asistenciasPorMembresia = await Membresia.findAll({
      attributes: [[fn("COUNT", col("Membresia.id_membresia")), "total"]],
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: [],
          include: [
            {
              model: Usuario,
              as: "usuario",
              attributes: [],
              include: [
                {
                  model: Asistencia,
                  attributes: [],
                  where: {
                    fecha_entrada: { [Op.between]: [inicioDia, finDia] },
                    estado_acceso: "Permitido",
                  },
                },
              ],
            },
          ],
        },
        {
          model: PlanMembresia,
          as: "plan",
          attributes: ["nombre_plan"],
        },
      ],
      group: [col("plan.nombre_plan")],
      raw: true,
    });

    return res.json({
      fecha: inicioDia.toISOString().slice(0, 10),
      asistenciasTotalesHoy,
      asistenciasActivasAhora,
      promedioDuracionMinutosHoy,
      porMembresiaHoy: asistenciasPorMembresia.map((r) => ({
        plan: r["plan.nombre_plan"] || "Sin plan",
        total: Number(r.total),
      })),
    });
  } catch (error) {
    console.error("Error en obtenerResumenHoy:", error);
    return res.status(500).json({
      mensaje: "Error al obtener resumen del día",
      error: error.message,
    });
  }
};
