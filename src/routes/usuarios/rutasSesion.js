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
module.exports = router;
