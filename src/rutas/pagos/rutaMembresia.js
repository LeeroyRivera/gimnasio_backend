const express = require('express');
const routes = express.Router();
const controladorMembresia = require('../../controladores/pagos/controladorMembresia');
const { body, query } = require('express-validator');
const modeloMembresia = require("../../models/pagos/membresia");

/**
 * @swagger
 * tags:
 *   name: Membresias
 *   description: Operaciones relacionadas con las membresías del gimnasio
 */

/**
 * @swagger
 * /pagos/membresias/listar:
 *   get:
 *     summary: Obtiene la lista de membresías
 *     tags: [Membresias]
 *     responses:
 *       200:
 *         description: Lista obtenida con éxito
 */
routes.get('/listar', controladorMembresia.listar);

/**
 * @swagger
 * /pagos/membresias/guardar:
 *   post:
 *     summary: Guarda una membresía
 *     tags: [Membresias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_plan:
 *                 type: integer
 *               monto_pagado:
 *                 type: number
 *                 format: float
 *               descuento_aplicado:
 *                 type: number
 *                 format: float
 *               estado:
 *                 type: string
 *                 enum: ['Activa','Vencida','suspendida','Cancelada']
 *               notas:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membresía guardada exitosamente
 */
routes.post('/guardar',
  body("id_plan").notEmpty().isInt().withMessage("Debe especificar el plan"),
  body("monto_pagado").notEmpty().isDecimal().withMessage("Debe enviar el monto pagado"),
  body("estado").optional().isIn(['Activa','Vencida','suspendida','Cancelada']).withMessage("Estado no válido"),
  controladorMembresia.guardar
);

/**
 * @swagger
 * /pagos/membresias/editar:
 *   put:
 *     summary: Edita una membresía
 *     tags: [Membresias]
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
 *                 enum: ['Activa','Vencida','suspendida','Cancelada']
 *               notas:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membresía editada correctamente
 */
routes.put('/editar',
  query("id").isInt().withMessage("El id debe ser entero"),
  query("id").custom(async (value) => {
    const buscar = await modeloMembresia.findOne({ where: { id: value } });
    if (!buscar) throw new Error("La membresía no existe");
  }),

  body("estado").optional().isIn(['Activa','Vencida','suspendida','Cancelada']).withMessage("Estado inválido"),
  controladorMembresia.editar
);

/**
 * @swagger
 * /pagos/membresias/eliminar:
 *   delete:
 *     summary: Elimina una membresía
 *     tags: [Membresias]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Membresía eliminada correctamente
 */
routes.delete('/eliminar',
  query("id").isInt().withMessage("El id debe ser entero"),
  controladorMembresia.eliminar
);

module.exports = routes;
