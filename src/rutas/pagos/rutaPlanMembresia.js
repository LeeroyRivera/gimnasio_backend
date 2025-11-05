const express = require('express');
const routes = express.Router();
const controladorPlan = require('../../controladores/pagos/controladorPlanMembresia');
const { body, query } = require('express-validator');

routes.get('/listar', controladorPlan.listar);
routes.post('/guardar', controladorPlan.guardar);
routes.put('/editar', controladorPlan.editar);
routes.delete('/eliminar', controladorPlan.eliminar);

module.exports = routes;