const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Equipo = sequelize.define('Equipo', {}, {
  tableName: 'equipos',
  timestamps: false
});

module.exports = Equipo;
