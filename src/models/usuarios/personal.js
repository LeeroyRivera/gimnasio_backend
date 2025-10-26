const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Personal = sequelize.define('Personal', {}, {
  tableName: 'personal',
  timestamps: false
});

module.exports = Personal;
