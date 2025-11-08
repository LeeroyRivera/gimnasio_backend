const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Membresia = require('./membresia');
//const Usuario = require('./usuario');
const moment = require('moment');

const Pago = sequelize.define('Pago', {
  id_membresia: {
    type: DataTypes.INTEGER,
    references: {
      model: Membresia,
      key: 'id'
    },
    allowNull: false
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metodo_pago: {
    type: DataTypes.ENUM('Efectivo', 'Transferencia', 'Tarjeta'),
    allowNull: false
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW 
  },
  comprobante: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  referencia: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  /*procesado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },*/
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  detalle_descuento: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'pagos',
  timestamps: false
});


module.exports = Pago;
