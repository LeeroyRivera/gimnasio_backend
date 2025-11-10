const express = require('express');
const routes = express.Router();
const controladorCategoria = require('../../controladores/inventario/controladorCategorias');
const { body, query } = require('express-validator');
const modeloCategoria = require('../../models/inventario/categoria_equipo');

/**
 * @swagger
 * tags:
 *   name: Categorías de Equipos
 *   description: Gestión de categorías para inventario de equipos
 */

/**
 * @swagger
 * /inventario/categoria/listar:
 *   get:
 *     summary: Obtiene la lista de categorías
 *     tags: [Categorías de Equipos]
 *     responses:
 *       200:
 *         description: Lista obtenida exitosamente
 */
routes.get('/listar', controladorCategoria.listar);

/**
 * @swagger
 * /inventario/categoria/guardar:
 *   post:
 *     summary: Guarda una nueva categoría
 *     tags: [Categorías de Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_categoria:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría registrada correctamente
 */
routes.post('/guardar',
  body("nombre_categoria")
    .notEmpty().withMessage("El nombre de la categoría es obligatorio")
    .isLength({ max: 100 }).withMessage("Máximo 100 caracteres"),

  body("descripcion")
    .notEmpty().withMessage("La descripción es obligatoria"),

  controladorCategoria.guardar
);

/**
 * @swagger
 * /inventario/categoria/editar:
 *   put:
 *     summary: Edita una categoría
 *     tags: [Categorías de Equipos]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_categoria:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 */
routes.put('/editar',
  query("id")
    .notEmpty().withMessage("Debe enviar el ID")
    .isInt().withMessage("El ID debe ser entero")
    .custom(async (value) => {
      const buscar = await modeloCategoria.findOne({ where: { id: value } });
      if (!buscar) throw new Error("La categoría no existe");
    }),

  body("nombre_categoria")
    .optional()
    .isLength({ max: 100 }).withMessage("Máximo 100 caracteres"),

  controladorCategoria.editar
);

/**
 * @swagger
 * /inventario/categoria/eliminar:
 *   delete:
 *     summary: Elimina una categoría
 *     tags: [Categorías de Equipos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 */
routes.delete('/eliminar',
  query("id")
    .isInt().withMessage("El ID debe ser entero"),
  controladorCategoria.eliminar
);

module.exports = routes;


/*const express = require('express');
const routes = express.Router();
const controladorCategoria = require('../../controladores/inventario/controladorCategorias');
const { body, query } = require('express-validator');


routes.get('/listar', controladorCategoria.listar);
routes.post('/guardar',controladorCategoria.guardar);
routes.put('/editar',controladorCategoria.editar);
routes.delete('/eliminar', controladorCategoria.eliminar);

module.exports = routes;*/