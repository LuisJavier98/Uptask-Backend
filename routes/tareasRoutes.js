const express = require('express')
const { obtenerTarea, actualizarTarea, agregarTarea, eliminarTarea, cambiarEstado } = require('../controllers/tareaController')
const { auth } = require('../middleware/auth')

const tareasRoute = express.Router()

tareasRoute.post('/', auth, agregarTarea)
tareasRoute.route('/:id')
  .get(auth, obtenerTarea)
  .patch(auth, actualizarTarea)
  .delete(auth, eliminarTarea)


tareasRoute.post('/estado/:id', auth, cambiarEstado)









module.exports = {
  tareasRoute
}