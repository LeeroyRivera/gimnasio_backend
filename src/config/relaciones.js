const Rol = require("../models/usuarios/rol");
const Usuario = require("../models/usuarios/usuario");
const Cliente = require("../models/usuarios/cliente");
const Personal = require("../models/usuarios/personal");
const Sesion = require("../models/usuarios/sesion");

const PlanMembresia = require("../models/pagos/plan_membresia");
const Membresia = require("../models/pagos/membresia");
const Pago = require("../models/pagos/pago");

const Asistencia = require("../models/control_acceso/asistencia");
const CodigoQrAcceso = require("../models/control_acceso/codigo_qr_acceso");

const CategoriaEquipo = require("../models/inventario/categoria_equipo");
const Equipo = require("../models/inventario/equipo");
const Mantenimiento = require("../models/inventario/mantenimiento");

const CategoriaEjercicio = require("../models/asistente_virtual/categoria_ejercicio");
const Ejercicio = require("../models/asistente_virtual/ejercicio");
const Rutina = require("../models/asistente_virtual/rutina");
const RutinaEjercicio = require("../models/asistente_virtual/rutina_ejercicio");
const ProgresoCliente = require("../models/asistente_virtual/progreso_cliente");

module.exports = function establecerRelaciones() {
  // Usuario / Rol (1:1)
  Usuario.hasOne(Rol, { foreignKey: "id_rol" });
  Rol.belongsTo(Usuario, { foreignKey: "id_rol" });

  // Cliente / Personal (1:1 con Usuario)
  Usuario.hasOne(Cliente, { foreignKey: "id_usuario", onDelete: "CASCADE" });
  Cliente.belongsTo(Usuario, { foreignKey: "id_usuario" });

  Usuario.hasOne(Personal, { foreignKey: "id_usuario", onDelete: "CASCADE" });
  Personal.belongsTo(Usuario, { foreignKey: "id_usuario" });

  // Sesiones (1:N Usuario)
  Usuario.hasMany(Sesion, { foreignKey: "id_usuario" });
  Sesion.belongsTo(Usuario, { foreignKey: "id_usuario" });

  // Membresías y planes
  PlanMembresia.hasMany(Membresia, { foreignKey: "id_plan" });
  Membresia.belongsTo(PlanMembresia, { foreignKey: "id_plan" });

  Cliente.hasMany(Membresia, { foreignKey: "id_cliente", onDelete: "CASCADE" });
  Membresia.belongsTo(Cliente, { foreignKey: "id_cliente" });

  // Pagos
  Membresia.hasMany(Pago, { foreignKey: "id_membresia" });
  Pago.belongsTo(Membresia, { foreignKey: "id_membresia" });

  Usuario.hasMany(Pago, { foreignKey: "procesado_por" });
  Pago.belongsTo(Usuario, { foreignKey: "procesado_por", as: "procesadoPor" });

  // Control de acceso
  Usuario.hasMany(Asistencia, { foreignKey: "id_usuario" });
  Asistencia.belongsTo(Usuario, { foreignKey: "id_usuario" });

  CodigoQrAcceso.hasMany(Asistencia, { foreignKey: "id_codigo_qr" });
  Asistencia.belongsTo(CodigoQrAcceso, { foreignKey: "id_codigo_qr" });

  // Inventario
  CategoriaEquipo.hasMany(Equipo, { foreignKey: "id_categoria" });
  Equipo.belongsTo(CategoriaEquipo, { foreignKey: "id_categoria" });

  Equipo.hasMany(Mantenimiento, {
    foreignKey: "id_equipo",
    onDelete: "CASCADE",
  });
  Mantenimiento.belongsTo(Equipo, { foreignKey: "id_equipo" });

  // Asistente virtual
  CategoriaEjercicio.hasMany(Ejercicio, {
    foreignKey: "id_categoria_ejercicio",
  });
  Ejercicio.belongsTo(CategoriaEjercicio, {
    foreignKey: "id_categoria_ejercicio",
  });

  Cliente.hasMany(Rutina, { foreignKey: "id_cliente", onDelete: "CASCADE" });
  Rutina.belongsTo(Cliente, { foreignKey: "id_cliente" });

  Rutina.hasMany(RutinaEjercicio, {
    foreignKey: "id_rutina",
    onDelete: "CASCADE",
  });
  RutinaEjercicio.belongsTo(Rutina, { foreignKey: "id_rutina" });

  Ejercicio.hasMany(RutinaEjercicio, { foreignKey: "id_ejercicio" });
  RutinaEjercicio.belongsTo(Ejercicio, { foreignKey: "id_ejercicio" });

  Cliente.hasMany(ProgresoCliente, {
    foreignKey: "id_cliente",
    onDelete: "CASCADE",
  });
  ProgresoCliente.belongsTo(Cliente, { foreignKey: "id_cliente" });
};
