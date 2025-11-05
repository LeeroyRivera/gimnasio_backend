const express = require('express');
const routes = express.Router();
const controladorMembresia = require('../../controladores/pagos/controladorMembresia');
const { body, query } = require('express-validator');

routes.get('/listar', controladorMembresia.listar);
routes.post('/guardar', controladorMembresia.guardar);
routes.put('/editar', controladorMembresia.editar);
routes.delete('/eliminar', controladorMembresia.eliminar);

module.exports = routes;
