const { auth } = require('../middleware/auth.js')

const express = require('express')
const { obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
  buscarColaborador } = require('../controllers/proyectoControllers.js')

proyectoRouter = express.Router()

proyectoRouter.route('/')
  .get(auth, obtenerProyectos)
  .post(auth, nuevoProyecto)

proyectoRouter.route('/:id')
  .get(auth, obtenerProyecto)
  .patch(auth, editarProyecto)
  .delete(auth, eliminarProyecto)

proyectoRouter.post('/colaboradores', auth, buscarColaborador)
proyectoRouter.post('/colaboradores/:id', auth, agregarColaborador)
proyectoRouter.post('/eliminar-colaborador/:id', auth, eliminarColaborador)




module.exports = { proyectoRouter }