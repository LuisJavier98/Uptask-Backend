const moongose = require('mongoose')
const bcrypt = require('bcrypt')

const usuarioSchema = moongose.Schema({
  nombre: {
    type: String,
    require: true,
    trim: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  token: {
    type: String
  },
  confirmado: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
})

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = moongose.model("Usuario", usuarioSchema)
module.exports = {
  Usuario
}