require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const db = require("./src/config/database");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const passport = require("./src/config/passport");
const {
  generarAutomatico,
} = require("./src/controllers/control_acceso/controladorCodigoQR");
const { autenticacionRol } = require("./src/middleware/autenticacionRol");

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

// Establecer relaciones
require("./src/config/relaciones")();

const app = express();

db.sync({ alter: true })
  .then(() => {
    console.log("Conexion a la base de datos exitosa");
    generarAutomatico();
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

// Configurar CORS
app.use(
  cors({
    origin: "http://localhost:5173", // URL del frontend
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.set("port", process.env.PORT || 3000);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/imagenes", express.static(path.join(__dirname, "public/img")));

app.listen(app.get("port"), () => {
  console.log(`Server listening on http://localhost:${app.get("port")}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Gym API" });
});

app.use("/api/usuario", require("./src/routes/usuarios/rutasUsuario"));
app.use(
  "/api/rol",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/usuarios/rutasRol")
);
app.use(
  "/api/sesion",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/usuarios/rutasSesion")
);
app.use(
  "/api/cliente",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/usuarios/rutasCliente")
);
app.use("/api/autenticacion", require("./src/routes/authRutas"));
app.use(
  "/api/pagos/planes",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/pagos/rutaPlanMembresia")
);
app.use(
  "/api/pagos/membresias",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/pagos/rutaMembresia")
);
app.use(
  "/api/pagos/pagos",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/pagos/rutaPago")
);
app.use(
  "/api/inventario/categoria",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/inventario/rutaCategoria")
);
app.use(
  "/api/inventario/equipo",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/inventario/rutaEquipo")
);
app.use(
  "/api/inventario/mantenimiento",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/inventario/rutaMantenimiento")
);
app.use(
  "/api/control-acceso/codigo-qr",
  passport.authenticate("jwt", { session: false }),
  autenticacionRol("admin"),
  require("./src/routes/control_acceso/rutaCodigoQR")
);
app.use(
  "/api/control-acceso/asistencia",
  passport.authenticate("jwt", { session: false }),
  require("./src/routes/control_acceso/rutaAsistencia")
);
module.exports = app;
