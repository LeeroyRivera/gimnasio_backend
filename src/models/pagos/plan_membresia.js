const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PlanMembresia = sequelize.define('PlanMembresia', {
  id_plan: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_plan: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  duracion_dias: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  acceso_gimnasio: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  acceso_entrenador: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  acceso_asistente_virtual: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  estado: {
    type: DataTypes.ENUM('Activa', 'Inactiva'),
    allowNull: false,
    defaultValue: 'Activa'
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:ss')
  }
}, {
  tableName: 'planes_membresia',
  timestamps: false
});

module.exports = PlanMembresia;
