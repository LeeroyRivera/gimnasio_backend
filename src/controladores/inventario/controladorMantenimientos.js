const Mantenimiento = require('../../models/inventario/mantenimiento');
const Equipo = require('../../models/inventario/equipo');
const { validationResult } = require('express-validator');


exports.listar = async (req, res) => {
  try {
    const mantenimientos = await Mantenimiento.findAll({
      include: [
        { model: Equipo }
      ]
    });
    res.status(200).json(mantenimientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar mantenimientos', error: error.message });
  }
};


exports.guardar = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const {
      tipo_mantenimiento,
      fecha_programada,
      fecha_realizada,
      descripcion_trabajo,
      tecnico_responsable,
      costo,
      estado,
      proximo_mantenimiento,
      notas,
      id_equipo
    } = req.body;

    const nuevoMantenimiento = await Mantenimiento.create({
      tipo_mantenimiento,
      fecha_programada,
      fecha_realizada,
      descripcion_trabajo,
      tecnico_responsable,
      costo,
      estado,
      proximo_mantenimiento,
      notas,
      id_equipo
    });

    res.status(201).json(nuevoMantenimiento);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el mantenimiento', error: error.message });
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

    const actualizado = await Mantenimiento.update(campos, { where: { id } });
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
    const eliminado = await Mantenimiento.destroy({ where: { id } });

    res.json({ msj: 'Registro Eliminado', data: eliminado });
  } catch (error) {
    res.status(500).json({ msj: 'Error al eliminar los datos', error });
  }
};
