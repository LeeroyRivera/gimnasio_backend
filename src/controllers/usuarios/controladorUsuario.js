const Usuario = require("../../models/usuarios/usuario");
const { validationResult } = require("express-validator");
const Cliente = require("../../models/usuarios/cliente");
const argon2 = require("argon2");

exports.listarTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al listar usuarios" + error });
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
    res
      .status(500)
      .json({
        error: "Error al obtener usuario por nombre de usuario" + error,
      });
  }
};

exports.obtenerUsuariosActivos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ where: { estado: "activo" } });
    res.status(200).json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener usuarios activos" + error });
  }
};

exports.guardarUsuario = async (req, res) => {
  const errores = validationResult(req);
  const clienteData = req.body.cliente;
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

    if (!clienteData) {
      return res.status(500).json("Datos de cliente faltantes");
    }

    const nuevoCliente = await Cliente.create({
      ...clienteData,
      id_usuario: nuevoUsuario.id_usuario,
    });

    res.status(201).json({ Usuario: nuevoUsuario, Cliente: nuevoCliente });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar usuario" + error });
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
    res.status(500).json({ error: "Error al actualizar usuario" + error });
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
    res.status(500).json({ error: "Error al eliminar usuario" + error });
  }
};
