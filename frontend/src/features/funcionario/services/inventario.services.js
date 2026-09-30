import api from "../../../services/api";

export async function obtenerInventarioService(filtros) {
  const res = await api.get(`/inventario`, { params: filtros });
  return res;
}

export async function registrarObjetoService(formData) {
  const res = await api.post(`/inventario`, formData);
  return res;
}

export async function actualizarObjetoService(id, datos) {
  const res = await api.patch(`/inventario/${id}`, datos);
  return res;
}

// La foto la descarga el <img> del navegador, no axios; por eso solo se arma la URL con la base de axios
export function urlFotoObjeto(nombreFoto) {
  return `${api.defaults.baseURL}/inventario/fotos/${nombreFoto}`;
}
