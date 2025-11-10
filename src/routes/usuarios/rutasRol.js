const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const controladorRol = require("../../controllers/usuarios/controladorRol");

// Validaciones para crear/actualizar rol
const validacionesRol = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del rol es requerido")
    .isLength({ max: 50 })
    .withMessage("El nombre no debe exceder 50 caracteres"),
  body("descripcion").optional(),
];

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Operaciones de administración de roles
 */
// GET /api/rol/listar - Listar todos los roles
/**
 * @swagger
 * /rol/listar:
 *   get:
 *     summary: Listar todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles obtenida correctamente
 */
router.get("/listar", controladorRol.listarTodosRoles);

// GET /api/rol/:id - Obtener rol por ID
/**
 * @swagger
 * /rol/rolId:
 *   get:
 *     summary: Obtener un rol por ID (query)
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol obtenido correctamente
 *       404:
 *         description: Rol no encontrado
 */
router.get(
  "/rolId",
  query("id").isInt().withMessage("El ID debe ser un número entero"),
  controladorRol.obtenerRolPorId
);

// POST /api/rol/guardar - Crear nuevo rol
/**
 * @swagger
 * /rol/guardar:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre: { type: string }
 *               descripcion: { type: string }
 *     responses:
 *       201:
 *         description: Rol creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/guardar", validacionesRol, controladorRol.guardarRol);

// PUT /api/rol/:id - Actualizar rol
/**
 * @swagger
 * /rol/actualizar:
 *   put:
 *     summary: Actualizar un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               descripcion: { type: string }
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Rol no encontrado
 */
router.put(
  "/actualizar",
  query("id").isInt().withMessage("El ID debe ser un número entero"),
  validacionesRol,
  controladorRol.actualizarRol
);

// DELETE /api/rol/:id - Eliminar rol
/**
 * @swagger
 * /rol/eliminar:
 *   delete:
 *     summary: Eliminar un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol eliminado correctamente
 *       404:
 *         description: Rol no encontrado
 */
router.delete(
  "/eliminar",
  query("id").isInt().withMessage("El ID debe ser un número entero"),
  controladorRol.eliminarRol
);

module.exports = router;
