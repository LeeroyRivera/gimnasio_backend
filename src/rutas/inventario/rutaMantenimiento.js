const express = require('express');
const routes = express.Router();
const controladorMantenimiento = require('../../controladores/inventario/controladorMantenimientos');
const { body, query } = require('express-validator');

/*routes.get('/listar', controladorEquipo.listar);
routes.post('/guardar', controladorEquipo.guardar);
routes.put('/editar', controladorEquipo.editar);
routes.delete('/eliminar', controladorEquipo.eliminar);*/
module.exports = routes;