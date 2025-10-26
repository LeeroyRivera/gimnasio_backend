const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Sesion = sequelize.define('Sesion', {}, {
  tableName: 'sesiones',
  timestamps: false
});

module.exports = Sesion;
