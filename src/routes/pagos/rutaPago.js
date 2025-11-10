const express = require('express');
const routes = express.Router();
const controladorPago = require('../../controladores/pagos/controladorPago');
const { body, query } = require("express-validator");
const modeloPago = require("../../models/pagos/pago");

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Registro y control de pagos de membresías
 */

/**
 * @swagger
 * /pagos/pagos/listar:
 *   get:
 *     summary: Obtiene la lista de pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida con éxito
 */
routes.get('/listar', controladorPago.listar);

/**
 * @swagger
 * /pagos/pagos/guardar:
 *   post:
 *     summary: Guarda un pago y aplica descuento si existe en la membresía
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_membresia:
 *                 type: integer
 *               metodo_pago:
 *                 type: string
 *                 enum: ['Efectivo','Transferencia','Tarjeta']
 *               referencia:
 *                 type: string
 *               notas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pago guardado correctamente
 *       400:
 *         description: Error en los datos enviados
 */
routes.post('/guardar',
  body("id_membresia").notEmpty().isInt().withMessage("Debe enviar el id de la membresía"),
  body("metodo_pago").isIn(['Efectivo','Transferencia','Tarjeta']).withMessage("Método de pago inválido"),
  controladorPago.guardar
);

/**
 * @swagger
 * /pagos/pagos/editar:
 *   put:
 *     summary: Edita un pago
 *     tags: [Pagos]
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
 *               metodo_pago:
 *                 type: string
 *               notas:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pago actualizado correctamente
 */
routes.put('/editar',
  query("id").isInt().withMessage("El id debe ser entero"),
  query("id").custom(async (value) => {
    const buscar = await modeloPago.findOne({ where: { id: value } });
    if (!buscar) throw new Error("El pago no existe");
  }),
  body("metodo_pago").optional().isIn(['Efectivo','Transferencia','Tarjeta']).withMessage("Método inválido"),
  controladorPago.editar
);

/**
 * @swagger
 * /pagos/pagos/eliminar:
 *   delete:
 *     summary: Elimina un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Pago eliminado correctamente
 */
routes.delete('/eliminar',
  query("id").isInt().withMessage("El id debe ser entero"),
  controladorPago.eliminar
);

/**
 * @swagger
 * /pagos/pagos/comprobante:
 *   post:
 *     summary: Sube un comprobante de pago en formato imagen
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago o membresía relacionada
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comprobante:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen del comprobante
 *     responses:
 *       200:
 *         description: Imagen guardada correctamente
 */

routes.post('/comprobante', controladorPago.validarImagenPago, controladorPago.GuardarComprobante);

module.exports = routes;
