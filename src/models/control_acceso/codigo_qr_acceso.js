const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const CodigoQrAcceso = sequelize.define('CodigoQrAcceso', {}, {
  tableName: 'codigos_qr_acceso',
  timestamps: false
});

module.exports = CodigoQrAcceso;
