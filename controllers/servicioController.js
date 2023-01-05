import Servicio from "../models/Servicio.js"
import Usuario from "../models/Usuario.js"

const obtenerServicios = async (req, res) => {
	const servicios = await Servicio.find({
		$or: [
			{ colaboradores: { $in: req.usuario } },
			{ creador: { $in: req.usuario } },
		],
	}).select("-reportes")
	res.json(servicios)
}

const nuevoServicio = async (req, res) => {
	const servicio = new Servicio(req.body)
	servicio.creador = req.usuario._id

	try {
		const servicioAlmacenado = await servicio.save()
		res.json(servicioAlmacenado)
	} catch (error) {
		console.log(error)
	}
}

const obtenerServicio = async (req, res) => {
	const { id } = req.params

	const servicio = await Servicio.findById(id)
		.populate({
			path:"reportes",
			populate: { path: "completado", select: "nombre" },
		})
		.populate("colaboradores", "nombre email")

	if (!servicio) {
		const error = new Error("No Encontrado")
		return res.status(404).json({ msg: error.message })
	}

	if (
		servicio.creador.toString() !== req.usuario._id.toString() && !servicio.colaboradores.some(
			(colaboradorServicios) => colaboradorServicios._id.toString() === req.usuario._id.toString() 
		)
	) {
		const error = new Error("Acción No Válida")
		return res.status(401).json({ msg: error.message })
	}

	res.json(servicio)
}

const editarServicio = async (req, res) => {
	const { id } = req.params

	const servicio = await Servicio.findById(id)

	if (!servicio) {
		const error = new Error("No Encontrado")
		return res.status(401).json({msg: error.message})
	}

	if (servicio.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error("Acción No Válida")
		return res.status(401).json({ msg: error.message })
	}

	servicio.nombre = req.body.nombre || servicio.nombre
	servicio.fecha = req.body.fecha || servicio.fecha
	servicio.dias = req.body.dias || servicio.dias
	servicio.documentacion = req.body.dias || servicio.documentacion
	servicio.requisitosEquipo = req.body.requisitosEquipo || servicio.requisitosEquipo
	servicio.epp = req.body.epp || servicio.epp
	servicio.fechaUltimoServ = req.body.fechaUltimoServ || servicio.fechaUltimoServ
	servicio.puntosInspeccion = req.body.puntosInspeccion || servicio.puntosInspeccion
	servicio.observaciones = req.body.observaciones || servicio.observaciones

	try {
		const servicioAlmacenado = await servicio.save()
		res.json(servicioAlmacenado)
	} catch (error) {
		console.log(error)
	}
}

const eliminarServicio = async (req, res) => {
	const { id } = req.params

	const servicio = await Servicio.findById(id)

	if (!servicio) {
		const error = new Error("No Encontrado")
		return res.status(404).json({ msg: error.message })
	}

	if (servicio.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error("Acción No Válida")
		return res.status(401).json({ msg: error.message })
	}

	try {
		await servicio.deleteOne()
		res.json({ msg: "Servicio Eliminado" })
	} catch (error) {
		console.log(error)
	}
}

const buscarColaboradorServicios = async (req, res) => {
	const { email } = req.body
	const usuario = await Usuario.findOne({ email }).select(
	"-confirmado -createAt -password -token -updateAt -__v"
	)

	if (!usuario) {
		const error = new Error("Usuario no encontrado")
		return res.status(404).json({ msg: error.message })
	}

	res.json(usuario)
}

const agregarColaboradorServicios = async (req, res) => {
	const servicio = await Servicio.findById(req.params.id)

	if (!servicio) {
		const error = new Error("Servicio No Encontrado")
		return res.status(404).json({ msg: error.message })
	}

	if (servicio.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error("Acción no válida")
		return res.status(404).json({ msg: error.message })
	}

	const { email } = req.body
	const usuario = await Usuario.findOne({ email }).select(
		"-confirmado -createAt -password -token -updateAt -__v"
	)

	if (!usuario) {
		const error = new Error("Usuario no encontrado")
		return res.status(404).json({ msg: error.message })
	}

	// El colaborador no es el administrador del servicio
	if (servicio.creador.toString() === usuario._id.toString()) {
		const error = new Error("El Creador del Servicio no puede ser colaborador")
		return res.status(404).json({ msg: error.message })
	}

	// Revisar que no este ya agregado al servicio
	if (servicio.colaboradores.includes(usuario._id)) {
		const error = new Error("El Usuario ya pertenece al Proyecto")
		return res.status(404).json({ msg: error.message })
	}

	// Esta bien, se puede agregar
	servicio.colaboradores.push(usuario._id)
	await servicio.save()
	res.json({ msg: "Colaborador Agregado Correctamente" })
}

const eliminarColaboradorServicios = async (req, res) => {
	const servicio = await Servicio.findById(req.params.id)

	if (!servicio) {
		const error = new Error("Servicio No Encontrado")
		return res.startus(404).json({ msg: error.message })
	}

	if (servicio.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error("Acción no válida")
		return res.status(404).json({ msg: error.massage })
	}

	//Esta bien, se puede eliminar
	servicio.colaboradores.pull(req.body.id)
	await servicio.save()
	res.json({ msg: "Colaborador Eliminado Correctamente" })
}

export {
	obtenerServicios,
	nuevoServicio,
	obtenerServicio,
	editarServicio,
	eliminarServicio,
	buscarColaboradorServicios,
	agregarColaboradorServicios,
	eliminarColaboradorServicios,
}
