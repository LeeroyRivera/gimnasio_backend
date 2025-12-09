const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const argon = require("argon2");
const { body, oneOf } = require("express-validator");
const { Op } = require("sequelize");
const Rol = require("../models/usuarios/rol");
const Usuario = require("../models/usuarios/usuario");
const Sesion = require("../models/usuarios/sesion");
const { validationResult } = require("express-validator");

const router = express.Router();
const validacionesLogin = [
  oneOf(
    [
      [body("username").exists().bail().notEmpty()],
      [body("email").exists().bail().isEmail()],
    ],
    "Debe enviar 'username' o un 'email' válido"
  ),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

/**
 * @swagger
 * tags:
 *   name: Autenticacion
 *   description: Endpoints de autenticación y perfil protegido
 */
/**
 * @swagger
 * /autenticacion/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Alternativa a username (si está habilitado)
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Autenticación correcta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Error de validación en la petición
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
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

    if (!usuario.password) {
      return res
        .status(500)
        .json({ mensaje: "Usuario sin hash de contraseña almacenado" });
    }
    const contrasenaValida = await argon.verify(usuario.password, password);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const rol = await Rol.findOne({
      where: { id_rol: usuario.id_rol },
      attributes: ["nombre"],
    });

    const token = jwt.sign(
      { id: usuario.id_usuario, username: usuario.username, rol: rol.nombre },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // obtener IP real y dispositivo
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      "desconocida";

    const dispositivo = req.headers["user-agent"] || "desconocido";

    // guardar sesión con metadatos
    await Sesion.create({
      id_usuario: usuario.id_usuario,
      access_token: token,
      ip,
      dispositivo,
    });

    // devolver también información básica del usuario para el frontend
    return res.json({
      token,
      user: {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        rol: rol.nombre,
      },
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error en el servidor" + error });
  }
});

/**
 * @swagger
 * /autenticacion/perfil:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Autenticacion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado
 *       401:
 *         description: No autorizado o token inválido
 */
router.get(
  "/perfil",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ usuario: req.user });
  }
);

module.exports = router;
