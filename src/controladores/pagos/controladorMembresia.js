const Membresia = require('../../models/pagos/membresia');
const { validationResult } = require('express-validator');

exports.listar = async (req, res) => {
  try {
    const membresias = await Membresia.findAll();
    res.status(200).json(membresias);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar las membresías', error: error.message });
  }
};

exports.guardar = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const {
     // id_cliente,
      fecha_inicio,
      fecha_vencimiento,
      estado,
      monto_pagado,
      descuento_aplicado,
      notas
    } = req.body;

    const nuevaMembresia = await Membresia.create({
      //id_cliente,
      fecha_inicio,
      fecha_vencimiento,
      estado,
      monto_pagado,
      descuento_aplicado,
      notas
    });

    res.status(201).json(nuevaMembresia);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar la membresía', error: error.message });
  }
};

exports.editar = async (req, res) => {
  const errores = validationResult(req).errors;

  if (errores.length > 0) {
    const data = errores.map(s => ({
      atributo: s.path,
      msj: s.msg
    }));
    res.json({ msj: 'Hay errores', data });
  } else {
    const { id } = req.query;
    const {
      //id_cliente,
      fecha_inicio,
      fecha_vencimiento,
      estado,
      monto_pagado,
      descuento_aplicado,
      notas
    } = req.body;

    await Membresia.update({
      //id_cliente,
      fecha_inicio,
      fecha_vencimiento,
      estado,
      monto_pagado,
      descuento_aplicado,
      notas
    }, {
      where: { id_membresia: id }
    }).then(data => {
      res.json({ msj: 'Registro actualizado', data });
    }).catch(er => {
      res.json({ msj: 'No se pudo actualizar el registro', error: er });
    });
  }
};

exports.eliminar = async (req, res) => {
  const errores = validationResult(req).errors;

  if (errores.length > 0) {
    const data = errores.map(i => ({
      atributo: i.path,
      msj: i.msg
    }));
    res.json({ msj: 'Hay errores', data });
  } else {
    const { id } = req.query;

    await Membresia.destroy({
      where: { id_membresia: id }
    }).then(data => {
      res.json({ msj: 'Registro eliminado', data });
    }).catch(er => {
      res.json({ msj: 'Error al eliminar el registro', error: er });
    });
  }
};
