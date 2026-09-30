import {
  crearAvisoService,
  obtenerMisAvisosService,
  obtenerCatalogosService,
} from "../services/aviso.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

/**
 * Controlador para publicar un aviso de pérdida.
 */
export async function crearAvisoController(req, res) {
  try {
    // Obtenemos el usuario autenticado: desde req.user (sesión JWT) o x-user-id (Postman/pruebas)
    const usuarioId = req.user?.usuarioId || Number(req.headers["x-user-id"]);

    if (!usuarioId) {
      return handleErrorClient(
        res,
        401,
        "No autorizado. Debes iniciar sesión para publicar un aviso de pérdida"
      );
    }

    const archivoFoto = req.file || null;
    const nuevoAviso = await crearAvisoService(req.body, usuarioId, archivoFoto);

    return handleSuccess(res, 201, "Aviso de pérdida publicado exitosamente", nuevoAviso);
  } catch (error) {
    if (error.statusCode) {
      return handleErrorClient(res, error.statusCode, error.message);
    }
    return handleErrorServer(res, 500, "Error al publicar el aviso de pérdida", error);
  }
}

/**
 * Controlador para consultar los avisos del alumno logueado.
 */
export async function obtenerMisAvisosController(req, res) {
  try {
    const usuarioId = req.user?.usuarioId || Number(req.headers["x-user-id"]);

    if (!usuarioId) {
      return handleErrorClient(
        res,
        401,
        "No autorizado. Debes iniciar sesión para consultar tus avisos"
      );
    }

    const avisos = await obtenerMisAvisosService(usuarioId);
    return handleSuccess(res, 200, "Avisos obtenidos exitosamente", avisos);
  } catch (error) {
    if (error.statusCode) {
      return handleErrorClient(res, error.statusCode, error.message);
    }
    return handleErrorServer(res, 500, "Error al consultar los avisos del alumno", error);
  }
}

/**
 * Controlador para obtener los catálogos (listas fijas de recintos y tipos de objeto).
 */
export async function obtenerCatalogosController(req, res) {
  try {
    const catalogos = await obtenerCatalogosService();
    return handleSuccess(res, 200, "Catálogos obtenidos exitosamente", catalogos);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener los catálogos", error);
  }
}
