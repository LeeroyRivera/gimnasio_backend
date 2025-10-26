const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const UsuarioRol = sequelize.define('UsuarioRol', {}, {
  tableName: 'usuarios_roles',
  timestamps: false
});

module.exports = UsuarioRol;
