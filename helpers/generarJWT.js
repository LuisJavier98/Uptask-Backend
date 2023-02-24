const jwt = require('jsonwebtoken')

const generarJWT = (id, nombre) => {
  return jwt.sign(
    { id: id, nombre: nombre },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  )
}

module.exports = {
  generarJWT
}
