const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Rol = sequelize.define('Rol', {}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Rol;
