const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Pago = sequelize.define('Pago', {}, {
  tableName: 'pagos',
  timestamps: false
});

module.exports = Pago;
