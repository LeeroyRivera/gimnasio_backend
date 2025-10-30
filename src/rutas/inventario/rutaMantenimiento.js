const express = require('express');
const routes = express.Router();
const controladorMantenimiento = require('../../controladores/inventario/controladorMantenimientos');
const { body, query } = require('express-validator');

routes.get('/listar', controladorMantenimiento.listar);
routes.post('/guardar', controladorMantenimiento.guardar);
routes.put('/editar', controladorMantenimiento.editar);
routes.delete('/eliminar', controladorMantenimiento.eliminar);
module.exports = routes;