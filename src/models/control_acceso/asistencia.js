const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Asistencia = sequelize.define('Asistencia', {}, {
  tableName: 'asistencias',
  timestamps: false
});

module.exports = Asistencia;
