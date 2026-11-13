import api from "../../../services/api";

export async function obtenerFuncionariosService(filtros) {
  const respuesta = await api.get(`/funcionarios`, { params: filtros });
  return respuesta;
}

// El backend genera la contraseña temporal y la envía al correo: nunca vuelve en la respuesta
export async function crearFuncionarioService(datos) {
  const respuesta = await api.post(`/funcionarios`, datos);
  return respuesta;
}

export async function cambiarRecintoFuncionarioService(id, recintoId) {
  const respuesta = await api.patch(`/funcionarios/${id}/recinto`, { recintoId });
  return respuesta;
}

export async function desactivarFuncionarioService(id) {
  const respuesta = await api.patch(`/funcionarios/${id}/desactivar`);
  return respuesta;
}

export async function reactivarFuncionarioService(id) {
  const respuesta = await api.patch(`/funcionarios/${id}/reactivar`);
  return respuesta;
}
