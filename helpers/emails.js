const nodemailer = require('nodemailer')

const emaiRegistro = async (datos) => {
  const { email, nombre, token } = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transport.sendMail({
    from: '"UpTask-Administrador de Proyectos"-<cuentas@uptask.com> ',
    to: email,
    subject: "UpTask-Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `
    <p>Hola ${nombre} Comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta ya esta casi lista , solo debes comprobarla en el siguiente enlace</p>

    <a href="${process.env.FRONT_END}/confirmar/${token}" >Comprueba tu cuenta</a>
    <p>Si tu no creaste esta cuenta , puedes ignorar este mensaje</p>
    `
  })
}
const emaiRecuperar = async (datos) => {
  const { email, nombre, token } = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transport.sendMail({
    from: '"UpTask-Administrador de Proyectos"-<cuentas@uptask.com> ',
    to: email,
    subject: "UpTask-Recupera tu contraseña",
    text: "Recupera tu contraseña",
    html: `
    <p>Hola ${nombre} Renueva tu contraseña</p>
    <p>Para cambiar tu contraseña solo debes ingresar al siguiente enlance</p>

    <a href="${process.env.FRONT_END}/olvide-password/${token}" >Cambiar contraseña</a>
    <p>Si tu no solicitaste la nueva contraseña , puedes ignorar este mensaje</p>
    `
  })
}

module.exports = {
  emaiRegistro,
  emaiRecuperar
}
