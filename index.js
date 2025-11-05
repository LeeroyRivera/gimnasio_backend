const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const db = require('./src/config/database');

// Importar modelos de usuarios
require('./src/models/usuarios/rol');
require('./src/models/usuarios/usuario');
require('./src/models/usuarios/usuario_rol');
require('./src/models/usuarios/cliente');
require('./src/models/usuarios/personal');
require('./src/models/usuarios/sesion');

// Importar modelos de pagos
require('./src/models/pagos/plan_membresia');
require('./src/models/pagos/membresia');
require('./src/models/pagos/pago');

// Importar modelos de control de acceso
require('./src/models/control_acceso/asistencia');
require('./src/models/control_acceso/codigo_qr_acceso');

// Importar modelos de inventario

const modeloCategoriaEquipo = require('./src/models/inventario/categoria_equipo');
const modeloEquipo = require('./src/models/inventario/equipo');
const modeloMantenimiento = require('./src/models/inventario/mantenimiento');

// Importar modelos de asistente virtual
require('./src/models/asistente_virtual/categoria_ejercicio');
require('./src/models/asistente_virtual/ejercicio');
require('./src/models/asistente_virtual/rutina');
require('./src/models/asistente_virtual/rutina_ejercicio');
require('./src/models/asistente_virtual/progreso_cliente');


db.authenticate().then(async (data) => {

  console.log('Database authenticated successfully.');
  modeloEquipo.belongsTo(modeloCategoriaEquipo, {
    foreignKey: 'id_categoria' 
  });
  modeloCategoriaEquipo.hasMany(modeloEquipo, {
    foreignKey: 'id_categoria' 
  });
  modeloMantenimiento.belongsTo(modeloEquipo,{
    foreignKey: 'id_equipo' 
  });
  modeloEquipo.hasMany(modeloMantenimiento, {
    foreignKey: 'id_equipo' 
  });

  await modeloCategoriaEquipo.sync().then((data) => {
    console.log('tabla Categoria_Equipo creada!');
  }).catch((error) => {
    console.error('Error al crear la tabla Categoria_Equipo:', + error);
  });

  await modeloEquipo.sync().then((data) => {
    console.log('tabla Equipo creada!');
  }).catch((error) => {
    console.error('Error al crear la tabla Equipo:', + error);
  });

  await modeloMantenimiento.sync().then((data) => {
    console.log('tabla Equipo creada!');
  }).catch((error) => {
    console.error('Error al crear la tabla Equipo:', + error);
  });

})

const app = express();

db.sync({ alter: true }).then(() => {
  console.log('Database connected successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('port', process.env.PORT || 3000);

// Rutas
app.use('/api/inventario/categoria', require('./src/rutas/inventario/rutaCategoria'));
app.use('/api/inventario/equipo', require('./src/rutas/inventario/rutaEquipo'));
app.use('/api/inventario/mantenimiento', require('./src/rutas/inventario/rutaMantenimiento'));
app.use('/api/imagenes', 
  express.static(path.join(__dirname, 'public/img')));

app.listen(app.get('port'), () => {
  console.log(`Server listening on http://localhost:${app.get('port')}`);
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Gym API' });
});

module.exports = app;