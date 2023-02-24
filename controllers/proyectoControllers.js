const { Proyectos } = require("../models/Proyecto")
const { Tarea } = require("../models/Tareas")
const { Usuario } = require("../models/Usuario")



const obtenerProyectos = async (req, res) => {

  try {
    const proyectos = await Proyectos.find({
      '$or': [
        { 'creador': { $in: req.usuario._id } },
        { 'colaboradores': { $in: req.usuario._id } }

      ]
    }).select('-tareas')
    res.status(200).json(proyectos)
  } catch (error) {
    res.status(400).json({ mensaje: error.mensaje })
  }
}

const nuevoProyecto = async (req, res) => {
  const { nombre, descripcion, fechaEntrega, cliente } = req.body
  if (nombre && descripcion && fechaEntrega && cliente) {
    try {
      const proyecto = await new Proyectos({ nombre, descripcion, cliente, fechaEntrega })
      proyecto.creador = req.usuario._id
      const proyectoAlmacenado = await proyecto.save()
      console.log(proyectoAlmacenado)
      res.json(proyectoAlmacenado)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
    return
  }
  else {
    res.status(400).json({
      msg: 'Datos incompletos', fields: {
        nombre: 'STRING',
        descripcion: 'STRING',
        cliente: 'STRING'
      }
    })
  }
}


const obtenerProyecto = async (req, res) => {
  const { id } = req.params
  try {
    const proyecto = await Proyectos.findById(id).populate({ path: 'tareas', populate: { path: 'completado', select: "nombre" } }).populate('colaboradores', "nombre email ")
    if (proyecto.creador.toString() === req.usuario.id.toString() || proyecto.colaboradores.some(colaborador => colaborador._id.toString() == req.usuario._id.toString())) {
      const Tareas = await Tarea.find().where('proyecto').equals(proyecto._id)

      return res.status(200).json({ proyecto, Tareas })
    }
    else {
      return res.status(400).json({ msg: 'Accion no valida' })
    }
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }

}


const editarProyecto = async (req, res) => {
  const { id } = req.params
  try {
    const proyecto = await Proyectos.findById(id)
    if (proyecto.creador.toString() === req.usuario.id.toString()) {
      const editarProyecto = await Proyectos.findOneAndUpdate({ _id: id }, req.body)
      await editarProyecto.save()
      return res.status(200).json({ msg: 'Proyecto Actualizado' })
    }
    else {
      return res.status(400).json({ msg: 'Accion no valida' })
    }
  } catch (error) {
    res.status(400).json({ msg: error.message })

  }
}

const eliminarProyecto = async (req, res) => {
  const { id } = req.params
  try {
    const proyecto = await Proyectos.findById(id)
    if (proyecto.creador.toString() === req.usuario.id.toString()) {
      await proyecto.deleteOne()
      return res.status(200).json({ msg: 'Proyecto Eliminado' })
    }
    else {
      return res.status(400).json({ msg: 'Accion no valida' })
    }

  } catch (error) {
    res.json(400).json({ msg: error.message })
  }

}

const buscarColaborador = async (req, res) => {
  const { email } = req.body
  const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v')

  if (!usuario) {
    const error = new Error("Usuario no encontrado")
    return res.status(404).json({ msg: error.message })
  }
  res.json(usuario)

}
const agregarColaborador = async (req, res) => {
  const { email } = req.body
  const proyecto = await Proyectos.findById(req.params.id)
  const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v')
  if (!usuario) {
    const error = new Error("Usuario no encontrado")
    return res.status(404).json({ msg: error.message })
  }

  if (!proyecto) {
    const error = new Error('Proyecto No Encontrado')
    return res.status(404).json({ msg: error.message })
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no valida')
    return res.status(404).json({ msg: error.message })
  }

  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error('El creador del proyecto no puede ser colaborador')
    return res.status(404).json({ msg: error.message })
  }

  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error('El usuario ya pertenece al proyecto')
    return res.status(404).json({ msg: error.message })
  }

  proyecto.colaboradores.push(usuario._id)
  await proyecto.save()
  res.json({ msg: 'Colaborador agregado correctamente' })
}

const eliminarColaborador = async (req, res) => {

  const proyecto = await Proyectos.findById(req.params.id)

  if (!proyecto) {
    const error = new Error('Proyecto No Encontrado')
    return res.status(404).json({ msg: error.message })
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no valida')
    return res.status(404).json({ msg: error.message })
  }

  proyecto.colaboradores.pull(req.body.id)
  await proyecto.save()
  res.json({ msg: 'Colaborador eliminado correctamente' })
}




module.exports = {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  buscarColaborador
}



