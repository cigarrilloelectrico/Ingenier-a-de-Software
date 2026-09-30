"use strict";
import {
  loginAlumnoService,
  loginFuncionarioService,
  logoutService,
  obtenerPerfilService,
} from "../services/auth.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import { SESSION_MAX_MS } from "../config/configEnv.js";

/**
 * Inicia sesión para un Alumno, crea sesión en BD y adjunta cookie HttpOnly con JWT.
 */
export async function loginAlumnoController(req, res) {
  try {
    const { correo, password } = req.body;
    const result = await loginAlumnoService({ correo, password });

    if (result.error) {
      return handleErrorClient(res, result.statusCode || 400, result.error);
    }

    // Guardar token en cookie HttpOnly con duración máxima de 12 horas
    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_MS,
    });

    return handleSuccess(res, 200, "Inicio de sesión exitoso.", result.usuario);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno al iniciar sesión.", error.message);
  }
}

export async function loginFuncionarioController(req, res) {
  try {
    const { correo, password } = req.body;
    const result = await loginFuncionarioService({ correo, password });

    if (result.error) {
      return handleErrorClient(res, result.statusCode || 400, result.error);
    }

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_MS,
    });

    return handleSuccess(res, 200, "Inicio de sesión exitoso.", result.usuario);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno al iniciar sesión.", error.message);
  }
}

/**
 * Cierra la sesión activa del usuario actual en BD y limpia la cookie de autenticación.
 */
export async function logoutController(req, res) {
  try {
    if (req.user?.sesionId) {
      await logoutService(req.user.sesionId);
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
    });

    return handleSuccess(res, 200, "Sesión cerrada exitosamente.");
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno al cerrar sesión.", error.message);
  }
}

/**
 * Devuelve el perfil del usuario autenticado en la sesión actual.
 */
export async function perfilController(req, res) {
  try {
    const result = await obtenerPerfilService(req.user.usuarioId);

    if (result.error) {
      return handleErrorClient(res, result.statusCode || 400, result.error);
    }

    return handleSuccess(res, 200, "Perfil recuperado con éxito.", result.usuario);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno al obtener el perfil.", error.message);
  }
}
