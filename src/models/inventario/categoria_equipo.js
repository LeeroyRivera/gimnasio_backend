const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const CategoriaEquipo = sequelize.define('CategoriaEquipo', {
  nombre_categoria: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW 
  }
}, {
  tableName: 'categorias_equipo',
  timestamps: false
});

module.exports = CategoriaEquipo;