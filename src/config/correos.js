// Sistema de correos usando Resend vía HTTP, con métricas básicas
// Variables de entorno esperadas:
// - RESEND_API_KEY: API key de Resend (re_xxx)
// - EMAIL_FROM: remitente, por ejemplo "Sistema Gimnasio <onboarding@resend.dev>"

// Pequeño módulo interno de estadísticas (en memoria)
let correosEnviados = 0;
let correosFallidos = 0;

const registrarEnviado = () => {
  correosEnviados += 1;
};

const registrarFallido = (error) => {
  correosFallidos += 1;
  console.error("❌ Registro de fallo al enviar correo:", {
    message: error.message || String(error),
  });
};

// Función para enviar correo usando la API HTTP de Resend
const enviarCorreoResend = async (destinatarios, asunto, cuerpoHTML) => {
  try {
    const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API;

    if (!apiKey) {
      const error = new Error("RESEND_API_KEY/EMAIL_API no está configurada");
      registrarFallido(error);
      throw error;
    }

    // Normalizar destinatarios a array si es string
    let destinatariosArray = Array.isArray(destinatarios)
      ? destinatarios
      : [destinatarios];

    // Filtrar correos válidos
    destinatariosArray = destinatariosArray.filter(
      (email) => email && typeof email === "string" && email.includes("@")
    );

    if (destinatariosArray.length === 0) {
      const error = new Error("No hay destinatarios válidos");
      registrarFallido(error);
      throw error;
    }

    const from =
      process.env.EMAIL_FROM || "Sistema Gimnasio <onboarding@resend.dev>";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: destinatariosArray,
        subject: asunto,
        html: cuerpoHTML,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        `Resend API error (${response.status}): ${
          data.message || JSON.stringify(data)
        }`
      );
      registrarFallido(error);
      console.error("❌ Error de Resend API:", {
        status: response.status,
        data,
        destinatarios: destinatariosArray,
      });
      throw error;
    }

    registrarEnviado();
    console.log("✅ Correo enviado exitosamente con Resend:", {
      id: data.id,
      destinatarios: destinatariosArray,
    });
    return { success: true, data };
  } catch (error) {
    if (
      error.message &&
      !error.message.includes("RESEND_API_KEY") &&
      !error.message.includes("Resend API error") &&
      !error.message.includes("destinatarios válidos")
    ) {
      registrarFallido(error);
    }
    console.error(
      "❌ Error al enviar correo con Resend:",
      error.message || error
    );
    throw error;
  }
};

// Plantilla HTML moderna reutilizable para correos
const generarPlantillaCorreo = (titulo, contenido) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7fa;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
        }
        .email-body h2 {
            color: #1976d2;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #1976d2;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 8px 0;
            font-size: 14px;
        }
        .info-box strong {
            color: #1976d2;
            font-weight: 600;
        }
        .email-footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #666666;
            border-top: 1px solid #e0e0e0;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #1976d2;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #1565c0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${titulo}</h1>
        </div>
        <div class="email-body">
            ${contenido}
        </div>
        <div class="email-footer">
            <p>Este es un correo automático del sistema de gimnasio.</p>
            <p>Por favor, no responder a este correo.</p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = {
  enviarCorreo: enviarCorreoResend,
  generarPlantillaCorreo,
};
