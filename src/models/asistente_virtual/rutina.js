const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Rutina = sequelize.define('Rutina', {}, {
  tableName: 'rutinas',
  timestamps: false
});

module.exports = Rutina;
