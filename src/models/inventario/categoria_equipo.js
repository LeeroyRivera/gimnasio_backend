const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const CategoriaEquipo = sequelize.define('CategoriaEquipo', {}, {
  tableName: 'categorias_equipo',
  timestamps: false
});

module.exports = CategoriaEquipo;
