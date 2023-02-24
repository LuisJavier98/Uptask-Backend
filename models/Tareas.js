const moongose = require('mongoose')

const schemaTareas = moongose.Schema({
  nombre: {
    type: String,
    trim: true,
    require: true
  },
  descripcion: {
    type: String,
    trim: true,
    require: true
  },
  estado: {
    type: Boolean,
    default: false
  },
  fechaEntrega: {
    type: Date,
    require: true,
    default: Date.now()
  },
  prioridad: {
    type: String,
    require: true,
    enum: ['Baja', 'Media', 'Alta']
  },
  proyecto: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Proyecto"
  },
  completado: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
}, {
  timestamps: true
})


const Tarea = moongose.model('Tarea', schemaTareas)

module.exports = {
  Tarea
}