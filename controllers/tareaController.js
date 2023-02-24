const { Proyectos } = require("../models/Proyecto")
const { Tarea } = require("../models/Tareas")

const agregarTarea = async (req, res) => {

  const { proyecto } = req.body
  const existeProyecto = await Proyectos.findById(proyecto)
  if (!existeProyecto) {
    const error = new Error('El proyecto no existe')
    return res.status(404).json({ msg: error.message })
  }

  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('No tienes los permisos para añadir tareas')
    return res.status(404).json({ msg: error.message })
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body)
    existeProyecto.tareas.push(tareaAlmacenada._id)
    await existeProyecto.save()
    res.json(tareaAlmacenada)
  } catch (error) {
    console.log(error)
  }

}
const obtenerTarea = async (req, res) => {
  const { id } = req.params
  const tarea = await Tarea.findById(id).populate('proyecto')
  if (!tarea) {
    const error = new Error('Tarea no encontrada')
    return res.status(404).json({ msg: error.message })
  }
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no valida')
    return res.status(403).json({ msg: error.message })
  }
  res.json(tarea)


}


const actualizarTarea = async (req, res) => {
  const { id } = req.params
  const { nombre, prioridad, descripcion, fechaEntrega } = req.body
  const encontrarTarea = await Tarea.findById(id).populate('proyecto')
  if (!encontrarTarea) {
    const error = new Error('Tarea no encontrada')
    return res.status(404).json({ msg: error.message })
  }
  if (encontrarTarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no valida')
    return res.status(403).json({ msg: error.message })
  }
  try {
    await Tarea.findByIdAndUpdate({ _id: id }, {
      nombre, prioridad, descripcion, fechaEntrega
    })
    const tareaActualizada = await Tarea.findById(id)
    res.status(200).json(tareaActualizada)

  } catch (error) {
    res.status(400).json({ msg: error.message })
  }


}
const eliminarTarea = async (req, res) => {

  const { id } = req.params
  const tarea = await Tarea.findById(id).populate('proyecto')
  if (!tarea) {
    const error = new Error('Tarea no encontrada')
    return res.status(404).json({ msg: error.message })
  }
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no valida')
    return res.status(403).json({ msg: error.message })
  }
  try {
    await Tarea.findByIdAndDelete(id)
    const proyectos = await Proyectos.findById(tarea.proyecto._id)
    proyectos.tareas = proyectos.tareas.filter(tarea => tarea._id.toString() !== id.toString())
    await proyectos.save()
    res.status(200).json({ msg: 'Tarea eliminada correctamente' })

  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}


const cambiarEstado = async (req, res) => {
  const { id } = req.params
  const tarea = await Tarea.findById(id).populate('proyecto')
  if (!tarea) {
    return res.status(404).json({ msg: 'Tarea no encontrada' })
  }
  if (tarea.proyecto.creador.toString() == req.usuario._id.toString() || tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() == req.usuario._id)) {
    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id
    await tarea.save()
    const tareaAlamcenada = await Tarea.findById(id).populate('proyecto').populate('completado')
    res.status(200).json(tareaAlamcenada)
  } else {
    return res.status(404).json({ msg: 'Accion no valida' })

  }

}

module.exports = {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado
}