const express = require('express');
const routes = express.Router();
const controladorMantenimiento = require('../../controladores/inventario/controladorMantenimientos');
const { body, query } = require('express-validator');
const modeloEquipo = require('../../models/inventario/equipo');
const modeloMantenimiento = require('../../models/inventario/mantenimiento');

/**
 * @swagger
 * tags:
 *   name: Mantenimientos
 *   description: Registro y control de mantenimientos aplicados a los equipos
 */

/**
 * @swagger
 * /inventario/mantenimiento/listar:
 *   get:
 *     summary: Obtiene la lista de mantenimientos
 *     tags: [Mantenimientos]
 *     responses:
 *       200:
 *         description: Lista de mantenimientos obtenida exitosamente
 */
routes.get('/listar', controladorMantenimiento.listar);

/**
 * @swagger
 * /inventario/mantenimiento/guardar:
 *   post:
 *     summary: Registra un mantenimiento
 *     tags: [Mantenimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_mantenimiento:
 *                 type: string
 *                 enum: ['preventivo', 'correctivo']
 *               descripcion_trabajo:
 *                 type: string
 *               tecnico_responsable:
 *                 type: string
 *               costo:
 *                 type: number
 *               id_equipo:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Mantenimiento registrado correctamente
 */
routes.post('/guardar',
  body("tipo_mantenimiento").isIn(['preventivo', 'correctivo']).withMessage("El tipo debe ser preventivo o correctivo"),
  body("descripcion_trabajo").notEmpty().withMessage("La descripción es obligatoria"),
  body("tecnico_responsable").notEmpty().withMessage("El técnico es obligatorio"),
  body("costo").isDecimal().withMessage("El costo debe ser numérico decimal"),

  body("id_equipo")
    .notEmpty().withMessage("Debe enviar el ID del equipo")
    .isInt().withMessage("ID debe ser entero")
    .custom(async (value) => {
      const equipo = await modeloEquipo.findOne({ where: { id: value } });
      if (!equipo) throw new Error("El equipo no existe");
    }),

  controladorMantenimiento.guardar
);

/**
 * @swagger
 * /inventario/mantenimiento/editar:
 *   put:
 *     summary: Edita un mantenimiento
 *     tags: [Mantenimientos]
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
 *               estado:
 *                 type: string
 *                 enum: ['Pendiente', 'En progreso', 'Completado', 'Cancelado']
 *     responses:
 *       200:
 *         description: Mantenimiento actualizado correctamente
 */
routes.put('/editar',
  query("id")
    .notEmpty().withMessage("Debe enviar un ID")
    .isInt().withMessage("ID debe ser entero")
    .custom(async (value) => {
      const buscar = await modeloMantenimiento.findOne({ where: { id: value } });
      if (!buscar) throw new Error("El mantenimiento no existe");
    }),

  body("estado").optional()
    .isIn(['Pendiente','En progreso','Completado','Cancelado'])
    .withMessage("Estado inválido"),

  controladorMantenimiento.editar
);

/**
 * @swagger
 * /inventario/mantenimiento/eliminar:
 *   delete:
 *     summary: Elimina un mantenimiento
 *     tags: [Mantenimientos]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mantenimiento eliminado correctamente
 */
routes.delete('/eliminar',
  query("id")
    .isInt().withMessage("ID debe ser entero"),
  controladorMantenimiento.eliminar
);

module.exports = routes;




/*const express = require('express');
const routes = express.Router();
const controladorMantenimiento = require('../../controladores/inventario/controladorMantenimientos');
const { body, query } = require('express-validator');

routes.get('/listar', controladorMantenimiento.listar);
routes.post('/guardar', controladorMantenimiento.guardar);
routes.put('/editar', controladorMantenimiento.editar);
routes.delete('/eliminar', controladorMantenimiento.eliminar);
module.exports = routes;*/