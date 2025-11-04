const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const UsuarioRol = sequelize.define('UsuarioRol', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  }
}, {
  tableName: 'usuarios_roles',
  timestamps: false
});

module.exports = UsuarioRol;
