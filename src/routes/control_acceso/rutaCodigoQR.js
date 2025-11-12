const express = require("express");
const router = express.Router();
const controlador = require("../../controllers/control_acceso/controladorCodigoQR");
const { body } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: CodigosQR
 *   description: Gestión de códigos QR de acceso
 */

/**
 * @swagger
 * /control-acceso/codigo-qr/listar:
 *   get:
 *     summary: Listar todos los códigos QR
 *     tags: [CodigosQR]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de códigos QR
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_codigo_qr:
 *                     type: integer
 *                   codigo_qr:
 *                     type: string
 *                   fecha_Generacion:
 *                     type: string
 *                     format: date-time
 *                   fecha_Expiracion:
 *                     type: string
 *                     format: date-time
 *                   estado:
 *                     type: boolean
 *                   tipo_codigo:
 *                     type: string
 *       500:
 *         description: Error al listar códigos QR
 */
router.get("/listar", controlador.listarTodos);

/**
 * @swagger
 * /control-acceso/codigo-qr/manual:
 *   post:
 *     summary: Generar un código QR de tipo manual
 *     tags: [CodigosQR]
 *     description: Crea un nuevo código QR manual y desactiva el último código activo (si existe) antes de crearlo.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [codigo_qr]
 *             properties:
 *               codigo_qr:
 *                 type: string
 *               horas_validez:
 *                 type: integer
 *                 description: Horas de validez del código (por defecto 24)
 *     responses:
 *       201:
 *         description: Código QR creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_codigo_qr:
 *                   type: integer
 *                 codigo_qr:
 *                   type: string
 *                 fecha_Generacion:
 *                   type: string
 *                   format: date-time
 *                 fecha_Expiracion:
 *                   type: string
 *                   format: date-time
 *                 estado:
 *                   type: boolean
 *                 tipo_codigo:
 *                   type: string
 *       400:
 *         description: Error de validación de entrada
 *       409:
 *         description: Conflicto, el código QR ya existe
 *       500:
 *         description: Error al generar código QR manual
 */
router.post(
  "/manual",
  body("codigo_qr")
    .notEmpty()
    .withMessage("El campo 'codigo_qr' es obligatorio"),
  controlador.generarManual
);

module.exports = router;
