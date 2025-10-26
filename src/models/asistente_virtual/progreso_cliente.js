const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProgresoCliente = sequelize.define('ProgresoCliente', {}, {
  tableName: 'progreso_cliente',
  timestamps: false
});

module.exports = ProgresoCliente;
