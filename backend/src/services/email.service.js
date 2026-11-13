import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_FROM,
} from "../config/configEnv.js";

let transporter;

function getTransporter() {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("El servicio de correo no está configurado.");
  }

  transporter ??= nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
}

export async function enviarCodigoVerificacion({ correo, codigo }) {
  await getTransporter().sendMail({
    from: EMAIL_FROM,
    to: correo,
    subject: "Verifica tu cuenta en UBBICA",
    text: `Hola:

  Recibimos una solicitud para registrar tu correo en UBBICA.

  Tu código de verificación es: ${codigo}

  Este código vence en 15 minutos. Si no solicitaste este registro, puedes ignorar este mensaje.

  Saludos,
  Equipo UBBICA`,
  });

}

// Aviso de cuenta de funcionario creada con su contraseña temporal de 6 dígitos (RF35)
export async function enviarPasswordTemporal({ correo, nombre, claveTemporal }) {
  await getTransporter().sendMail({
    from: EMAIL_FROM,
    to: correo,
    subject: "Tu cuenta de funcionario en UBBICA",
    text: `Hola ${nombre}:

  Se creó tu cuenta de funcionario en UBBICA.

  Tu contraseña temporal es: ${claveTemporal}

  Úsala para ingresar con tu correo institucional. En tu primer ingreso deberás reemplazarla por una contraseña propia.

  La contraseña temporal vence en 7 días. Si vence o la pierdes, contacta al administrador.

  Saludos,
  Equipo UBBICA`,
  });
}
