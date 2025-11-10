const express = require("express");
const router = express.Router();
const controladorCliente = require("../../controllers/usuarios/controladorCliente");
const { query, body } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: ClientePerfil
 *   description: Operaciones sobre datos del perfil de cliente asociado al usuario
 */
/**
 * @swagger
 * /cliente/actualizar:
 *   put:
 *     summary: Actualiza parcialmente los datos del perfil cliente
 *     tags: [ClientePerfil]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario (cliente) a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_sangre: { type: string }
 *               peso_actual: { type: number, format: float }
 *               altura: { type: number, format: float }
 *               condiciones_medicas: { type: string }
 *               contacto_emergencia: { type: string }
 *               telefono_emergencia: { type: string }
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Cliente no encontrado
 */
router.put(
  "/actualizar",
  query("id").isInt().withMessage("El ID debe ser un número entero"),
  body("tipo_sangre")
    .optional()
    .isString()
    .withMessage("El tipo de sangre debe ser una cadena de texto"),
  body("peso_actual")
    .optional()
    .isDecimal()
    .withMessage("El peso actual debe ser un número decimal"),
  body("altura")
    .optional()
    .isDecimal()
    .withMessage("La altura debe ser un número decimal"),
  body("condiciones_medicas")
    .optional()
    .isString()
    .withMessage("Las condiciones médicas deben ser una cadena de texto"),
  body("contacto_emergencia")
    .optional()
    .isString()
    .withMessage("El contacto de emergencia debe ser una cadena de texto"),
  body("telefono_emergencia")
    .optional()
    .isString()
    .withMessage("El teléfono de emergencia debe ser una cadena de texto"),
  controladorCliente.actualizarCliente
);

module.exports = router;
