import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
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
    from: EMAIL_USER,
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
