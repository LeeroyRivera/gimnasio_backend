const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Cliente = sequelize.define(
  "Cliente",
  {
    id_cliente: {
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
    tipo_sangre: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    peso_actual: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    altura: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    condiciones_medicas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contacto_emergencia: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    telefono_emergencia: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "clientes",
    timestamps: false,
  }
);

module.exports = Cliente;
