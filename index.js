const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const db = require("./src/config/database");

// Importar modelos de usuarios
require("./src/models/usuarios/rol");
require("./src/models/usuarios/usuario");
require("./src/models/usuarios/cliente");
require("./src/models/usuarios/sesion");

// Importar modelos de pagos
require("./src/models/pagos/plan_membresia");
require("./src/models/pagos/membresia");
require("./src/models/pagos/pago");

// Importar modelos de control de acceso
require("./src/models/control_acceso/asistencia");
require("./src/models/control_acceso/codigo_qr_acceso");

// Importar modelos de inventario
require("./src/models/inventario/categoria_equipo");
require("./src/models/inventario/equipo");
require("./src/models/inventario/mantenimiento");

// Importar modelos de asistente virtual
require("./src/models/asistente_virtual/categoria_ejercicio");
require("./src/models/asistente_virtual/ejercicio");
require("./src/models/asistente_virtual/rutina");
require("./src/models/asistente_virtual/rutina_ejercicio");
require("./src/models/asistente_virtual/progreso_cliente");

// Establecer relaciones
require("./src/config/relaciones")();

const app = express();

db.sync({ alter: true })
  .then(() => {
    console.log("Conexion a la base de datos exitosa");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log(`Server corriendo en http://localhost:${app.get("port")}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Gym API" });
});

app.use("/api/usuario", require("./src/routes/usuarios/rutasUsuario"));
app.use("/api/rol", require("./src/routes/usuarios/rutasRol"));
app.use("/api/sesion", require("./src/routes/usuarios/rutasSesion"));
app.use("/api/cliente", require("./src/routes/usuarios/rutasCliente"));
app.use("/api/autenticacion", require("./src/routes/authRutas"));

module.exports = app;
