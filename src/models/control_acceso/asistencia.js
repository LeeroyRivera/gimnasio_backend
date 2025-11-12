const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Asistencia = sequelize.define(
  "Asistencia",
  {
    id_asistencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_codigo_qr: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_entrada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_salida: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duracion_minutos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tipo_acceso: {
      type: DataTypes.ENUM("QR", "Manual"),
    },
    estado_acceso: {
      type: DataTypes.ENUM("Permitido", "Denegado"),
      defaultValue: "Permitido",
    },
    notas: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "asistencias",
    timestamps: false,
  }
);

module.exports = Asistencia;
