const UsuarioRol = require('../../models/usuarios/usuario_rol');
const Usuario = require('../../models/usuarios/usuario');
const Rol = require('../../models/usuarios/rol');
const { validationResult } = require('express-validator');

exports.asignarRolAUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { id_usuario, id_rol } = req.body;

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que el rol existe
    const rol = await Rol.findByPk(id_rol);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    // Verificar si ya existe la asignación
    const asignacionExistente = await UsuarioRol.findOne({
      where: { id_usuario, id_rol }
    });

    if (asignacionExistente) {
      return res.status(409).json({ error: 'El usuario ya tiene este rol asignado' });
    }

    // Crear la asignación
    const nuevaAsignacion = await UsuarioRol.create({
      id_usuario,
      id_rol
    });

    res.status(201).json({
      mensaje: 'Rol asignado exitosamente',
      asignacion: nuevaAsignacion
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar rol' + error });
  }
};

// Remover un rol de un usuario
exports.removerRolDeUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { id_usuario, id_rol } = req.query;

    const asignacion = await UsuarioRol.findOne({
      where: { id_usuario, id_rol }
    });

    if (!asignacion) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    await asignacion.destroy();
    res.status(200).json({ mensaje: 'Rol removido exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al remover rol' + error });
  }
};

// Obtener todos los roles de un usuario
exports.obtenerRolesDeUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.query;

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener roles con información del rol
    const usuarioRoles = await UsuarioRol.findAll({
      where: { id_usuario },
      include: [{
        model: Rol,
        attributes: ['id_rol', 'nombre_rol', 'descripcion']
      }]
    });

    res.status(200).json({
      id_usuario,
      usuario: `${usuario.nombre} ${usuario.apellido}`,
      roles: usuarioRoles
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener roles del usuario' + error});
  }
};

// Obtener todos los usuarios con un rol específico
exports.obtenerUsuariosPorRol = async (req, res) => {
  try {
    const { id_rol } = req.query;

    // Verificar que el rol existe
    const rol = await Rol.findByPk(id_rol);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    // Obtener usuarios con información del usuario
    const usuariosConRol = await UsuarioRol.findAll({
      where: { id_rol },
      include: [{
        model: Usuario,
        attributes: ['id_usuario', 'nombre', 'apellido', 'email', 'username', 'estado']
      }]
    });

    res.status(200).json({
      id_rol,
      rol: rol.nombre_rol,
      usuarios: usuariosConRol
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios por rol' + error });
  }
};

// Verificar si un usuario tiene un rol específico
exports.verificarUsuarioTieneRol = async (req, res) => {
  try {
    const { id_usuario, id_rol } = req.query;

    const asignacion = await UsuarioRol.findOne({
      where: { id_usuario, id_rol }
    });

    res.status(200).json({
      tiene_rol: !!asignacion,
      id_usuario,
      id_rol
    });
  } catch (error) {
    console.error('Error al verificar rol:', error);
    res.status(500).json({ error: 'Error al verificar rol' });
  }
};

// Listar todas las asignaciones usuario-rol
exports.listarTodosUsuarioRoles = async (req, res) => {
  try {
    const asignaciones = await UsuarioRol.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id_usuario', 'nombre', 'apellido', 'email', 'username']
        },
        {
          model: Rol,
          attributes: ['id_rol', 'nombre_rol', 'descripcion']
        }
      ]
    });

    res.status(200).json(asignaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar asignaciones' + error });
  }
};

// Actualizar todos los roles de un usuario (reemplazar)
exports.actualizarRolesDeUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { id_usuario } = req.query;
    const { roles } = req.body; // Array de id_rol: [1, 2, 3]

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que todos los roles existen
    for (const id_rol of roles) {
      const rol = await Rol.findByPk(id_rol);
      if (!rol) {
        return res.status(404).json({ error: `Rol con id ${id_rol} no encontrado` });
      }
    }

    // Eliminar todas las asignaciones actuales del usuario
    await UsuarioRol.destroy({
      where: { id_usuario }
    });

    // Crear las nuevas asignaciones
    const nuevasAsignaciones = await Promise.all(
      roles.map(id_rol => 
        UsuarioRol.create({ id_usuario, id_rol })
      )
    );

    res.status(200).json({
      mensaje: 'Roles actualizados exitosamente',
      id_usuario,
      roles_asignados: nuevasAsignaciones
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar roles' + error});
  }
};