const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const path = require("path");


const db = require('./src/config/database');

// Importar modelos de usuarios
require('./src/models/usuarios/rol');
require('./src/models/usuarios/usuario');
require('./src/models/usuarios/usuario_rol');
require('./src/models/usuarios/cliente');
require('./src/models/usuarios/personal');
require('./src/models/usuarios/sesion');

// Importar modelos de pagos
const modeloPlanMembresia = require('./src/models/pagos/plan_membresia');
const modeloMembresia = require('./src/models/pagos/membresia');
const modeloPago = require('./src/models/pagos/pago');


// Importar modelos de control de acceso
require('./src/models/control_acceso/asistencia');
require('./src/models/control_acceso/codigo_qr_acceso');

// Importar modelos de inventario
require('./src/models/inventario/categoria_equipo');
require('./src/models/inventario/equipo');
require('./src/models/inventario/mantenimiento');

// Importar modelos de asistente virtual
require('./src/models/asistente_virtual/categoria_ejercicio');
require('./src/models/asistente_virtual/ejercicio');
require('./src/models/asistente_virtual/rutina');
require('./src/models/asistente_virtual/rutina_ejercicio');
require('./src/models/asistente_virtual/progreso_cliente');

db.authenticate().then(async (data) => {

  // Relaciones pagos

  modeloMembresia.belongsTo(modeloPlanMembresia, {
    foreignKey: 'id_plan', 
    as: 'plan'
  });

  modeloPlanMembresia.hasMany(modeloMembresia, {
    foreignKey: 'id_plan', 
     as: 'membresias'
  });

  modeloPago.belongsTo(modeloMembresia, {
    foreignKey: 'id_membresia' 
  });

  modeloMembresia.hasMany(modeloPago, {
    foreignKey: 'id_membresia' 
  });
  /*
  modeloMembresia.belongsTo(modeloPlanMembresia);
  modeloPlanMembresia.hasMany(modeloMembresia);
  modeloPago.belongsTo(modeloMembresia);
  modeloMembresia.hasMany(modeloPago);*/

  await modeloPlanMembresia.sync().then((data) => {
    console.log('tabla planes_membresia creada!');
  }).catch((error) => {
    console.error('Error al crear la tabla Categoria_Equipo:', + error);
  });


  await modeloPago.sync().then((data) => {
    console.log('tabla pagos creada!');
  }).catch((error) => {
    console.error('Error al crear la tabla Equipo:', + error);
  });

  await modeloMembresia.sync().then((data) => {
    console.log('tabla membresias creada!');
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
app.use('/api/pagos/planes', require('./src/rutas/pagos/rutaPlanMembresia'));
app.use('/api/pagos/membresias', require('./src/rutas/pagos/rutaMembresia'));
app.use('/api/pagos/pagos', require('./src/rutas/pagos/rutaPago'));

app.use('/api/imagenes',
  express.static(path.join(__dirname, 'public/img'))
);
app.listen(app.get('port'), () => {
  console.log(`Server listening on http://localhost:${app.get('port')}`);
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Gym API' });
});

module.exports = app;