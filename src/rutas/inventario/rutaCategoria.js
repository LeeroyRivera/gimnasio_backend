const express = require('express');
const routes = express.Router();
const controladorCategoria = require('../../controladores/inventario/controladorCategorias');
const { body, query } = require('express-validator');


routes.get('/listar', controladorCategoria.listar);
routes.post('/guardar',controladorCategoria.guardar);
routes.put('/editar',controladorCategoria.editar);
routes.delete('/eliminar', controladorCategoria.eliminar);

module.exports = routes;