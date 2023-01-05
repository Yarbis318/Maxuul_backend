import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import servicioRoutes from "./routes/servicioRoutes.js";
import reporteRoutes from "./routes/reporteRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

//Configurar Cors (para la comunicación de frontend y backend)
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors(corsOptions));

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/reportes", reporteRoutes);

const hostname =
  process.env.NODE_ENV !== "production" ? "localhost" : "maxuul.com";
const PORT = process.env.PORT || 4000;
const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  //console.log('Conectado a socket.io');

  // Definir los eventos de socket io
  socket.on("abrir proyecto", (proyecto) => {
    socket.join(proyecto);
  });

  socket.on("nueva tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea agragada", tarea);
  });

  /*socket.on('eliminar tarea', (tarea) => {
		const proyecto = tarea.proyecto
		socket.to(proyecto).emit("tarea eliminada", tarea)
	})

	socket.on('actualizar tarea', (tarea) => {
		const proyecto = tarea.proyecto._id
		socket.to(proyecto).emit('tarea actualizada', tarea)
	})

	socket.on('cambiar estado', (tarea) => {
		const proyecto = tarea.proyecto._id
		socket.to(proyecto).emit('nuevoestado', tarea)
	})*/

  socket.on("abrir servicio", (servicio) => {
    socket.join(servicio);
  });

  socket.on("nuevo reporte", (reporte) => {
    const servicio = reporte.servicio;
    socket.to(servicio).emit("reporte agregado", reporte);
  });

  socket.on("eliminar reporte", (reporte) => {
    const servicio = reporte.servicio;
    socket.to(servicio).emit("reporte eliminado", reporte);
  });
});
