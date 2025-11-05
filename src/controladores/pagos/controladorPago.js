const Pago = require('../../models/pagos/pago');
const { validationResult } = require('express-validator');

exports.listar = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar los pagos', error: error.message });
  }
};

exports.guardar = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const {
      id_membresia,
      monto,
      metodo_pago,
      comprobante,
      referencia,
      //procesado_por,
      notas
    } = req.body;

    const nuevoPago = await Pago.create({
      id_membresia,
      monto,
      metodo_pago,
      comprobante,
      referencia,
     // procesado_por,
      notas
    });

    res.status(201).json(nuevoPago);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el pago', error: error.message });
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
      id_membresia,
      monto,
      metodo_pago,
      comprobante,
      referencia,
      //procesado_por,
      notas
    } = req.body;

    await Pago.update({
      id_membresia,
      monto,
      metodo_pago,
      comprobante,
      referencia,
      //procesado_por,
      notas
    }, {
      where: { id_pago: id }
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

    await Pago.destroy({
      where: { id_pago: id }
    }).then(data => {
      res.json({ msj: 'Registro eliminado', data });
    }).catch(er => {
      res.json({ msj: 'Error al eliminar el registro', error: er });
    });
  }
};
