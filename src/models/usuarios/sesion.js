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
      defaultValue: DataTypes.NOW,
    },
    fecha_expiracion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("activa", "cerrada", "expirada"),
      allowNull: false,
      defaultValue: "activa",
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: "localhost",
    },
    dispositivo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "Postman",
    },
  },
  {
    tableName: "sesiones",
    timestamps: false,
  }
);

Sesion.beforeCreate((sesion, options) => {
  sesion.fecha_expiracion = new Date(
    sesion.fecha_inicio.getTime() + 60 * 60 * 1000 //60 segundos * 60 minutos * 1000 milisegundos = 3,600,000 ms
  );
});

module.exports = Sesion;
