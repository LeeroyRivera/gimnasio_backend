const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const categoriaEquipo = require('./categoria_equipo');
const moment = require('moment');

const Equipo = sequelize.define('Equipo', {}, {
  nombre_equipo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  modelo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  numero_serie: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha_compra: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD')
  },
  costo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM ('Excelente', 'Bueno', 'Regular', 'En mantenimiento', 'Fuera de servicio'),
    defaultValue: 'Bueno',
    allowNull: false
  },
  foto: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: categoriaEquipo,
      key: 'id'
    }
  }

}, {
  tableName: 'equipos',
  timestamps: false
});

module.exports = Equipo;
