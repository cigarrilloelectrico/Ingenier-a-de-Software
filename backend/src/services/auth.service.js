import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { prisma } from "../config/configDb.js";
import { getJwtSecret, SESSION_MAX_MS, VERIFICATION_CODE_TTL_MS } from "../config/configEnv.js";
import { hashToken } from "../middleware/auth.middleware.js";
import { enviarCodigoVerificacion } from "./email.service.js";

const CODIGO_EXPIRACION_MS = VERIFICATION_CODE_TTL_MS;

// Registra un alumno no verificado y envía el código de verificación por correo
export const registrarAlumnoService = async ({ correo }) => {
  // 1. Normalizar el correo y verificar que no esté registrado
  const correoNormalizado = correo.trim().toLowerCase();
  const existente = await prisma.usuario.findUnique({ where: { correo: correoNormalizado } });

  if (existente) {
    return {
      error: "El correo electrónico ya está registrado.",
      statusCode: 409,
    };
  }

  // 2. Generar y proteger el código de verificación
  const codigo = String(randomInt(100000, 1000000));
  const codigoHash = await bcrypt.hash(codigo, 10);

  // 3. Crear la cuenta y guardar el código con una vigencia de 15 minutos
  const usuario = await prisma.usuario.create({
    data: {
      correo: correoNormalizado,
      rol: "Alumno",
      estado: "NoVerificado",
      segundoFactorActivo: true,
      codigosVerificacion: {
        create: {
          codigoHash,
          proposito: "VerificarCorreo",
          expiraAt: new Date(Date.now() + CODIGO_EXPIRACION_MS),
        },
      },
    },
    select: { usuarioId: true, correo: true, estado: true },
  });

  // 4. Enviar el código; si falla, evitar dejar una cuenta sin posibilidad de verificar
  try {
    await enviarCodigoVerificacion({ correo: usuario.correo, codigo });
  } catch (error) {
    await prisma.usuario.delete({ where: { usuarioId: usuario.usuarioId } });
    throw error;
  }

  // 5. No devolver el código ni el hash al cliente
  return {
    usuario: {
      usuarioId: usuario.usuarioId,
      correo: usuario.correo,
      estado: usuario.estado,
    },
  };
};

const loginService = async ({ correo, password, rolPermitido }) => {
  const correoNormalizado = correo.trim().toLowerCase();

  const usuario = await prisma.usuario.findUnique({
    where: { correo: correoNormalizado },
    include: {
      carrera: { select: { nombre: true } },
    },
  });

  const now = new Date();

  // 1. Verificar si la cuenta está en período de bloqueo temporal (15 minutos tras 5 fallos)
  if (usuario && usuario.bloqueoHastaAt && usuario.bloqueoHastaAt > now) {
    const minutosRestantes = Math.ceil(
      (usuario.bloqueoHastaAt.getTime() - now.getTime()) / (60 * 1000)
    );
    return {
      error: `Demasiados intentos fallidos consecutivos. Cuenta bloqueada temporalmente. Intente nuevamente en ${minutosRestantes} minuto(s).`,
      statusCode: 423,
    };
  }

  // 2. Validar existencia, rol permitido y contraseña con bcrypt
  const tieneRolPermitido = usuario && usuario.rol === rolPermitido;
  const tienePassword = Boolean(usuario?.passwordHash);
  let passwordValida = false;

  if (tieneRolPermitido && tienePassword) {
    passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  }

  // Si falló el correo, el rol, la contraseña o la cuenta aún no está verificada
  const credencialesCorrectas = tieneRolPermitido && tienePassword && passwordValida && usuario.estado !== "NoVerificado";

  if (!credencialesCorrectas) {
    if (usuario && tieneRolPermitido) {
      const nuevosIntentos = (usuario.intentosFallidos || 0) + 1;
      const dataUpdate = { intentosFallidos: nuevosIntentos };

      if (nuevosIntentos >= 5) {
        dataUpdate.bloqueoHastaAt = new Date(Date.now() + 15 * 60 * 1000);
      }

      await prisma.usuario.update({
        where: { usuarioId: usuario.usuarioId },
        data: dataUpdate,
      });
    }

    // Mensaje unificado de seguridad según RF4
    return {
      error: "Credenciales inválidas o cuenta no disponible.",
      statusCode: 401,
    };
  }

  // 3. Resetear el contador de intentos fallidos al acertar la contraseña
  if (usuario.intentosFallidos > 0 || usuario.bloqueoHastaAt) {
    await prisma.usuario.update({
      where: { usuarioId: usuario.usuarioId },
      data: { intentosFallidos: 0, bloqueoHastaAt: null },
    });
  }

  // 4. Excepción explícita de cuenta bloqueada
  if (usuario.estado === "Bloqueado") {
    return {
      error: "Su cuenta ha sido bloqueada por acumulación de sanciones (strikes). Debe contactarse de manera presencial con Rectoría para solucionar su situación.",
      statusCode: 403,
    };
  }

  // 5. Verificar que la cuenta esté activa
  if (usuario.estado !== "Activo") {
    return {
      error: "Acceso denegado. La cuenta no se encuentra activa.",
      statusCode: 403,
    };
  }

  // 6. Crear la sesión en la base de datos
  const tempHash = `temp-${randomUUID()}`;
  const expiraAt = new Date(Date.now() + SESSION_MAX_MS);

  const sesion = await prisma.sesion.create({
    data: {
      usuarioId: usuario.usuarioId,
      tokenHash: tempHash,
      expiraAt,
      ultimaActividadAt: new Date(),
    },
  });

  // Generar JWT con sesionId para validar en authMiddleware
  const token = jwt.sign(
    {
      sesionId: sesion.sesionId,
      usuarioId: usuario.usuarioId,
      rol: usuario.rol,
    },
    getJwtSecret(),
    { algorithm: "HS256", expiresIn: Math.floor(SESSION_MAX_MS / 1000) }
  );

  // Actualizar la sesión con el hash real del token
  await prisma.sesion.update({
    where: { sesionId: sesion.sesionId },
    data: { tokenHash: hashToken(token) },
  });

  return {
    token,
    usuario: {
      usuarioId: usuario.usuarioId,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      rut: usuario.rut,
      correo: usuario.correo,
      rol: usuario.rol,
      carrera: usuario.carrera?.nombre || null,
      fotoUrl: usuario.fotoUrl,
    },
  };
};

export const loginAlumnoService = (credentials) =>
  loginService({ ...credentials, rolPermitido: "Alumno" });

export const loginFuncionarioService = (credentials) =>
  loginService({ ...credentials, rolPermitido: "Funcionario" });

/**
 * Servicio para cerrar la sesión en la base de datos.
 */
export const logoutService = async (sesionId) => {
  if (!sesionId) return;

  await prisma.sesion.updateMany({
    where: { sesionId, cerradaAt: null },
    data: { cerradaAt: new Date() },
  });
};

/**
 * Obtiene los datos del perfil del usuario actualmente autenticado.
 */
export const obtenerPerfilService = async (usuarioId) => {
  const usuario = await prisma.usuario.findUnique({
    where: { usuarioId },
    select: {
      usuarioId: true,
      nombre: true,
      apellidos: true,
      rut: true,
      correo: true,
      rol: true,
      fotoUrl: true,
      estado: true,
      carreraId: true,
      carrera: { select: { nombre: true } },
    },
  });

  if (!usuario) {
    return { error: "Usuario no encontrado.", statusCode: 404 };
  }

  return { usuario };
};
