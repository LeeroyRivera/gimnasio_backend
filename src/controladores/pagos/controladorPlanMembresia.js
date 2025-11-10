const PlanMembresia = require('../../models/pagos/plan_membresia');
const { validationResult } = require('express-validator');

exports.listar = async (req, res) => {
  try {
    const planes = await PlanMembresia.findAll();
    res.status(200).json(planes);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar los planes de membresía', error: error.message });
  }
};

exports.guardar = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const { nombre_plan, descripcion, precio, duracion_dias, acceso_gimnasio, acceso_entrenador, acceso_asistente_virtual, estado } = req.body;

    const nuevoPlan = await PlanMembresia.create({
      nombre_plan,
      descripcion,
      duracion_dias,
      acceso_gimnasio,
      acceso_entrenador,
      acceso_asistente_virtual,
      estado
    });

    res.status(201).json(nuevoPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el plan de membresía', error: error.message });
  }
};

exports.editar = async (req, res) => {
  const errores = validationResult(req).array();

  if (errores.length > 0) {
    const data = errores.map(s => ({
      //atributo: s.path,
      msj: s.msg
    }));
    res.json({ msj: 'Hay errores', data });
  } else {
    const { id } = req.query;
    const {
      nombre_plan,
      descripcion,
      duracion_dias,
      acceso_gimnasio,
      acceso_entrenador,
      acceso_asistente_virtual,
      estado
    } = req.body;

    await PlanMembresia.update({
      nombre_plan,
      descripcion,
      duracion_dias,
      acceso_gimnasio,
      acceso_entrenador,
      acceso_asistente_virtual,
      estado
    }, {
      where: { id_plan: id }
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
    //  atributo: i.path,
      msj: i.msg
    }));
    res.json({ msj: 'Hay errores', data });
  } else {
    const { id } = req.query;

    await PlanMembresia.destroy({
      where: { id_plan: id }
    }).then(data => {
      res.json({ msj: 'Registro eliminado', data });
    }).catch(er => {
      res.json({ msj: 'Error al eliminar el registro', error: er });
    });
  }
};
