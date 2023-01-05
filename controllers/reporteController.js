import Servicio from "../models/Servicio.js"
import Reporte from "../models/Reporte.js"

const agregarReporte = async (req, res) => {
	const { servicio } = req.body

	const existeServicio = await Servicio.findById(servicio)

	if (!existeServicio) {
		const error = new Error("El servicio no existe")
		return res.status(404).json({ msg: error.message })
	}

	if (existeServicio.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error("No tienes los permisos para añadir reportes")
		return res.status(403).json({ msg: error.message })
	}

	try {
		const reporteAlmacenado = await Reporte.create(req.body)
		//Almacenar el ID en el servicio
		existeServicio.reportes.push(reporteAlmacenado._id)
		await existeServicio.save()
		res.json(reporteAlmacenado)
	} catch (error) {
		console.log(error)
	}
}

const obtenerReporte = async (req, res) => {
	const { id } = req.params

	const reporte = await Reporte.findById(id).populate("servicio")

	if (!reporte) {
		const error = new Error("Reporte no encontrado")
		return res.status(404).json({ msg: error.message })
	}

	if (reporte.servicio.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error("Acción no válida")
		return res.status(403).json({ msg: error.message })
	}

	res.json(reporte)
}

const actualizarReporte = async (req, res) => {
	const { id } = req.params

	const reporte = await Reporte.findById(id).populate("servicio")

	if (!reporte) {
		const error = new Error("Reporte no encontrado")
		return res.status(404).json({ msg: error.message })
	}

	if (reporte.servicio.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error("Acción no válida")
		return res.status(403).json({ msg: error.message })
	}

	reporte.nombreservicio = req.body.nombreservicio ||reporte.nombreservicio;
	reporte.sedimento = req.body.sedimento ||reporte.sedimento;
	reporte.objetos = req.body.objetos ||reporte.objetos;
	reporte.piso = req.body.piso ||reporte.piso;
	reporte.paredes = req.body.paredes ||reporte.paredes;
	reporte.techo = req.body.techo ||reporte.techo;
	reporte.succiones = req.body.succiones ||reporte. succiones;
	reporte.numerosucciones = req.body.numerosucciones ||reporte.numerosucciones;
	reporte.escaleras = req.body.escaleras ||reporte.escaleras;
	reporte.numeroescaleras = req.body.numeroescaleras ||reporte.numeroescaleras;
	reporte.vasoscomunicantes = req.body.vasoscomunicantes ||reporte.vasoscomunicantes;
	reporte.observaciones = req.body.observaciones ||reporte.observaciones;
	reporte.estado = req.body.estado ||reporte.estado;
	//reporte.status = req.body.status ||reporte.status;
	//reporte.completado = req.body.completado ||reporte.completado;

	try {
		const reporteAlmacenado = await reporte.save()
		res.json(reporteAlmacenado)
	} catch (error) {
		console.log(error)
	}
}

const eliminarReporte = async (req, res) => {
	const { id } = req.params

	const reporte = await Reporte.findById(id).populate("servicio")

	if(!reporte) {
		const error = new Error("Reporte no encontrado")
		return res.status(404).json({ msg: error.message })
	}

	if (reporte.servicio.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error("Acción no válida")
		return res.status(403).json({ msg: error.message })
	}

	try {
		const servicio = await Servicio.findById(reporte.servicio)
		servicio.reportes.pull(reporte._id)

		await Promise.allSettled([ await servicio.save(), await reporte.deleteOne() ])

		res.json({ msg: "El reporte se eliminó" })
	} catch (error) {
		console.log(error)
	}
}

const cambiarEstado = async (req,res) => {
	const { id } = req.params

	const reporte = await Reporte.findById(id).populate("servicio")

	if (!reporte) {
		const error = new Error("Reporte no encontrado")
		return res.status(404).json({ msg: error.message })
	}

	if (
		reporte.servicio.creador.toString() !== req.usuario._id.toString() && !reporte.servicio.colaboradoresServicios.some(
			(colaboradorServicios) => colaboradorServicios._id.toString() === req.usuario._id.toString()
		)
	) {
		const error = new Error("Acción no válida")
		return res.status(403).json({ msg: error.messge })
	}
	reporte.estado = !reporte.estado
	reporte.completado = req.usuario._id
	await reporte.save()

	const reporteAlmacenado = await Reporte.findById(id)
		.populate("servicio")
		.populate("completado")

	res.json(reporteAlmacenado)
}

export {
	agregarReporte,
	obtenerReporte,
	actualizarReporte,
	eliminarReporte,
	cambiarEstado,
}
