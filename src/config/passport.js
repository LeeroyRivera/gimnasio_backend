const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Usuario = require('../models/usuarios/usuario');

const opciones = { // Configuraciones de la estrategia JWT, como la forma de extraer el token y la clave secreta.
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opciones, async (payload, done) => { // Estrategia JWT para autenticar usuarios basándose en el token JWT proporcionado.
  try {
    const usuario = await Usuario.findByPk(payload.id); // Buscar el usuario en la base de datos utilizando el ID del payload del token.
    if (usuario) {
      done(null, usuario); // Si el usuario existe, pasar el objeto usuario al siguiente middleware.
    } else {
      done(null, false); // Si el usuario no existe, indicar que la autenticación falló.
    }
  } catch (error) {
    done(error, false);// En caso de error, pasar el error al siguiente middleware.
  }
}));

module.exports = passport; 

