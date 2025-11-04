const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const controladorUsuarioRol = require('../../controllers/usuarios/controladorUsuarioRol');

// Validaciones
const validacionAsignarRol = [
  body('id_usuario').isInt().withMessage('id_usuario debe ser un número entero'),
  body('id_rol').isInt().withMessage('id_rol debe ser un número entero')
];

const validacionRemoverRol = [
  query('id_usuario').isInt().withMessage('id_usuario debe ser un número entero'),
  query('id_rol').isInt().withMessage('id_rol debe ser un número entero')
];

const validacionActualizarRoles = [
  query('id_usuario').isInt().withMessage('id_usuario debe ser un número entero'),
  body('roles').isArray().withMessage('roles debe ser un array'),
  body('roles.*').isInt().withMessage('Cada rol debe ser un número entero')
];

// POST /api/usuario-rol/asignar - Asignar un rol a un usuario
router.post('/asignar', validacionAsignarRol, controladorUsuarioRol.asignarRolAUsuario);

// DELETE /api/usuario-rol/remover - Remover un rol de un usuario
router.delete('/remover', validacionRemoverRol, controladorUsuarioRol.removerRolDeUsuario);

// GET /api/usuario-rol/usuario/:id_usuario - Obtener roles de un usuario
router.get('/usuario', 
  query('id_usuario').isInt().withMessage('id_usuario debe ser un número entero'),
  controladorUsuarioRol.obtenerRolesDeUsuario
);

// GET /api/usuario-rol/rol/:id_rol - Obtener usuarios por rol
router.get('/rol',
  query('id_rol').isInt().withMessage('id_rol debe ser un número entero'),
  controladorUsuarioRol.obtenerUsuariosPorRol
);

// GET /api/usuario-rol/verificar - Verificar si usuario tiene un rol
router.get('/verificar', controladorUsuarioRol.verificarUsuarioTieneRol);

// GET /api/usuario-rol/listar - Listar todas las asignaciones
router.get('/listar', controladorUsuarioRol.listarTodosUsuarioRoles);

// PUT /api/usuario-rol/usuario - Actualizar roles de un usuario
router.put('/usuario', validacionActualizarRoles, controladorUsuarioRol.actualizarRolesDeUsuario);

module.exports = router;
