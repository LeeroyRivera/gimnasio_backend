const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const argon = require("argon2");
const { body } = require("express-validator");
const { Op } = require("sequelize");
const Rol = require("../models/usuarios/rol");
const Usuario = require("../models/usuarios/usuario");
const UsuarioRol = require("../models/usuarios/usuario_rol");

const router = express.Router();
const validacionesLogin = [
  body("username")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
const validacionesRegistro = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
  body("email").isEmail().withMessage("El email no es válido"),
  body("username")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),
  body("password_hash").notEmpty().withMessage("La contraseña es obligatoria"),
];

router.post("/login", validacionesLogin, async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const usuario = await Usuario.findOne({
      where: {
        [Op.or]: [
          ...(email ? [{ email }] : []),
          ...(username ? [{ username }] : []),
        ],
      },
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const contrasenaValida = await argon.verify(
      usuario.password_hash,
      password
    );
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const asignaciones = await UsuarioRol.findAll({
      // Obtener roles del usuario
      where: { id_usuario: usuario.id_usuario },
      include: [{ model: Rol, attributes: ["id_rol", "nombre"] }],
      attributes: [],
    });

    const roles = asignaciones.map((a) => a.Rol.nombre); // mapear solo los nombres de los roles

    const token = jwt.sign(
      { id: usuario.id_usuario, username: usuario.username, roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

router.post("/registro", validacionesRegistro, async (req, res) => {
  const { nombre, apellido, email, username, password_hash } = req.body;
  try {
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      username,
      password_hash,
    });
    return res.status(201).json({ usuario: nuevoUsuario });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

router.get(
  "/perfil",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ usuario: req.user });
  }
);

module.exports = router;
