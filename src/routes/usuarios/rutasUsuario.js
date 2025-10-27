const express = require('express');
const router = express.Router();
const controladorUsuario = require('../../controllers/usuarios/controladorUsuario');

router.get('/listar', controladorUsuario.listarTodosUsuarios);

router.get('/activo', controladorUsuario.obtenerUsuariosActivos);

router.post('/guardar', controladorUsuario.guardarUsuario);

router.put('/actualizar', controladorUsuario.actualizarUsuario);

router.delete('/eliminar', controladorUsuario.eliminarUsuario);

module.exports = router;