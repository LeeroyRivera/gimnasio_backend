const express = require("express");
const router = express.Router();
const controlador = require("../../controllers/control_acceso/controladorAsistencia");
const { body, param, query } = require("express-validator");
const passport = require("passport");

/**
 * @swagger
 * tags:
 *   name: Asistencias
 *   description: Gestión de asistencias de usuarios al gimnasio
 */

/**
 * @swagger
 * /control-acceso/asistencia/qr:
 *   post:
 *     summary: Registrar asistencia mediante escaneo de código QR
 *     description: Si es la primera vez del día registra entrada. Si ya tiene entrada sin salida, registra salida y calcula duración en minutos.
 *     tags: [Asistencias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_usuario, codigo_qr]
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario que escanea el QR
 *               codigo_qr:
 *                 type: string
 *                 description: Código QR escaneado
 *     responses:
 *       201:
 *         description: Entrada registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 asistencia:
 *                   type: object
 *       200:
 *         description: Salida registrada exitosamente
 *       400:
 *         description: Error de validación
 *       403:
 *         description: Código QR expirado
 *       404:
 *         description: Usuario o código QR no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/qr",
  [
    body("id_usuario")
      .notEmpty()
      .withMessage("El campo 'id_usuario' es obligatorio")
      .isInt()
      .withMessage("'id_usuario' debe ser un número entero"),
    body("codigo_qr")
      .notEmpty()
      .withMessage("El campo 'codigo_qr' es obligatorio"),
  ],
  controlador.registrarAsistenciaQR
);

/**
 * @swagger
 * /control-acceso/asistencia/manual:
 *   post:
 *     summary: Registrar asistencia manual (sin QR)
 *     description: Permite registrar entrada o salida manualmente. Calcula duración en minutos al registrar salida.
 *     tags: [Asistencias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_usuario, tipo]
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario
 *               tipo:
 *                 type: string
 *                 enum: [entrada, salida]
 *                 description: Tipo de registro (entrada o salida)
 *               notas:
 *                 type: string
 *                 description: Notas adicionales (opcional)
 *     responses:
 *       201:
 *         description: Entrada registrada exitosamente
 *       200:
 *         description: Salida registrada exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado o sin entrada activa
 *       409:
 *         description: El usuario ya tiene entrada registrada
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/manual",
  [
    body("id_usuario")
      .notEmpty()
      .withMessage("El campo 'id_usuario' es obligatorio")
      .isInt()
      .withMessage("'id_usuario' debe ser un número entero"),
    body("tipo")
      .notEmpty()
      .withMessage("El campo 'tipo' es obligatorio")
      .isIn(["entrada", "salida"])
      .withMessage("'tipo' debe ser 'entrada' o 'salida'"),
  ],
  controlador.registrarAsistenciaManual
);

/**
 * @swagger
 * /control-acceso/asistencia/usuario/{id_usuario}:
 *   get:
 *     summary: Listar asistencias de un usuario específico
 *     tags: [Asistencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final (YYYY-MM-DD)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Cantidad de registros a devolver
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Desplazamiento para paginación
 *     responses:
 *       200:
 *         description: Lista de asistencias del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 asistencias:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/usuario/:id_usuario",
  [
    param("id_usuario")
      .isInt()
      .withMessage("'id_usuario' debe ser un número entero"),
    query("desde")
      .optional()
      .isDate()
      .withMessage("'desde' debe ser una fecha válida"),
    query("hasta")
      .optional()
      .isDate()
      .withMessage("'hasta' debe ser una fecha válida"),
    query("limit")
      .optional()
      .isInt()
      .withMessage("'limit' debe ser un número entero"),
    query("offset")
      .optional()
      .isInt()
      .withMessage("'offset' debe ser un número entero"),
  ],
  controlador.listarAsistenciasUsuario
);

/**
 * @swagger
 * /control-acceso/asistencia/por-dia:
 *   get:
 *     summary: Listar asistencias agrupadas por día
 *     description: Muestra total de asistencias y usuarios únicos por cada día
 *     tags: [Asistencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Asistencias agrupadas por día
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_dias:
 *                   type: integer
 *                 asistencias_por_dia:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fecha:
 *                         type: string
 *                         format: date
 *                       total_asistencias:
 *                         type: integer
 *                       usuarios_unicos:
 *                         type: integer
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/por-dia",
  [
    query("desde")
      .optional()
      .isDate()
      .withMessage("'desde' debe ser una fecha válida"),
    query("hasta")
      .optional()
      .isDate()
      .withMessage("'hasta' debe ser una fecha válida"),
  ],
  controlador.listarAsistenciasPorDia
);

// Asistencias del usuario autenticado
router.get(
  "/mi-asistencia",
  passport.authenticate("jwt", { session: false }),
  controlador.listarAsistenciasUsuarioAutenticado
);

module.exports = router;
