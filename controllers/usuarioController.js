const { emaiRegistro, emaiRecuperar } = require("../helpers/emails.js")
const { generarId } = require("../helpers/generarId.js")
const { generarJWT } = require("../helpers/generarJWT.js")
const { Usuario } = require("../models/Usuario.js")



const registrar = async (req, res) => {
  const { email } = req.body
  const existeUsuario = await Usuario.findOne({ email })

  if (existeUsuario) {
    const error = new Error('Usuario ya registrado')
    return res.status(400).json({ msg: error.message })
  }
  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId()
    const usuarioAlmacenado = await usuario.save()
    emaiRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token
    })
    res.json({ usuarioAlmacenado })
  } catch (error) {
    console.log(error)
  }
}

const autenticar = async (req, res) => {
  const { email, password } = req.body
  const usuario = await Usuario.findOne({ email })
  if (!usuario) {
    const error = new Error('Usuario no existe')
    return res.status(404).json({ "msg": error.message })
  }
  if (!usuario.confirmado) {
    const error = new Error('Tu cuenta no ha sido confirmada')
    return res.status(403).json({ "msg": error.message })
  }
  if (await usuario.comprobarPassword(password)) {
    res.status(200).json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id, usuario.nombre)
    })
  } else {
    const error = new Error('Tu contraseña es incorrecta')
    return res.status(404).json({ "msg": error.message })
  }
}

const confirmar = async (req, res) => {
  const { token } = req.params
  const usuarioConfirmar = await Usuario.findOne({ token })

  if (!usuarioConfirmar) {
    const error = new Error('Token no valido')
    return res.status(404).json({ msg: error.message })
  }
  try {
    usuarioConfirmar.confirmado = true
    usuarioConfirmar.token = ''
    await usuarioConfirmar.save();
    res.json({ msg: 'Usuario confirmado correctamente' })

  } catch (error) {
    console.log(error)
  }
}

const olvidePassword = async (req, res) => {
  const { email } = req.body
  const usuario = await Usuario.findOne({ email })
  if (!usuario) {
    const error = new Error('Usuario no existe')
    return res.status(404).json({ "msg": error.message })
  }

  try {
    usuario.token = generarId()
    await usuario.save()

    emaiRecuperar({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
    })

    res.json({ msg: 'Hemos enviado un email con las instrucciones' })
  } catch (error) {
    console.log(error)
  }
}




const comprobarToken = async (req, res) => {
  const { token } = req.params
  const tokenValido = await Usuario.findOne({ token })
  if (tokenValido) {
    res.json({ msg: 'Token válido' })
  }
  else {
    const error = new Error('Token no válido')
    return res.status(404).json({ "msg": error.message })
  }

}


const nuevoPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const usuario = await Usuario.findOne({ token })
  if (!usuario) {
    const error = new Error('Token no válido')
    return res.status(404).json({ msg: error.message })
  }

  try {
    usuario.password = password
    usuario.token = ''
    await usuario.save()
    return res.json({ msg: 'Password modificado correctamente' })

  } catch (error) {
    console.log(error)
  }

}

const perfil = async (req, res) => {
  const { usuario } = req
  res.json(usuario)
}


module.exports = {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil
}