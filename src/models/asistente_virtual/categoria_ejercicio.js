const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const CategoriaEjercicio = sequelize.define('CategoriaEjercicio', {}, {
  tableName: 'categorias_ejercicio',
  timestamps: false
});

module.exports = CategoriaEjercicio;
