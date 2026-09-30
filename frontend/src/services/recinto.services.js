import api from "./api";

export async function obtenerRecintosService() {
  const res = await api.get(`/recintos`);
  return res;
}
