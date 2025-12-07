const express = require("express");
const routes = express.Router();
const controladorPago = require("../../controladores/pagos/controladorPago");
const { body, query } = require("express-validator");
const modeloPago = require("../../models/pagos/pago");
const passport = require("passport");

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Registro y control de pagos de membresías
 */

/**
 * @swagger
 * /pagos/pagos/listar:
 *   get:
 *     summary: Obtiene la lista de pagos junto con la información de la membresía, cliente y plan
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del pago
 *                     example: 1
 *                   monto:
 *                     type: number
 *                     format: float
 *                     description: Monto pagado
 *                     example: 640.00
 *                   metodo_pago:
 *                     type: string
 *                     enum: [Efectivo, Transferencia, Tarjeta]
 *                     description: Método de pago utilizado
 *                     example: Tarjeta
 *                   fecha_pago:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha del pago
 *                     example: "2025-11-11T16:20:11.000Z"
 *                   referencia:
 *                     type: string
 *                     description: Código de referencia del pago
 *                     example: "PAG-20251111-DVK6ZL"
 *                   notas:
 *                     type: string
 *                     description: Observaciones asociadas al pago
 *                     example: "Pago con tarjeta en recepción."
 *                   detalle_descuento:
 *                     type: string
 *                     description: Porcentaje o detalle de descuento aplicado
 *                     example: "20"
 *                   procesadoPor:
 *                     type: object
 *                     nullable: true
 *                     description: Usuario que procesó el pago (si aplica)
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: Usuario que registró el pago
 *                         example: "admin01"
 *                   membresia:
 *                     type: object
 *                     description: Información de la membresía asociada al pago
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID de la membresía
 *                         example: 1
 *                       fecha_inicio:
 *                         type: string
 *                         description: Fecha de inicio de la membresía
 *                         example: "2025-11-01T14:00:00.000Z"
 *                       fecha_vencimiento:
 *                         type: string
 *                         description: Fecha de vencimiento de la membresía
 *                         example: "2025-12-01T14:00:00.000Z"
 *                       estado:
 *                         type: string
 *                         enum: [Activa, Vencida, Suspendida, Cancelada]
 *                         description: Estado de la membresía
 *                         example: "Activa"
 *                       cliente:
 *                         type: object
 *                         description: Información del cliente asociado
 *                         properties:
 *                           id_cliente:
 *                             type: integer
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             example: "Ana"
 *                           apellido:
 *                             type: string
 *                             example: "Pérez"
 *                       plan:
 *                         type: object
 *                         description: Información del plan de membresía
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nombre_plan:
 *                             type: string
 *                             example: "Plan Mensual Premium"
 *                           descripcion:
 *                             type: string
 *                             example: "Acceso completo al gimnasio, entrenador y asistente virtual."
 *                           duracion_dias:
 *                             type: integer
 *                             example: 30
 */
routes.get("/listar", controladorPago.listar);

// Pagos del cliente autenticado
routes.get(
  "/mis-pagos",
  passport.authenticate("jwt", { session: false }),
  controladorPago.listarPorUsuarioAutenticado
);

/**
 * @swagger
 * /pagos/pagos/guardar:
 *   post:
 *     summary: Guarda un pago y aplica descuento si existe en la membresía
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_membresia:
 *                 type: integer
 *               metodo_pago:
 *                 type: string
 *                 enum: ['Efectivo','Transferencia','Tarjeta']
 *               referencia:
 *                 type: string
 *               notas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pago guardado correctamente
 *       400:
 *         description: Error en los datos enviados
 */
routes.post(
  "/guardar",
  controladorPago.validarComprobanteGuardar,
  [
    body("id_membresia")
      .notEmpty()
      .isInt()
      .withMessage("Debe enviar el id de la membresía"),
    body("metodo_pago")
      .isIn(["Efectivo", "Transferencia", "Tarjeta"])
      .withMessage("Método de pago inválido"),
  ],
  controladorPago.guardar
);

/**
 * @swagger
 * /pagos/pagos/editar:
 *   put:
 *     summary: Edita un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metodo_pago:
 *                 type: string
 *               notas:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pago actualizado correctamente
 */
routes.put(
  "/editar",
  query("id").isInt().withMessage("El id debe ser entero"),
  query("id").custom(async (value) => {
    const buscar = await modeloPago.findOne({ where: { id: value } });
    if (!buscar) throw new Error("El pago no existe");
  }),
  body("metodo_pago")
    .optional()
    .isIn(["Efectivo", "Transferencia", "Tarjeta"])
    .withMessage("Método inválido"),
  controladorPago.editar
);

/**
 * @swagger
 * /pagos/pagos/eliminar:
 *   delete:
 *     summary: Elimina un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Pago eliminado correctamente
 */
routes.delete(
  "/eliminar",
  query("id").isInt().withMessage("El id debe ser entero"),
  controladorPago.eliminar
);

/**
 * @swagger
 * /pagos/pagos/comprobante:
 *   post:
 *     summary: Actualiza el comprobante de un pago existente
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comprobante:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen del comprobante
 *     responses:
 *       200:
 *         description: Comprobante actualizado correctamente
 */
routes.post(
  "/comprobante",
  query("id").isInt().withMessage("Debe enviar ID del pago"),
  controladorPago.validarComprobanteActualizar,
  controladorPago.actualizarComprobantePago
);

module.exports = routes;
