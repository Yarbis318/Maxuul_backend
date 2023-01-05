import mongoose from "mongoose";

const serviciosSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    dias: {
      type: String,
      required: true,
      trim: true,
    },
		numCisternas: {
			type: String,
			required: true,
			trim: true,
		},
    documentacion: {
      type: String,
      required: true,
      trim: true,
    },
    requisitosEquipo: {
      type: String,
      required: true,
      trim: true,
    },
    epp: {
      type: String,
      required: true,
      trim: true,
    },
    fechaUltimoServ: {
      type: String,
      required: true,
      trim: true,
    },
    puntosInspeccion: {
      type: String,
      required: true,
      trim: true,
    },
    observaciones: {
      type: String,
      required: true,
      trim: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    reportes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reporte",
      },
    ],

    colaboradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Servicio = mongoose.model("Servicio", serviciosSchema);

export default Servicio;
