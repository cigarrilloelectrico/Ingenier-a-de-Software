"use strict";
import {
  visualizarRecintosService,
  crearRecintoService,
  actualizarRecintoService,
  desactivarRecintoService,
  reactivarRecintoService,
} from "../services/recinto.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  validateRecintoQuery,
  validateRecintoBody,
  validateRecintoUpdate,
} from "../validations/recinto.validations.js";

export async function visualizarRecintosController(req, res) {
  try {
    const { error, value } = validateRecintoQuery(req.query);
    if (error) return handleErrorClient(res, 400, "Filtros inválidos", error.details);

    // Solo el administrador ve los recintos desactivados; alumnos y funcionarios ven los activos (formularios y mapa)
    let estado = "Activo";
    if (req.user.rol === "Administrador") estado = value.estado;

    const recintos = await visualizarRecintosService({ estado });
    handleSuccess(res, 200, "Recintos obtenidos", recintos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function crearRecintoController(req, res) {
  try {
    const { error, value } = validateRecintoBody(req.body);
    if (error) return handleErrorClient(res, 400, "Datos inválidos", error.details);

    // El administrador viene de la sesión (authMiddleware) y queda registrado en la bitácora
    const recinto = await crearRecintoService(req.user.usuarioId, value);
    handleSuccess(res, 201, "Recinto creado", recinto);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function actualizarRecintoController(req, res) {
  try {
    const id = Number(req.params.id);

    const { error, value } = validateRecintoUpdate(req.body);
    if (error) return handleErrorClient(res, 400, "Datos inválidos", error.details);

    const recinto = await actualizarRecintoService(id, req.user.usuarioId, value);
    handleSuccess(res, 200, "Recinto actualizado", recinto);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function desactivarRecintoController(req, res) {
  try {
    const id = Number(req.params.id);

    const recinto = await desactivarRecintoService(id, req.user.usuarioId);
    handleSuccess(res, 200, "Recinto desactivado", recinto);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function reactivarRecintoController(req, res) {
  try {
    const id = Number(req.params.id);

    const recinto = await reactivarRecintoService(id, req.user.usuarioId);
    handleSuccess(res, 200, "Recinto reactivado", recinto);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
