const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Ejercicio = sequelize.define('Ejercicio', {}, {
  tableName: 'ejercicios',
  timestamps: false
});

module.exports = Ejercicio;
