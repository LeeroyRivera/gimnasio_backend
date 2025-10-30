const Equipo = require('../../models/inventario/equipo');
const CategoriaEquipo = require('../../models/inventario/categoria_equipo');
const { validationResult } = require('express-validator');


exports.listar = async (req, res) => {
  try {
    const equipos = await Equipo.findAll({
      include: [
        { model: CategoriaEquipo, as: 'categoria', attributes: ['nombre_categoria'] }
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
      foto,
      id_categoria
    } = req.body;

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
