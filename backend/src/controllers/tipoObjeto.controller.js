"use strict";

import { visualizarTiposObjetoService } from "../services/tipoObjeto.service.js";
import {
  handleSuccess,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function visualizarTiposObjetoController(req, res) {
  try {
    const tiposObjeto = await visualizarTiposObjetoService();

    handleSuccess(
      res,
      200,
      "Tipos de objeto obtenidos",
      tiposObjeto
    );
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}