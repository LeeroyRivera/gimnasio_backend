const fs = require('fs');
const path = require("path");
const multer = require('multer');
const { uploadComprobantePago } = require('../../config/archivos');
const Membresia = require('../../models/pagos/membresia');
const Pago = require('../../models/pagos/pago');
const { validationResult } = require('express-validator');
const PlanMembresia = require('../../models/pagos/plan_membresia');

exports.listar = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar los pagos', error: error.message });
  }
};


// Genera un número de referencia
function generarReferencia() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const fecha = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `PAG-${fecha}-${random}`;
}

exports.guardar = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const {
      id_membresia,
     // monto,
      metodo_pago,
      //comprobante,
      //procesado_por,
      notas
    } = req.body;

    const membresia = await Membresia.findByPk(id_membresia);
  

      if (!membresia) {
        return res.status(404).json({ message: 'Membresía no encontrada' });
      }
      let monto = Number(membresia.monto_pagado);
      let descuento = Number(membresia.descuento_aplicado) || 0;
      

    // 3. Aplicar descuento (si se envía)
    // Ejemplo: descuento = 10 significa 10% de descuento
    let montoFinal = monto;

    
    if (descuento && descuento > 0) {
      montoFinal = monto - (monto * descuento / 100);
    }

    const referencia = req.body.referencia || generarReferencia();

    // Si se subió un archivo, lo agregamos
    const comprobante = req.file ? `img/pagos/${req.file.filename}` : null;
    
    const nuevoPago = await Pago.create({
      id_membresia,
      monto: montoFinal,
      metodo_pago,
      comprobante,
      referencia,
     // procesado_por,
      notas,
      detalle_descuento: descuento || 0
    });

    res.status(201).json({
      message: 'Pago registrado correctamente',
      data: nuevoPago
    });
   
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el pago', error: error.message });
  }
};

exports.editar = async (req, res) => {
  const errores = validationResult(req).array();

  if (errores.length > 0) {
    const data = errores.map(s => ({
     // atributo: s.path,
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
      where: { id: id }
    }).then(data => {
      res.json({ msj: 'Registro actualizado', data });
    }).catch(er => {
      res.json({ msj: 'No se pudo actualizar el registro', error: er });
    });
  }
};

exports.eliminar = async (req, res) => {
  const errores = validationResult(req).array();

  if (errores.length > 0) {
    const data = errores.map(i => ({
     // atributo: i.path,
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


exports.validarImagenPago = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
  }

  uploadComprobantePago(req, res, (err) => {
      if (err instanceof multer.MulterError) {
          res.status(400).json({ msj: "Error al cargar el comprobante", error: err });
      } else if (err) {
          res.status(400).json({ msj: "Error al cargar el comprobante", error: err });
      } else {
          next();
      }
  });
};

exports.GuardarComprobante = async (req, res) => {
  try {
    const { id } = req.query;

    if (!req.file) {
      return res.status(400).json({ msj: "No se recibió ninguna imagen de comprobante" });
    }

    const foto = `img/pagos/${req.file.filename}`;
    const rutaImagen = path.join(process.cwd(), 'public/img/pagos', req.file.filename);

    if (!fs.existsSync(rutaImagen)) {
      return res.status(400).json({ msj: "El comprobante no se encontró en el servidor" });
    }

    const pago = await Pago.findByPk(id); 
    if (!pago) {
      return res.status(404).json({ msj: "Pago no encontrado" });
    }

    pago.comprobante = foto;
    await pago.save();

    res.status(200).json({
      msj: "Comprobante asociado correctamente al pago",
      archivo: foto
    });

  } catch (error) {
    res.status(500).json({ msj: "Error al guardar el comprobante del pago", error: error.message });
  }
};


