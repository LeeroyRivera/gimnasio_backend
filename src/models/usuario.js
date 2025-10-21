// Modelo: Usuario
const { DataTypes, Model } = require('sequelize');
const db = require('../config/database');

const Usuario = db.define('Usuario' , { 
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usuarios', 
  timestamps: false
});

module.exports = Usuario;