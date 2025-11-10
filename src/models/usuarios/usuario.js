const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const argon2 = require("argon2");

const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id_rol",
      },
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    genero: {
      type: DataTypes.ENUM("M", "F", "Otros"),
      allowNull: true,
    },
    foto_perfil: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("activo", "inactivo", "suspendido"),
      allowNull: false,
      defaultValue: "activo",
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

Usuario.beforeCreate(async (usuario) => {
  if (usuario.password_hash) {
    usuario.password_hash = await argon2.hash(usuario.password_hash);
  }
});

module.exports = Usuario;
