const express = require('express');
const routes = express.Router();
const controladorPlan = require('../../controladores/pagos/controladorPlanMembresia');
const { body, query } = require('express-validator');
const modeloPlan = require("../../models/pagos/plan_membresia");

/**
 * @swagger
 * tags:
 *   name: PlanesMembresia
 *   description: Operaciones relacionadas con los planes de membresía del gimnasio
 */

/**
 * @swagger
 * /pagos/planes/listar:
 *   get:
 *     summary: Obtiene la lista de planes de membresía
 *     tags: [PlanesMembresia]
 *     responses:
 *       200:
 *         description: Lista de planes obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del plan
 *                   nombre_plan:
 *                     type: string
 *                     description: Nombre del plan
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del plan
 *                   duracion_dias:
 *                     type: integer
 *                     description: Duración del plan en días
 *                   acceso_gimnasio:
 *                     type: boolean
 *                     description: Si tiene acceso a gimnasio
 *                   acceso_entrenador:
 *                     type: boolean
 *                     description: Si incluye entrenador
 *                   estado:
 *                     type: string
 *                     enum: ['Activa', 'Inactiva']
 *                     description: Estado del plan
 *                   fecha_creacion:
 *                     type: string
 *                     format: date
 *                     description: Fecha de creación del registro
 */
routes.get('/listar', controladorPlan.listar);

/**
 * @swagger
 * /pagos/planes/guardar:
 *   post:
 *     summary: Guarda un nuevo plan de membresía
 *     tags: [PlanesMembresia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_plan:
 *                 type: string
 *                 description: Nombre del plan
 *               descripcion:
 *                 type: string
 *                 description: Descripción del plan
 *               duracion_dias:
 *                 type: integer
 *                 description: Cantidad de días del plan
 *               acceso_gimnasio:
 *                 type: boolean
 *                 description: Acceso al gimnasio
 *               acceso_entrenador:
 *                 type: boolean
 *                 description: Acceso a entrenador
 *               estado:
 *                 type: string
 *                 enum: ['Activa', 'Inactiva']
 *                 description: Estado del plan
 *     responses:
 *       200:
 *         description: Plan guardado exitosamente
 *       400:
 *         description: Errores en la petición
 */
routes.post('/guardar',
  body("nombre_plan").notEmpty().isLength({ max: 50 }).withMessage("El nombre del plan es obligatorio y debe tener máximo 50 caracteres"),
  body("duracion_dias").notEmpty().isInt().withMessage("Debe enviar la duración del plan en días"),
  body("estado").optional().isIn(['Activa', 'Inactiva']).withMessage("Solo se permite Activo o Inactivo"),

  controladorPlan.guardar
);

/**
 * @swagger
 * /pagos/planes/editar:
 *   put:
 *     summary: Edita un plan existente de membresía
 *     tags: [PlanesMembresia]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del plan a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_plan:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               duracion_dias:
 *                 type: integer
 *               acceso_gimnasio:
 *                 type: boolean
 *               acceso_entrenador:
 *                 type: boolean
 *               estado:
 *                 type: string
 *                 enum: ['Activa', 'Inactiva']
 *     responses:
 *       200:
 *         description: Plan actualizado correctamente
 *       400:
 *         description: Errores en la petición
 */
routes.put('/editar',
  query("id").isInt().withMessage("El id debe ser un entero"),
  query("id").custom(async(value) => {
    const buscar = await modeloPlan.findOne({ where: { id: value }});
    if (!buscar) throw new Error("El id del plan no existe");
  }),

  body("nombre_plan").optional().isLength({ max: 100 }).withMessage("Máximo 100 caracteres en el nombre del plan"),
  body("duracion_dias").optional().isInt().withMessage("Debe enviar la duración en días"),
  body("estado").optional().isIn(['Activa', 'Inactiva']).withMessage("Solo se permite Activo o Inactivo"),

  controladorPlan.editar
);

/**
 * @swagger
 * /pagos/planes/eliminar:
 *   delete:
 *     summary: Elimina un plan de membresía
 *     tags: [PlanesMembresia]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan eliminado correctamente
 *       400:
 *         description: Errores en la petición
 */
routes.delete('/eliminar',
  query("id").isInt().withMessage("El id debe ser entero"),
  query("id").custom(async(value) => {
    const buscar = await modeloPlan.findOne({ where: { id: value }});
    if (!buscar) throw new Error("El id del plan no existe");
  }),

  controladorPlan.eliminar
);

module.exports = routes;



/*const express = require('express');
const routes = express.Router();
const controladorPlan = require('../../controladores/pagos/controladorPlanMembresia');
const { body, query } = require('express-validator');

routes.get('/listar', controladorPlan.listar);
routes.post('/guardar', controladorPlan.guardar);
routes.put('/editar', controladorPlan.editar);
routes.delete('/eliminar', controladorPlan.eliminar);

module.exports = routes;*/