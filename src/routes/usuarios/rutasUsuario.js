const express = require("express");
const router = express.Router();
const controladorUsuario = require("../../controllers/usuarios/controladorUsuario");
const { body, query } = require("express-validator");

router.get("/listar", controladorUsuario.listarTodosUsuarios);

router.get("/activo", controladorUsuario.obtenerUsuariosActivos);

router.post(
  "/registro",
  body("id_rol").isInt().withMessage("El ID del rol debe ser un número entero"),
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
  body("email").isEmail().withMessage("El email no es válido"),
  body("username")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),
  body("password_hash").notEmpty().withMessage("La contraseña es obligatoria"),
  body("telefono")
    .optional()
    .isNumeric()
    .withMessage("El teléfono debe ser numérico"),
  body("fecha_nacimiento")
    .optional()
    .isDate()
    .withMessage("La fecha de nacimiento no es válida"),
  body("genero")
    .optional()
    .isIn(["M", "F", "Otros"])
    .withMessage("El género no es válido"),

  body("cliente")
    .optional()
    .isObject()
    .withMessage("El cliente debe de ser un objeto"),
  body("cliente.tipo_sangre")
    .optional()
    .isString()
    .withMessage("El tipo de sangre debe ser una cadena de texto"),
  body("cliente.peso_actual")
    .optional()
    .isDecimal()
    .withMessage("El peso actual debe ser un número decimal"),
  body("cliente.altura")
    .optional()
    .isDecimal()
    .withMessage("La altura debe ser un número decimal"),
  body("cliente.condiciones_medicas")
    .optional()
    .isString()
    .withMessage("Las condiciones médicas deben ser una cadena de texto"),
  body("cliente.contacto_emergencia")
    .optional()
    .isString()
    .withMessage("El contacto de emergencia debe ser una cadena de texto"),
  body("cliente.telefono_emergencia")
    .optional()
    .isString()
    .withMessage("El teléfono de emergencia debe ser una cadena de texto"),
  controladorUsuario.guardarUsuario
);

router.put(
  "/actualizar",
  body("id_rol").isInt().withMessage("El ID del rol debe ser un número entero"),
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
  body("email").isEmail().withMessage("El email no es válido"),
  body("username")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),
  body("password_hash").notEmpty().withMessage("La contraseña es obligatoria"),
  body("telefono")
    .optional()
    .isNumeric()
    .withMessage("El teléfono debe ser numérico"),
  body("fecha_nacimiento")
    .optional()
    .isDate()
    .withMessage("La fecha de nacimiento no es válida"),
  body("genero")
    .optional()
    .isIn(["M", "F", "Otros"])
    .withMessage("El género no es válido"),
  body("foto_perfil")
    .optional()
    .isString()
    .withMessage("La foto de perfil debe ser una cadena de texto"),
  body("estado")
    .optional()
    .isIn(["activo", "inactivo", "suspendido"])
    .withMessage("El estado no es válido"),
  controladorUsuario.actualizarUsuario
);

router.delete(
  "/eliminar",
  query("id").isInt().withMessage("El ID debe ser un número entero"),
  controladorUsuario.eliminarUsuario
);

module.exports = router;
