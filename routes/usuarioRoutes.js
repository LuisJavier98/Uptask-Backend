
const express = require('express')
const { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } = require('../controllers/usuarioController')
const { auth } = require('../middleware/auth')
const usuarioRouter = express.Router()

//Creacion , registro y



usuarioRouter.post('/', registrar)
usuarioRouter.post('/login', autenticar)
usuarioRouter.get('/confirmar/:token', confirmar)
usuarioRouter.post('/olvide-password', olvidePassword)
usuarioRouter.route('/olvide-password/:token')
  .get(comprobarToken)
  .post(nuevoPassword)

usuarioRouter.get('/perfil', auth, perfil)



module.exports = {
  usuarioRouter
}