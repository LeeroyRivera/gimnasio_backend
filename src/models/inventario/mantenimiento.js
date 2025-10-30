const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const moment = require('moment');
const equipo = require('./equipo');

const Mantenimiento = sequelize.define('Mantenimiento', {}, {

  tipo_mantenimiento: {
    type: DataTypes.ENUM('preventivo', 'correctivo'),
    allowNull: false  
  },
  fecha_programada: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD')
  },
  fecha_realizada: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: moment().format('YYYY-MM-DD')
  },
  descripcion_trabajo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tecnico_responsable: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  costo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'En progreso', 'Completado', 'Cancelado'),
    defaultValue: 'Pendiente',
    allowNull: false
  },
  proximo_mantenimiento: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: moment().format('YYYY-MM-DD')
  },
  notas:{
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: equipo,
      key: 'id'
    }
  }
}, {
  tableName: 'mantenimientos',
  timestamps: false
});

module.exports = Mantenimiento;
