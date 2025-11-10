const express = require("express");
const router = express.Router();
const controladorUsuario = require("../../controllers/usuarios/controladorUsuario");
const { body, query, validationResult } = require("express-validator");

// Middleware genérico para manejar validaciones
function manejarValidaciones(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
}

router.get("/listar", controladorUsuario.listarTodosUsuarios);

router.get("/activo", controladorUsuario.obtenerUsuariosActivos);

router.post(
  "/registro",
  [
    body("id_rol")
      .isInt()
      .withMessage("El ID del rol debe ser un número entero"),
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
    body("email").isEmail().withMessage("El email no es válido"),
    body("username")
      .notEmpty()
      .withMessage("El nombre de usuario es obligatorio"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),
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
      .exists()
      .withMessage("El objeto 'cliente' es obligatorio")
      .bail() // Detenerse si no existe
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
  ],
  manejarValidaciones,
  controladorUsuario.guardarUsuario
);

router.put(
  "/actualizar",
  [
    query("id").isInt().withMessage("El ID (query) debe ser un número entero"),
    body("id_rol")
      .optional()
      .isInt()
      .withMessage("El ID del rol debe ser un número entero"),
    body("nombre")
      .optional()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío"),
    body("apellido")
      .optional()
      .notEmpty()
      .withMessage("El apellido no puede estar vacío"),
    body("email").optional().isEmail().withMessage("El email no es válido"),
    body("username")
      .optional()
      .notEmpty()
      .withMessage("El nombre de usuario no puede estar vacío"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),
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
  ],
  manejarValidaciones,
  controladorUsuario.actualizarUsuario
);

router.delete(
  "/eliminar",
  [query("id").isInt().withMessage("El ID debe ser un número entero")],
  manejarValidaciones,
  controladorUsuario.eliminarUsuario
);

module.exports = router;
