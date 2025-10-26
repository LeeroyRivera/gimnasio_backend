const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Mantenimiento = sequelize.define('Mantenimiento', {}, {
  tableName: 'mantenimientos',
  timestamps: false
});

module.exports = Mantenimiento;
