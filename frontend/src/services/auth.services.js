import api from "./api";

// Datos del usuario de la sesión actual (incluye rol y passwordTemporal)
export async function obtenerPerfilService() {
  const respuesta = await api.get(`/auth/me`);
  return respuesta;
}

// Los alumnos entran por /auth/login; el personal de la UBB (funcionarios y administradores) por /auth/login/personal
export async function iniciarSesionService({ correo, password }) {
  const correoNormalizado = correo.trim().toLowerCase();

  let ruta = `/auth/login/personal`;
  if (correoNormalizado.endsWith("@alumnos.ubiobio.cl")) ruta = `/auth/login`;

  const respuesta = await api.post(ruta, { correo: correoNormalizado, password });
  return respuesta;
}

export async function cerrarSesionService() {
  const respuesta = await api.post(`/auth/logout`);
  return respuesta;
}
