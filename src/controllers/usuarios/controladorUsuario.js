const Usuario = require("../../models/usuarios/usuario");
const { validationResult } = require("express-validator");
const argon2 = require("argon2");

exports.listarTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};

exports.obtenerUsuarioPorUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario por nombre de usuario:", error);
    res
      .status(500)
      .json({ error: "Error al obtener usuario por nombre de usuario" });
  }
};

exports.obtenerUsuariosActivos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ where: { estado: "activo" } });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios activos:", error);
    res.status(500).json({ error: "Error al obtener usuarios activos" });
  }
};

exports.guardarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const {
      id_rol,
      nombre,
      apellido,
      email,
      telefono,
      fecha_nacimiento,
      genero,
      foto_perfil,
      username,
      password_hash,
    } = req.body;

    const nuevoUsuario = await Usuario.create({
      id_rol,
      nombre,
      apellido,
      email,
      telefono,
      fecha_nacimiento,
      genero,
      foto_perfil,
      username,
      password_hash,
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    res.status(500).json({ error: "Error al guardar usuario" });
  }
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.query;
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await usuario.update({
      ...req.body,
    });

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.query;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await usuario.update({ estado: "inactivo" });
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
