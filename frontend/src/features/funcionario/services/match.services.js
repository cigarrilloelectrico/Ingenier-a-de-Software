import api from "../../../services/api";

// Devuelve { success, objetoConsultado, totalResultados, data: [coincidencias] }
export async function obtenerCoincidenciasService(objetoId) {
  const res = await api.get(`/match/${objetoId}`);
  return res;
}