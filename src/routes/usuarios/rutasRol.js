const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const controladorRol = require('../../controllers/usuarios/controladorRol');

// Validaciones para crear/actualizar rol
const validacionesRol = [
  body('nombre')
    .notEmpty().withMessage('El nombre del rol es requerido')
    .isLength({ max: 50 }).withMessage('El nombre no debe exceder 50 caracteres'),
  body('descripcion')
    .optional()
];

// GET /api/rol/listar - Listar todos los roles
router.get('/listar', controladorRol.listarTodosRoles);

// GET /api/rol/:id - Obtener rol por ID
router.get('/:id', 
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  controladorRol.obtenerRolPorId
);

// POST /api/rol/guardar - Crear nuevo rol
router.post('/guardar', validacionesRol, controladorRol.guardarRol);

// PUT /api/rol/:id - Actualizar rol
router.put('/:id', 
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  validacionesRol,
  controladorRol.actualizarRol
);

// DELETE /api/rol/:id - Eliminar rol
router.delete('/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  controladorRol.eliminarRol
);

module.exports = router;
