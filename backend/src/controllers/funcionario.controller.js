import { visualizarFuncionariosService, obtenerFuncionarioService, crearFuncionarioService, cambiarRecintoFuncionarioService, desactivarFuncionarioService, reactivarFuncionarioService, cambiarPasswordTemporalService } from "../services/funcionario.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { validateFuncionarioBody, validateFuncionarioQuery, validateFuncionarioRecinto, validatePasswordTemporal } from "../validations/funcionario.validations.js";

export async function visualizarFuncionariosController(req, res) {
  try {
    const { error, value } = validateFuncionarioQuery(req.query);
    if (error) return handleErrorClient(res, 400, "Filtros inválidos", error.details);

    const funcionarios = await visualizarFuncionariosService(value);
    handleSuccess(res, 200, "Funcionarios obtenidos", funcionarios);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerFuncionarioController(req, res) {
  try {
    const id = Number(req.params.id);

    const funcionario = await obtenerFuncionarioService(id);
    handleSuccess(res, 200, "Funcionario obtenido", funcionario);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function crearFuncionarioController(req, res) {
  try {
    const { error, value } = validateFuncionarioBody(req.body);
    if (error) return handleErrorClient(res, 400, "Datos inválidos", error.details);

    // El administrador viene de la sesión (authMiddleware) y queda registrado en la bitácora
    const funcionario = await crearFuncionarioService(req.user.usuarioId, value);
    handleSuccess(res, 201, "Funcionario creado. Su contraseña temporal fue enviada a su correo", funcionario);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function cambiarRecintoFuncionarioController(req, res) {
  try {
    const id = Number(req.params.id);

    const { error, value } = validateFuncionarioRecinto(req.body);
    if (error) return handleErrorClient(res, 400, "Datos inválidos", error.details);

    const funcionario = await cambiarRecintoFuncionarioService(id, req.user.usuarioId, value);
    handleSuccess(res, 200, "Recinto del funcionario actualizado", funcionario);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function desactivarFuncionarioController(req, res) {
  try {
    const id = Number(req.params.id);

    const funcionario = await desactivarFuncionarioService(id, req.user.usuarioId);
    handleSuccess(res, 200, "Funcionario desactivado", funcionario);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function reactivarFuncionarioController(req, res) {
  try {
    const id = Number(req.params.id);

    const funcionario = await reactivarFuncionarioService(id, req.user.usuarioId);
    handleSuccess(res, 200, "Funcionario reactivado", funcionario);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function cambiarPasswordTemporalController(req, res) {
  try {
    const { error, value } = validatePasswordTemporal(req.body);
    if (error) return handleErrorClient(res, 400, "Datos inválidos", error.details);

    // El funcionario y su sesión vienen de authMiddleware: la sesión actual sigue abierta
    await cambiarPasswordTemporalService(req.user.usuarioId, req.user.sesionId, value);
    handleSuccess(res, 200, "Contraseña actualizada");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
