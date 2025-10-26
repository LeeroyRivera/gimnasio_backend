const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const moment = require('moment');
const CategoriaEquipo = sequelize.define('CategoriaEquipo', {}, {
nombre_categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW //en caso de que dejes la fecha actual
    //defaultValue: moment().format('YYYY-MM-DD HH:mm:ss')
  }
}, {

  tableName: 'categorias_equipo',
  timestamps: false
});

module.exports = CategoriaEquipo;
