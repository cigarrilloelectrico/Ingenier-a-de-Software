"use strict";
import fs from "fs";
import {
  visualizarInventarioService,
  registrarObjetoService,
  actualizarObjetoService,
} from "../services/inventario.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  validateInventarioQuery,
  validateObjetoBody,
  validateObjetoUpdate,
} from "../validations/inventario.validations.js";

// Si el registro falla, las fotos que multer ya guardó no deben quedar huérfanas en uploads/
function borrarFotos(files = []) {
  for (const file of files) {
    fs.rmSync(file.path, { force: true });
  }
}

export async function visualizarInventarioController(req, res) {
  try {
    const { error, value } = validateInventarioQuery(req.query);
    if (error) return handleErrorClient(res, 400, "Filtros inválidos", error.details);

    const objetos = await visualizarInventarioService(value);
    handleSuccess(res, 200, "Inventario obtenido", objetos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function registrarObjetoController(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return handleErrorClient(res, 400, "Debes adjuntar al menos una fotografía");
    }

    const { error, value } = validateObjetoBody(req.body);
    if (error) {
      borrarFotos(req.files);
      return handleErrorClient(res, 400, "Datos inválidos", error.details);
    }

    const datos = {
      ...value,
      fotosUrl: req.files.map((file) => file.filename),
    };

    // El funcionario y su recinto vienen de la sesión (authMiddleware), no del formulario
    const objeto = await registrarObjetoService(req.user.usuarioId, req.user.recintoId, datos);
    handleSuccess(res, 201, "Objeto registrado en el inventario", objeto);
  } catch (error) {
    borrarFotos(req.files);
    handleErrorServer(res, 500, error.message);
  }
}

export async function actualizarObjetoController(req, res) {
  try {
    const id = Number(req.params.id);

    const { error, value } = validateObjetoUpdate(req.body);
    if (error) return handleErrorClient(res, 400, "Datos inválidos", error.details);

    const objeto = await actualizarObjetoService(id, req.user.recintoId, value);
    handleSuccess(res, 200, "Objeto actualizado", objeto);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
