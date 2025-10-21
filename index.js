const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./src/config/database');

// Modelos (Siempre importar los modelos para que Sequelize los registre)
const Usuario = require('./src/models/usuario');

const app = express();

db.sync({ alter: true }).then(() => {
  console.log('Base de datos sincronizada.');
}).catch((error) => {
  console.error('Error al sincronizar la base de datos:', error);
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Gym API' });
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;