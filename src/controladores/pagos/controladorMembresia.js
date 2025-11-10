const { Model } = require('sequelize');
const Membresia = require('../../models/pagos/membresia');
const PlanMembresia = require('../../models/pagos/plan_membresia');
const { validationResult } = require('express-validator');


exports.listar = async (req, res) => {
  try {
    const membresias = await Membresia.findAll({
      include: [
        {
          model: PlanMembresia,
          as: 'plan',
          attributes: ['id', 'nombre_plan', 'descripcion', 'duracion_dias']
        }
      ]
    });
    res.status(200).json(membresias);
  } catch (error) {
    res.status(500).json({
      message: 'Error al listar las membresías',
      error: error.message
    });
  }
};
/*exports.listar = async (req, res) => {
  try {
    const membresias = await Membresia.findAll();
    res.status(200).json(membresias);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar las membresías', error: error.message });
  }
};*/

exports.guardar = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  
  try {
    const {
     // id_cliente,
      id_plan,
      fecha_inicio,
      fecha_vencimiento,
      estado,
      monto_pagado,
      descuento_aplicado,
      notas
    } = req.body;


    const plan = await PlanMembresia.findByPk(id_plan);
    if (!plan) {
      return res.status(404).json({ message: 'El plan de membresía no existe' });
    }

    const nuevaMembresia = await Membresia.create({
      //id_cliente,
      id_plan,
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
  const errores = validationResult(req).array();

  if (errores.length > 0) {
    const data = errores.map(s => ({
    //  atributo: s.path,
      msj: s.msg
    }));
    res.json({ msj: 'Hay errores', data });
  } else {
    const { id } = req.query;
    const {
      //id_cliente,
      id_plan,
      fecha_inicio,
      fecha_vencimiento,
      estado,
      monto_pagado,
      descuento_aplicado,
      notas
    } = req.body;
    
    
    // 🔹 Verificar si la membresía existe
    const membresia = await Membresia.findOne({
      where: { id: id } // <-- Usa el nombre real de tu columna
    });

    if (!membresia) {
      return res.status(404).json({ message: 'Membresía no encontrada' });
    }

    // 🔹 Verificar si el plan nuevo (si se cambia) existe
    if (id_plan) {
      const plan = await PlanMembresia.findByPk(id_plan);
      if (!plan) {
        return res.status(404).json({ message: 'El nuevo plan de membresía no existe' });
      }
    }
   
    await Membresia.update({
      //id_cliente,
      id_plan,
      fecha_inicio,
      fecha_vencimiento,
      estado,
      monto_pagado,
      descuento_aplicado,
      notas
    }, {
      
      where: { id: id }}
    
    );
    // esta variable busca el registro en la base y lo muestra
    const membresiaActualizada = await Membresia.findOne({
      where: { id: id },
      include: [
        {
          model: PlanMembresia,
          as: 'plan',
          attributes: ['id', 'nombre_plan', 'descripcion', 'duracion_dias']
        }
      ]
    });

    res.json({
      msj: 'Registro actualizado correctamente',
      data: membresiaActualizada
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

    await Membresia.destroy({
      where: { id: id }
    }).then(data => {
      res.json({ msj: 'Registro eliminado', data });
    }).catch(er => {
      res.json({ msj: 'Error al eliminar el registro', error: er });
    });
  }
};



/*.then(data => {
      res.json({ msj: 'Registro actualizado', data });
    }).catch(er => {
      res.json({ msj: 'No se pudo actualizar el registro', error: er });
    });*/

