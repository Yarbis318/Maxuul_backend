import mongoose from "mongoose";

const reporteSchema = mongoose.Schema(
  {
    nombreservicio: {
      type: String,
      required: true,
    },
    sedimento: {
      type: String,
      required: true,
    },
    objetos: {
      type: String,
      required: true,
    },
    piso: {
      type: String,
      required: true,
    },
    paredes: {
      type: String,
      required: true,
    },
    techo: {
      type: String,
      required: true,
    },
    succiones: {
      type: String,
      required: true,
    },
    numerosucciones: {
      type: String,
      required: true,
    },
    escaleras: {
      type: String,
      required: true,
    },
    numeroescaleras: {
      type: String,
      required: true,
    },
    vasoscomunicantes: {
      type: String,
      required: true,
    },
    observaciones: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    estado: {
      type: String,
      required: true,
      enum: ["Realizado", "Proceso"]
    },
    completado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    }
  },
  {
    timestamps: true,
  }
);

const Reporte = mongoose.model("Reporte", reporteSchema);

export default Reporte;
