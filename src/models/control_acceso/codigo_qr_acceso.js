const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const CodigoQrAcceso = sequelize.define(
  "CodigoQrAcceso",
  {
    id_codigo_qr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo_qr: {
      type: DataTypes.STRING(100),
    },
    fecha_Generacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_Expiracion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas desde la generación
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    tipo_codigo: {
      type: DataTypes.ENUM("Diario", "Unico", "Manual"),
      allowNull: false,
      defaultValue: "Diario",
    },
  },
  {
    tableName: "codigos_qr_acceso",
    timestamps: false,
  }
);

module.exports = CodigoQrAcceso;
