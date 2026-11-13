import api from "../../../services/api";

// Reemplaza la contraseña temporal en el primer ingreso; la sesión actual sigue abierta
export async function cambiarPasswordTemporalService(datos) {
  const respuesta = await api.patch(`/funcionarios/password-temporal`, datos);
  return respuesta;
}
