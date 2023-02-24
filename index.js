const express = require('express')
const { conectarBD } = require('./config/db.js')
const dotenv = require('dotenv')
const { usuarioRouter } = require('./routes/usuarioRoutes.js')
const { proyectoRouter } = require('./routes/proyectoRoutes.js')
const { tareasRoute } = require('./routes/tareasRoutes.js')
const cors = require('cors')

const app = express()
dotenv.config()
conectarBD()

app.use(express.json())

// const whiteList = [process.env.FRONT_END]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whiteList.includes(origin)) {
//       callback(null, true)
//     }
//     else {
//       callback(new Error('Error de cors'))

//     }
//   }
// }
// app.use(cors(corsOptions))


app.use('/api/usuarios', usuarioRouter)
app.use('/api/proyectos', proyectoRouter)
app.use('/api/tareas', tareasRoute)

const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`)
})

const { Server } = require('socket.io')
const io = new Server(servidor, {
  pingTimeout: 60000,
  // cors: {
  //   origin: process.env.FRONT_END
  // }
})

io.on('connection', (socket) => {
  console.log('Scoket conectado')

  socket.on('abrir proyecto', proyecto => {
    socket.join(proyecto)
  })

  socket.on('nueva tarea', (tarea) => {
    const proyecto = tarea.proyecto
    socket.to(proyecto).emit('tarea agregada', tarea)
  })

  socket.on('eliminar tarea', tarea => {
    const proyecto = tarea.proyecto
    socket.to(proyecto).emit('tarea eliminada', tarea)
  })

  socket.on('editar tarea', tarea => {
    const proyecto = tarea.proyecto
    socket.to(proyecto).emit('tarea editada', tarea)
  })
  socket.on('estado tarea', tarea => {
    const proyecto = tarea.proyecto._id
    socket.to(proyecto).emit('estado corregido', tarea)
  })
})