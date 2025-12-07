const Usuario = require("../../models/usuarios/usuario");
const { validationResult } = require("express-validator");
const Cliente = require("../../models/usuarios/cliente");
const argon2 = require("argon2");
const {
  notificarRegistroUsuario,
} = require("../../services/usuarios/notificarRegistro");
const sequelize = require("../../config/database");

const { Op } = require("sequelize");

exports.listarTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ include: Cliente });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al listar usuarios" + error });
  }
};

exports.obtenerUsuarioPorUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const usuario = await Usuario.findOne({
      where: { username },
      include: Cliente,
    });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener usuario por nombre de usuario" + error,
    });
  }
};

exports.obtenerUsuariosActivos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { estado: "activo" },
      include: Cliente,
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener usuarios activos" + error });
  }
};

// Búsqueda rápida para autocompletar por username, nombre o apellido
exports.buscarUsuarios = async (req, res) => {
  const { term } = req.query;

  if (!term || term.trim().length < 2) {
    return res
      .status(400)
      .json({
        error: "El término de búsqueda debe tener al menos 2 caracteres",
      });
  }

  try {
    const likeTerm = `%${term.trim()}%`;

    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: likeTerm } },
          { email: { [Op.like]: likeTerm } },
        ],
      },
      include: [
        {
          model: Cliente,
          where: {
            [Op.or]: [
              { nombre: { [Op.like]: likeTerm } },
              { apellido: { [Op.like]: likeTerm } },
            ],
          },
          required: false,
        },
      ],
      limit: 10,
      order: [["username", "ASC"]],
    });

    return res.status(200).json(usuarios);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al buscar usuarios: " + error.message });
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
      email,
      telefono,
      fecha_nacimiento,
      genero,
      foto_perfil,
      username,
      password,
      cliente,
    } = req.body;

    const [existeEmail, existeUsername] = await Promise.all([
      //
      Usuario.findOne({ where: { email } }),
      Usuario.findOne({ where: { username } }),
    ]);
    if (existeEmail) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    if (existeUsername) {
      return res
        .status(409)
        .json({ error: "El nombre de usuario ya está en uso" });
    }

    // Transacción para crear usuario y cliente de forma atómica
    const t = await sequelize.transaction(); // Iniciar transacción, una transaccion es una serie de operaciones que se ejecutan como una sola unidad

    try {
      const nuevoUsuario = await Usuario.create(
        {
          id_rol,
          email,
          telefono,
          fecha_nacimiento,
          genero,
          foto_perfil,
          username,
          password,
        },
        { transaction: t } // Pasar la transacción al crear el usuario
      );

      const nuevoCliente = await Cliente.create(
        { ...cliente, id_usuario: nuevoUsuario.id_usuario },
        { transaction: t } // Pasar la transacción al crear el cliente
      );

      await t.commit();
      // Notificar registro
      try {
        await notificarRegistroUsuario(nuevoUsuario, nuevoCliente);
      } catch (e) {
        console.error("No se pudo enviar correo de registro:", e?.message || e);
      }

      return res
        .status(201)
        .json({ usuario: nuevoUsuario, cliente: nuevoCliente });
    } catch (errorTransaccion) {
      await t.rollback();
      throw errorTransaccion;
    }
  } catch (error) {
    if (error && error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Violación de unicidad, Duplicacion de dato unico",
        detalles: error.errors,
      });
    }
    res.status(500).json({
      error: "Error al guardar usuario: " + error,
    });
  }
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.query;
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  // Extraer campos del body para validaciones de unicidad condicionales
  const { email, username } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (email && email !== usuario.email) {
      // Si el email  no es nulo y es diferente al actual
      const existeEmail = await Usuario.findOne({ where: { email } });
      if (existeEmail) {
        return res.status(409).json({ error: "El email ya está registrado" });
      }
    }
    if (username && username !== usuario.username) {
      const existeUsername = await Usuario.findOne({ where: { username } }); // Si el username no es nulo y es diferente al actual
      if (existeUsername) {
        return res
          .status(409)
          .json({ error: "El nombre de usuario ya está en uso" });
      }
    }
    const updates = { ...req.body };

    const actualizado = await usuario.update(updates);

    res.status(200).json("Usuario actualizado correctamente");
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
