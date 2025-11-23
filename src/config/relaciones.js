const Rol = require("../models/usuarios/rol");
const Usuario = require("../models/usuarios/usuario");
const Cliente = require("../models/usuarios/cliente");
const Sesion = require("../models/usuarios/sesion");

const PlanMembresia = require("../models/pagos/plan_membresia");
const Membresia = require("../models/pagos/membresia");
const Pago = require("../models/pagos/pago");

const Asistencia = require("../models/control_acceso/asistencia");
const CodigoQrAcceso = require("../models/control_acceso/codigo_qr_acceso");

const CategoriaEquipo = require("../models/inventario/categoria_equipo");
const Equipo = require("../models/inventario/equipo");
const Mantenimiento = require("../models/inventario/mantenimiento");

module.exports = function establecerRelaciones() {
  // Usuario / Rol (1:N)
  Rol.hasMany(Usuario, { foreignKey: "id_rol" });
  Usuario.belongsTo(Rol, { foreignKey: "id_rol" });

  // Cliente / Personal (1:1 con Usuario)
  Usuario.hasOne(Cliente, { foreignKey: "id_usuario", onDelete: "CASCADE" });
  Cliente.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

  // Sesiones (1:N Usuario)
  Usuario.hasMany(Sesion, { foreignKey: "id_usuario" });
  Sesion.belongsTo(Usuario, { foreignKey: "id_usuario" });

  // Membresías y planes
  PlanMembresia.hasMany(Membresia, { foreignKey: "id_plan" });
  Membresia.belongsTo(PlanMembresia, { foreignKey: "id_plan", as: "plan" });

  Cliente.hasMany(Membresia, { foreignKey: "id_cliente", onDelete: "CASCADE" });
  Membresia.belongsTo(Cliente, { foreignKey: "id_cliente", as: "cliente" });

  // Pagos
  Membresia.hasMany(Pago, { foreignKey: "id_membresia" });
  Pago.belongsTo(Membresia, { foreignKey: "id_membresia", as: "membresia" });

  Usuario.hasMany(Pago, { foreignKey: "procesado_por" });
  Pago.belongsTo(Usuario, { foreignKey: "procesado_por", as: "procesadoPor" });

  // Control de acceso
  Usuario.hasMany(Asistencia, { foreignKey: "id_usuario" });
  Asistencia.belongsTo(Usuario, { foreignKey: "id_usuario" });

  CodigoQrAcceso.hasMany(Asistencia, { foreignKey: "id_codigo_qr" });
  Asistencia.belongsTo(CodigoQrAcceso, { foreignKey: "id_codigo_qr" });

  // Inventario
  CategoriaEquipo.hasMany(Equipo, { foreignKey: "id_categoria" });
  Equipo.belongsTo(CategoriaEquipo, { foreignKey: "id_categoria", as: "categoria_equipo" });

  Equipo.hasMany(Mantenimiento, {
    foreignKey: "id_equipo",
    onDelete: "CASCADE",
  });
  Mantenimiento.belongsTo(Equipo, { foreignKey: "id_equipo", as: "equipo" });
};
