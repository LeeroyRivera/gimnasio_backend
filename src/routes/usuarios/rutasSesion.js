const express = require("express");
const router = express.Router();
const controladorSesion = require("../../controllers/usuarios/controladorSesion");
const { query } = require("express-validator");

// GET /api/sesiones? id_usuario - Listar sesiones por usuario
router.get(
  "/sesiones",
  query("id_usuario")
    .isInt()
    .withMessage("El ID de usuario debe ser un número entero"),
  controladorSesion.listarSesionesPorUsuario
);
module.exports = router;
