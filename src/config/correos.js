const { Resend } = require("resend");

const resendApiKey = process.env.EMAIL_API;
const resendFrom =
  process.env.EMAIL_FROM || "Sistema Gimnasio <no-reply@example.com>";

const resend = new Resend(resendApiKey);

const enviarCorreo = async (destinatario, asunto, contenido) => {
  try {
    const { data, error } = await resend.emails.send({
      from: resendFrom,
      to: Array.isArray(destinatario) ? destinatario : [destinatario],
      subject: asunto,
      html: contenido,
    });

    if (error) {
      console.error("Error detallado al enviar correo (Resend):", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error detallado al enviar correo (Resend):", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

module.exports = {
  enviarCorreo,
};
