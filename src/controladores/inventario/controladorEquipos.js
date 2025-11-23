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
        { model: CategoriaEquipo, as: 'categoria_equipo' }
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

// Middleware para validar y procesar imágenes al GUARDAR (crear nuevo equipo)
exports.validarImagenGuardar = (req, res, next) => {
  uploadImagenEquipos(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msj: "Error al cargar la imagen", error: err.message });
    }
    else if (err) {
      return res.status(400).json({ msj: "Error al cargar la imagen", error: err.message });
    }
    else {
      // La imagen es opcional al guardar, continuar incluso sin imagen
      next();
    }
  });
};

// Middleware para validar y procesar imágenes al ACTUALIZAR
exports.validarImagenActualizar = (req, res, next) => {
  uploadImagenEquipos(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msj: "Error al cargar la imagen", error: err.message });
    }
    else if (err) {
      return res.status(400).json({ msj: "Error al cargar la imagen", error: err.message });
    }
    else {
      next();
    }
  });
};

// Actualizar solo la imagen de un equipo existente
exports.actualizarImagenEquipo = async (req, res) => {
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

    // Si ya tenía una imagen, eliminarla
    if (equipo.foto) {
      const rutaImagenAntigua = path.join(process.cwd(), 'public', equipo.foto);
      if (fs.existsSync(rutaImagenAntigua)) {
        fs.unlinkSync(rutaImagenAntigua);
      }
    }

    equipo.foto = foto;
    await equipo.save();

    res.status(200).json({
      msj: "Imagen actualizada correctamente",
      nombreArchivo: foto
    });

  } catch (error) {
    res.status(500).json({ msj: "Error al actualizar la imagen del equipo", error: error.message });
  }
};


