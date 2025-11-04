const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Membresia = sequelize.define('Membresia', {}, {
  
  
  
  tableName: 'membresias',
  timestamps: false
});

module.exports = Membresia;
