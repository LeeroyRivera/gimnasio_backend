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

    // Asistencias de hoy agrupadas por plan de membresía
    // Contamos registros de Asistencia (no clientes únicos) por tipo de plan
    // Asistencias de hoy agrupadas por plan de membresía (contando registros de asistencia)
    // Cadena de relaciones usada:
    // Asistencia -> Usuario (id_usuario)
    // Usuario -> Cliente (Usuario.hasOne(Cliente), Cliente.belongsTo(Usuario, as: 'usuario'))
    // Cliente -> Membresia (Cliente.hasMany(Membresia), Membresia.belongsTo(Cliente, as: 'cliente'))
    // Membresia -> PlanMembresia (as: 'plan')
    const asistenciasPorMembresia = await Asistencia.findAll({
      attributes: [[fn("COUNT", col("Asistencia.id")), "total"]],
      where: {
        fecha_entrada: { [Op.between]: [inicioDia, finDia] },
        estado_acceso: "Permitido",
      },
      include: [
        {
          model: Usuario,
          attributes: [],
          include: [
            {
              model: Cliente,
              attributes: [],
              include: [
                {
                  model: Membresia,
                  attributes: [],
                  include: [
                    {
                      model: PlanMembresia,
                      as: "plan",
                      attributes: ["nombre_plan"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      group: [col("planes_membresia.nombre_plan")],
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
