const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const RutinaEjercicio = sequelize.define('RutinaEjercicio', {}, {
  tableName: 'rutinas_ejercicios',
  timestamps: false
});

module.exports = RutinaEjercicio;
