const express = require("express");
const router = express.Router();
const controladorSesion = require("../../controllers/usuarios/controladorSesion");
const { query } = require("express-validator");

// GET /api/sesiones? id_usuario - Listar sesiones por usuario
/**
 * @swagger
 * tags:
 *   name: Sesiones
 *   description: Consulta de sesiones de usuario
 */
/**
 * @swagger
 * /sesion/sesiones:
 *   get:
 *     summary: Listar sesiones por usuario
 *     tags: [Sesiones]
 *     parameters:
 *       - in: query
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de sesiones obtenida correctamente
 */
router.get(
  "/sesiones",
  query("id_usuario")
    .isInt()
    .withMessage("El ID de usuario debe ser un número entero"),
  controladorSesion.listarSesionesPorUsuario
);

/**
 * @swagger
 * /sesion/sesiones-por-dia:
 *   get:
 *     summary: Lista sesiones agrupadas por día con conteo total por día
 *     tags: [Sesiones]
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial (YYYY-MM-DD). Opcional.
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final (YYYY-MM-DD). Opcional.
 *     responses:
 *       200:
 *         description: Lista con objetos { dia, total }
 */
router.get(
  "/sesiones-por-dia",
  // Validaciones opcionales de formato fecha
  query("desde")
    .optional()
    .isISO8601()
    .withMessage("'desde' debe ser fecha válida"),
  query("hasta")
    .optional()
    .isISO8601()
    .withMessage("'hasta' debe ser fecha válida"),
  controladorSesion.listarSesionesPorDia
);
module.exports = router;
