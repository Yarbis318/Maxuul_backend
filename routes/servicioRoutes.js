import express from 'express'

import {
	obtenerServicios,
	nuevoServicio,
	obtenerServicio,
	editarServicio,
	eliminarServicio,
	agregarColaboradorServicios,
	eliminarColaboradorServicios,
  buscarColaboradorServicios,
} from "../controllers/servicioController.js"
import checkAuth from "../middleware/checkAuth.js"

const router = express.Router()

router
	.route("/")
	.get(checkAuth, obtenerServicios)
	.post(checkAuth, nuevoServicio);

router
	.route("/:id")
	.get(checkAuth, obtenerServicio)
	.put(checkAuth, editarServicio)
	.delete(checkAuth, eliminarServicio);

router.post("/colaboradores", checkAuth, buscarColaboradorServicios);
router.post("/colaboradores/:id", checkAuth, agregarColaboradorServicios)
router.post("/eliminar-colaborador-servicios/:id", checkAuth, eliminarColaboradorServicios)

export default router
