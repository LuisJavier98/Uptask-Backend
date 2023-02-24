const { default: mongoose } = require('mongoose')
const moongose = require('mongoose')

const proyectoSchema = moongose.Schema({
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
  fechaEntrega: {
    type: Date,
    default: Date.now()
  },
  cliente: {
    type: String,
    trim: true,
    require: true
  },
  creador: {
    type: moongose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  tareas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tarea"
    }
  ],
  colaboradores: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  ]

}, { timestamps: true })

const Proyectos = moongose.model('Proyecto', proyectoSchema)

module.exports = {
  Proyectos
}