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

// La foto la descarga el <img> del navegador, no axios; por eso solo se arma la URL
// El backend sirve las fotos fuera de /api (express.static en /uploads), así que se quita /api de la base
export function urlFotoObjeto(nombreFoto) {
  let urlBackend = api.defaults.baseURL;

  if (urlBackend.endsWith("/api")) {
    urlBackend = urlBackend.slice(0, -"/api".length);
  }
  return `${urlBackend}/uploads/${nombreFoto}`;
}
