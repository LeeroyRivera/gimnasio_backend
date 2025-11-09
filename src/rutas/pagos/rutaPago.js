const express = require('express');
const routes = express.Router();
const controladorPago = require('../../controladores/pagos/controladorPago');
const { body, query } = require('express-validator');

routes.get('/listar', controladorPago.listar);
routes.post('/guardar', controladorPago.guardar);
routes.put('/editar', controladorPago.editar);
routes.delete('/eliminar', controladorPago.eliminar);
routes.post('/comprobante', controladorPago.validarImagenPago, controladorPago.GuardarComprobante);

module.exports = routes;
