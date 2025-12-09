const express = require("express");
const router = express.Router();
const {
  obtenerResumenHoy,
} = require("../../controllers/dashboard/controladorDashboardAdmin");
const { autenticacionRol } = require("../../middleware/autenticacionRol");

// Ruta protegida solo para admin: /api/dashboard/admin/hoy
router.get("/admin/hoy", autenticacionRol("admin"), obtenerResumenHoy);

module.exports = router;
