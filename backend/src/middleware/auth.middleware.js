import jwt from "jsonwebtoken";
import { createHash } from "node:crypto";
import { handleErrorClient } from "../handlers/responseHandlers.js";
import { getJwtSecret, SESSION_IDLE_MS } from "../config/configEnv.js";
import { prisma } from "../config/configDb.js";

// Sesion.tokenHash stores this hash, never the raw token
export const hashToken = (token) => createHash("sha256").update(token).digest("hex");

/**
 * Verifies the JWT in the `accessToken` cookie and that its session is still alive in the database.
 * The database check is what allows closing sessions remotely (RF5, RF28, RF37, RF47)
 * and expiring them after 30 minutes of inactivity (RF4).
 * On success sets `req.user = { usuarioId, rol, sesionId }`.
 */
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return handleErrorClient(res, 401, "Acceso denegado. No hay sesión activa.");
  }

  let payload;
  try {
    payload = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
  } catch (error) {
    return handleErrorClient(res, 401, "Sesión expirada. Inicie sesión nuevamente.", error.message);
  }

  const sesion = await prisma.sesion.findUnique({
    where: { sesionId: payload.sesionId },
    include: { usuario: { select: { usuarioId: true, rol: true, estado: true } } },
  });

  const now = new Date();
  const sesionValida =
    sesion &&
    sesion.tokenHash === hashToken(token) &&
    !sesion.cerradaAt &&
    sesion.expiraAt > now &&
    now - sesion.ultimaActividadAt < SESSION_IDLE_MS;

  if (!sesionValida) {
    return handleErrorClient(res, 401, "Sesión expirada. Inicie sesión nuevamente.");
  }

  if (sesion.usuario.estado !== "Activo") {
    return handleErrorClient(res, 401, "Acceso denegado. Cuenta inactiva o bloqueada.");
  }

  await prisma.sesion.update({
    where: { sesionId: sesion.sesionId },
    data: { ultimaActividadAt: now },
  });

  req.user = {
    usuarioId: sesion.usuario.usuarioId,
    rol: sesion.usuario.rol,
    sesionId: sesion.sesionId,
  };
  next();
};

/**
 * Allows the request only if the logged-in user has one of the given roles.
 * The role is read from the database in authMiddleware, not from the token.
 * @example router.post("/objetos", authMiddleware, authorizeRoles("Funcionario"), crearObjeto)
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return handleErrorClient(res, 403, "No tienes permisos para acceder a esta ruta.");
    }
    next();
  };
};
