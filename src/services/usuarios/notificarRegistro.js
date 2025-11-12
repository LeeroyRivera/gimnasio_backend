const { enviarCorreo } = require("../../config/correos");

/**
 * Envía un correo de bienvenida cuando se registra un nuevo usuario.
 * No lanza errores hacia arriba; debe ser usada en un try/catch del controlador.
 *
 * @param {object} usuario - Registro de Usuario recién creado
 * @param {object} cliente - Registro de Cliente asociado (contiene nombre y apellido)
 */
async function notificarRegistroUsuario(usuario, cliente) {
  if (!usuario || !cliente) return;

  const destinatario = usuario.email;
  const asunto = "¡Bienvenido(a) al Gimnasio!";
  const nombreCompleto = `${cliente.nombre || ""} ${
    cliente.apellido || ""
  }`.trim();
  const contenido = `
    <div style="font-family: Arial, sans-serif; line-height:1.5;">
      <h2>Hola ${nombreCompleto || usuario.username},</h2>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      <p>Usuario: <b>${usuario.username}</b></p>
      <p>Si no reconoces este registro, ignora este mensaje.</p>
      <hr />
      <small>Este es un mensaje automático, por favor no responder.</small>
    </div>
  `;

  await enviarCorreo(destinatario, asunto, contenido);
}

module.exports = { notificarRegistroUsuario };
