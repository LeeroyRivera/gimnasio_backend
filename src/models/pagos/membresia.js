const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
//const Cliente = require('./cliente');
const PlanMembresia = require('./plan_membresia');
const moment = require('moment');

const Membresia = sequelize.define('Membresia', {
  /*id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id_cliente'
    }
  },*/
  id_plan: {
    type: DataTypes.INTEGER,
    references: {
      model: PlanMembresia,
      key: 'id'
    },
    allowNull: false
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Activa', 'Vencida', 'suspendida','Cancelada'),
    defaultValue: 'Activa',
    allowNull: false
  },
  monto_pagado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  descuento_aplicado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:ss')
  }
}, {
  tableName: 'membresias',
  timestamps: false
});

module.exports = Membresia;
