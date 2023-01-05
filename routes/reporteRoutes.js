import express from "express"

import {
  agregarReporte,
  obtenerReporte,
  actualizarReporte,
  eliminarReporte,
  cambiarEstado,
} from "../controllers/reporteController.js"
import checkAuth from "../middleware/checkAuth.js"

const router = express.Router()

router.post("/", checkAuth, agregarReporte)
router
  .route("/:id")
  .get(checkAuth, obtenerReporte)
  .put(checkAuth, actualizarReporte)
  .delete(checkAuth, eliminarReporte)

router.post("/estado/:id", checkAuth, cambiarEstado)
export default router


