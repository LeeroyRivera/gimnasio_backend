const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PlanMembresia = sequelize.define('PlanMembresia', {}, {
  tableName: 'planes_membresia',
  timestamps: false
});

module.exports = PlanMembresia;
