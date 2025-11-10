const Equipo = require('../../models/inventario/equipo');
const CategoriaEquipo = require('../../models/inventario/categoria_equipo');
const { validationResult } = require('express-validator');
const { uploadImagenEquipos} = require('../../config/archivos')
const fs = require('fs');
const path = require("path");
const multer = require('multer');

exports.listar = async (req, res) => {
  try {
    const equipos = await Equipo.findAll({
      include: [
        { model: CategoriaEquipo }
      ]
    });
    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar los equipos', error: error.message });
  }
};


exports.guardar = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const {
      nombre_equipo,
      marca,
      modelo,
      numero_serie,
      descripcion,
      fecha_compra,
      costo,
      ubicacion,
      estado,
      //foto,
      id_categoria
    } = req.body;

        // Si se subió una imagen, la tomamos de req.file
        const foto = req.file ? `img/equipos/${req.file.filename}` : null;

    const nuevoEquipo = await Equipo.create({
      nombre_equipo,
      marca,
      modelo,
      numero_serie,
      descripcion,
      fecha_compra,
      costo,
      ubicacion,
      estado,
      foto,
      id_categoria
    });

    res.status(201).json(nuevoEquipo);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el equipo', error: error.message });
  }
};


exports.editar = async (req, res) => {
  const errores = validationResult(req).errors;

  if (errores.length > 0) {
    const data = errores.map(s => ({
      atributo: s.path,
      msj: s.msg
    }));
    return res.json({ msj: 'Hay errores', data: data });
  }

  try {
    const { id } = req.query;
    const campos = req.body;

    const actualizado = await Equipo.update(campos, { where: { id } });
    res.json({ msj: 'Registro Actualizado', data: actualizado });
  } catch (error) {
    res.status(500).json({ msj: 'No se pudo actualizar el registro', error });
  }
};


exports.eliminar = async (req, res) => {
  const errores = validationResult(req).errors;

  if (errores.length > 0) {
    const data = errores.map(i => ({
      atributo: i.path,
      msj: i.msg
    }));
    return res.json({ msj: 'Hay errores', data });
  }

  try {
    const { id } = req.query;
    const eliminado = await Equipo.destroy({ where: { id } });

    res.json({ msj: 'Registro Eliminado', data: eliminado });
  } catch (error) {
    res.status(500).json({ msj: 'Error al eliminar los datos', error });
  }
};

exports.validarImagenEquipo = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
  }
  else {
      uploadImagenEquipos(req, res, (err) => {
          if (err instanceof multer.MulterError) {
              res.status(400).json({ msj: "Hay errores al cargar la imagen", error: err });
          }
          else if (err) {
              res.status(400).json({ msj: "Hay errores al cargar la imagen", error: err });
          }
          else {
              next();
          }
      });
  }
};


exports.GuardarImagenEquipo = async (req, res) => {
  try {
    const { id } = req.query;

    if (!req.file) {
      return res.status(400).json({ msj: "No se recibió ninguna imagen" });
    }

    const foto = `img/equipos/${req.file.filename}`;
    const rutaImagen = path.join(process.cwd(), 'public/img/equipos', req.file.filename);

    // Verificar si el archivo existe
    if (!fs.existsSync(rutaImagen)) {
      return res.status(400).json({ msj: "La imagen no se encontró en el servidor" });
    }

    // Buscar y actualizar el equipo
    const equipo = await Equipo.findByPk(id);
    if (!equipo) {
      return res.status(404).json({ msj: "Equipo no encontrado" });
    }

    equipo.foto = foto;
    await equipo.save();

    res.status(200).json({
      msj: "Imagen asociada correctamente al equipo",
      nombreArchivo: foto
    });

  } catch (error) {
    res.status(500).json({ msj: "Error al guardar la imagen del equipo", error: error.message });
  }
};


