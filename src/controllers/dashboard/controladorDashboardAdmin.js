const { Op, fn, col, literal } = require("sequelize");
const Asistencia = require("../../models/control_acceso/asistencia");
const Membresia = require("../../models/pagos/membresia");
const PlanMembresia = require("../../models/pagos/plan_membresia");
const Cliente = require("../../models/usuarios/cliente");

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
    // Unimos Asistencia -> Cliente (por id_usuario) -> Membresia -> PlanMembresia
    const asistenciasPorMembresia = await Asistencia.findAll({
      attributes: [
        [fn("COUNT", col("Asistencia.id")), "total"],
        [col("PlanMembresia.nombre_plan"), "plan"],
      ],
      include: [
        {
          model: Cliente,
          required: true,
          attributes: [],
          where: { id_usuario: col("Asistencia.id_usuario") },
          include: [
            {
              model: Membresia,
              required: true,
              attributes: [],
              include: [
                {
                  model: PlanMembresia,
                  required: true,
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
      where: {
        fecha_entrada: { [Op.between]: [inicioDia, finDia] },
        estado_acceso: "Permitido",
      },
      group: [col("PlanMembresia.nombre_plan")],
      raw: true,
    });

    return res.json({
      fecha: inicioDia.toISOString().slice(0, 10),
      asistenciasTotalesHoy,
      asistenciasActivasAhora,
      promedioDuracionMinutosHoy,
      porMembresiaHoy: asistenciasPorMembresia.map((r) => ({
        plan: r.plan,
        total: Number(r.total),
      })),
    });
  } catch (error) {
    console.error("Error en obtenerResumenHoy:", error);
    return res
      .status(500)
      .json({
        mensaje: "Error al obtener resumen del día",
        error: error.message,
      });
  }
};
