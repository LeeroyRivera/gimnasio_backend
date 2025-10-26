const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Usuario = sequelize.define('Usuario', {}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;
