const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Cliente = sequelize.define('Cliente', {}, {
  tableName: 'clientes',
  timestamps: false
});

module.exports = Cliente;
