const Rol = require('../../models/usuarios/rol');
const { validationResult } = require('express-validator');


exports.listarTodosRoles = async (req, res) => {
	try {
		const roles = await Rol.findAll();
		res.status(200).json(roles);
	} catch (error) {
		res.status(500).json({ error: 'Error al listar roles' + error });
	}
};


exports.obtenerRolPorId = async (req, res) => {
	const { id } = req.params;
	try {
		const rol = await Rol.findByPk(id);
		if (!rol) {
			return res.status(404).json({ error: 'Rol no encontrado' });
		}
		res.status(200).json(rol);
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener rol' + error });
	}
};


exports.guardarRol = async (req, res) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	try {
		const { id_rol, nombre, descripcion, fecha_creacion } = req.body;

		const nuevoRol = await Rol.create({
			id_rol,
			nombre,
			descripcion,
			fecha_creacion
		});

		res.status(201).json(nuevoRol);
	} catch (error) {
		res.status(500).json({ error: 'Error al guardar rol' + error });
	}
};


exports.actualizarRol = async (req, res) => {
	const { id } = req.query;
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	try {
		const rol = await Rol.findByPk(id);
		if (!rol) {
			return res.status(404).json({ error: 'Rol no encontrado' });
		}

		await rol.update({
			...req.body
		});

		res.status(200).json(rol);
	} catch (error) {
		res.status(500).json({ error: 'Error al actualizar rol' + error });
	}
};


exports.eliminarRol = async (req, res) => {
	const { id } = req.query;

	try {
		const rol = await Rol.findByPk(id);
		if (!rol) {
			return res.status(404).json({ error: 'Rol no encontrado' });
		}

		await rol.destroy();
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: 'Error al eliminar rol' + error });
	}
};

