const moongose = require('mongoose')

const conectarBD = async () => {
  try {
    const connection = await moongose.connect(
      process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const url = `${connection.connection.host}:${connection.connection.port}`
    console.log(`Conectado en ${url}`)

  } catch (error) {
    console.log(`error:${error.message}`)
    process.exit(1)
  }
}

module.exports = {
  conectarBD
}