const express = require('express');
const routes = express.Router();
const controladorEquipo = require('../../controladores/inventario/controladorEquipos');
const { body, query } = require('express-validator');
const modeloEquipo = require('../../models/inventario/equipo');
const modeloCategoria = require('../../models/inventario/categoria_equipo');

/**
 * @swagger
 * tags:
 *   name: Equipos
 *   description: Registro y control de equipos en inventario
 */

/**
 * @swagger
 * /inventario/equipo/listar:
 *   get:
 *     summary: Obtiene la lista de equipos
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: Lista de equipos obtenida exitosamente
 */
routes.get('/listar', controladorEquipo.listar);

/**
 * @swagger
 * /inventario/equipo/guardar:
 *   post:
 *     summary: Guarda un equipo nuevo
 *     tags: [Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_equipo:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               numero_serie:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha_compra:
 *                 type: string
 *                 format: date
 *               costo:
 *                 type: number
 *               ubicacion:
 *                 type: string
 *               estado:
 *                 type: string
 *               id_categoria:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Equipo registrado correctamente
 */
routes.post('/guardar',
  body("nombre_equipo").notEmpty().withMessage("El nombre del equipo es obligatorio"),
  body("marca").notEmpty().withMessage("La marca es obligatoria"),
  body("modelo").notEmpty().withMessage("El modelo es obligatorio"),
  body("numero_serie").notEmpty().withMessage("Debe ingresar el número de serie"),
  body("ubicacion").notEmpty().withMessage("La ubicación es obligatoria"),
  body("costo").isDecimal().withMessage("El costo debe ser decimal"),
  body("estado").optional().isIn(['Excelente','Bueno','Regular','En mantenimiento','Fuera de servicio'])
    .withMessage("Estado inválido"),
  body("id_categoria")
    .notEmpty().withMessage("Debe enviar una categoría")
    .isInt().withMessage("El id de la categoría debe ser entero")
    .custom(async (value) => {
      const categoria = await modeloCategoria.findOne({ where: { id: value } });
      if (!categoria) throw new Error("La categoría no existe");
    }),

  controladorEquipo.guardar
);

/**
 * @swagger
 * /inventario/equipo/editar:
 *   put:
 *     summary: Edita un equipo
 *     tags: [Equipos]
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
 *               nombre_equipo:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               numero_serie:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               costo:
 *                 type: number
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipo actualizado correctamente
 */
routes.put('/editar',
  query("id")
    .isInt().withMessage("Debe enviar un ID válido")
    .custom(async (value) => {
      const buscar = await modeloEquipo.findOne({ where: { id: value } });
      if (!buscar) throw new Error("El equipo no existe");
    }),

  body("costo").optional().isDecimal().withMessage("Costo debe ser decimal"),

  controladorEquipo.editar
);

/**
 * @swagger
 * /inventario/equipo/eliminar:
 *   delete:
 *     summary: Elimina un equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipo eliminado correctamente
 */
routes.delete('/eliminar',
  query("id").isInt().withMessage("Debe enviar un ID válido"),
  controladorEquipo.eliminar
);

/**
 * @swagger
 * /inventario/equipo/imagen:
 *   post:
 *     summary: Sube una imagen del equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del equipo relacionado
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen
 *     responses:
 *       200:
 *         description: Imagen guardada correctamente
 */
routes.post('/imagen',
  query("id").isInt().withMessage("Debe enviar ID del equipo"),
  controladorEquipo.validarImagenEquipo,
  controladorEquipo.GuardarImagenEquipo
);

module.exports = routes;


/*const express = require('express');
const routes = express.Router();
const controladorEquipo = require('../../controladores/inventario/controladorEquipos');
const { body, query } = require('express-validator');

routes.get('/listar', controladorEquipo.listar);
routes.post('/guardar', controladorEquipo.guardar);
routes.put('/editar', controladorEquipo.editar);
routes.delete('/eliminar', controladorEquipo.eliminar);
routes.post('/imagen', controladorEquipo.validarImagenEquipo, controladorEquipo.GuardarImagenEquipo)
module.exports = routes;*/