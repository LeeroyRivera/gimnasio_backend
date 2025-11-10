const express = require("express");
const router = express.Router();
const controladorCliente = require("../../controllers/usuarios/controladorCliente");
const { query, body } = require("express-validator");

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
