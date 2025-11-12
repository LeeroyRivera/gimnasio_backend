const express = require("express");
const router = express.Router();
const controladorUsuario = require("../../controllers/usuarios/controladorUsuario");
const { body, query, validationResult } = require("express-validator");
const passport = require("passport");

// Middleware genérico para manejar validaciones
function manejarValidaciones(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
}

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones de gestión de usuarios del sistema
 */
/**
 * @swagger
 * /usuario/listar:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 */
router.get(
  "/listar",
  passport.authenticate("jwt", { session: false }),
  controladorUsuario.listarTodosUsuarios
);

/**
 * @swagger
 * /usuario/activo:
 *   get:
 *     summary: Listar usuarios activos
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios activos
 */
router.get(
  "/activo",
  passport.authenticate("jwt", { session: false }),
  controladorUsuario.obtenerUsuariosActivos
);

/**
 * @swagger
 * /usuario/registro:
 *   post:
 *     summary: Registrar un nuevo usuario (y su información de cliente asociada)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_rol, email, username, password, cliente]
 *             properties:
 *               id_rol:
 *                 type: integer
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               telefono:
 *                 type: string
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *               genero:
 *                 type: string
 *                 enum: [M, F, Otros]
 *               cliente:
 *                 type: object
 *                 description: Datos adicionales del perfil cliente
 *                 properties:
 *                   nombre: { type: string }
 *                   apellido: { type: string }
 *                   tipo_sangre: { type: string }
 *                   peso_actual: { type: number, format: float }
 *                   altura: { type: number, format: float }
 *                   condiciones_medicas: { type: string }
 *                   contacto_emergencia: { type: string }
 *                   telefono_emergencia: { type: string }
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error de validación en los datos enviados
 */
router.post(
  "/registro",
  [
    body("id_rol")
      .isInt()
      .withMessage("El ID del rol debe ser un número entero"),
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
    body("cliente.nombre")
      .notEmpty()
      .withMessage("El nombre del cliente es obligatorio"),
    body("cliente.apellido")
      .notEmpty()
      .withMessage("El apellido del cliente es obligatorio"),
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

/**
 * @swagger
 * /usuario/actualizar:
 *   put:
 *     summary: Actualiza parcialmente un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_rol: { type: integer }
 *               email: { type: string, format: email }
 *               username: { type: string }
 *               password: { type: string, format: password }
 *               telefono: { type: string }
 *               fecha_nacimiento: { type: string, format: date }
 *               genero: { type: string, enum: [M, F, Otros] }
 *               foto_perfil: { type: string }
 *               estado: { type: string, enum: [activo, inactivo, suspendido] }
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
  "/actualizar",
  passport.authenticate("jwt", { session: false }),
  [
    query("id").isInt().withMessage("El ID (query) debe ser un número entero"),
    body("id_rol")
      .optional()
      .isInt()
      .withMessage("El ID del rol debe ser un número entero"),
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

/**
 * @swagger
 * /usuario/eliminar:
 *   delete:
 *     summary: Elimina (lógico) un usuario del sistema
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 */
router.delete(
  "/eliminar",
  passport.authenticate("jwt", { session: false }),
  [query("id").isInt().withMessage("El ID debe ser un número entero")],
  manejarValidaciones,
  controladorUsuario.eliminarUsuario
);

module.exports = router;
