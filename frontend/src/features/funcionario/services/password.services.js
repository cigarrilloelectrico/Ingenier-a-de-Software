import api from "../../../services/api";

export async function cambiarPasswordTemporalService(datos) {
  return api.patch("/funcionarios/password-temporal", datos);
}
