const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Sesion = sequelize.define(
  "Sesion",
  {
    id_sesion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuario",
      },
    },
    access_token: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    token_anterior: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("activa", "cerrada", "expirada"),
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    dispositivo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "sesiones",
    timestamps: false,
  }
);

module.exports = Sesion;
