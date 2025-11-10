//const { where } = require('sequelize');
const CategoriaEquipo = require('../../models/inventario/categoria_equipo');
const Equipo = require('../../models/inventario/equipo');
const { validationResult } = require('express-validator');


exports.listar = async (req, res) => {
  try {
    const categorias = await CategoriaEquipo.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar las categorías', error: error.message });
  }
};

exports.guardar = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const { nombre_categoria, descripcion } = req.body;
    const nuevaCategoria = await CategoriaEquipo.create({ nombre_categoria, descripcion });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar la categoría', error: error.message });
  }
};

exports.editar = async (req, res) => {
    const errores = validationResult(req).errors;

    if(errores.length > 0){

      const data = errores.map(s =>(
        {
          atributo: s.path,
          msj: s.path
        }
        ));
        console.log(errores);
        res.json({msj: "hay errores", data: data});    
    
    }
    else {
       
        const { id } = req.query;
        const { nombre_categoria, descripcion } = req.body; 
        console.log(req);
        await CategoriaEquipo.update({

          nombre_categoria: nombre_categoria,
          descripcion: descripcion

        }, {where: { id: id } }).then((data) => {
                    console.log(data);
                    res.json({ msj:"Registro Actualizado", data: data});
              }).catch((er) =>{
                console.log(er);
                res.json({ msj:"No se pudo actualizar el registro", error: er })
              });

    }
    
}

exports.eliminar = async (req, res) => {
  const errores = validationResult(req).errors;
  if (errores.length > 0) {
      const data = errores.map(i => (
          {
              atributo: i.path,
              msj: i.msg
          }
      ));
      console.log(errores);
      res.json({ msj: "Hay errores", data: data });
  }
  else {
      const { id } = req.query;
      console.log(req);
      await CategoriaEquipo.destroy({
          where: {
              id: id
          }
      }).then((data) => {
          console.log(data);
          res.json({ msj: "Registro Eliminado", data: data });
      }).catch((er) => {
          console.error(er);
          res.json({ msj: "Error al aliminar los datos", error: er });
      });
  }
}