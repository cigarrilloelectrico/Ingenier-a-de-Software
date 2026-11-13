import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { cambiarPasswordTemporalService } from "../services/funcionario.service.js";
import { validatePasswordTemporal } from "../validations/funcionario.validations.js";

export async function cambiarPasswordTemporalController(req, res) {
  try {
    const { error, value } = validatePasswordTemporal(req.body);
    if (error) return handleErrorClient(res, 400, "Datos inválidos", error.details);

    await cambiarPasswordTemporalService(req.user.usuarioId, req.user.sesionId, value);
    return handleSuccess(res, 200, "Contraseña actualizada");
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}
