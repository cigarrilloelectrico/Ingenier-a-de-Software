import api from "./api";

// Datos del usuario de la sesión actual (incluye rol y passwordTemporal)
export async function obtenerPerfilService() {
  return api.get("/auth/me");
}

// Los alumnos entran por /auth/login; el personal de la UBB (funcionarios y administradores) por /auth/login/personal
export async function iniciarSesionService({ correo, password }) {
  const correoNormalizado = correo.trim().toLowerCase();
  const ruta = correoNormalizado.endsWith("@alumnos.ubiobio.cl")
    ? "/auth/login"
    : "/auth/login/personal";

  return api.post(ruta, { correo: correoNormalizado, password });
}

export async function cerrarSesionService() {
  return api.post("/auth/logout");
}

// Compatibilidad con el layout actual del funcionario.
export const logoutService = cerrarSesionService;