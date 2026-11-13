// Pantalla a la que llega cada rol después de iniciar sesión
export function rutaInicioPorRol(rol) {
  if (rol === "Administrador") return "/admin";
  if (rol === "Funcionario") return "/funcionario";

  // El alumno todavía no tiene una vista propia: llega al inicio
  return "/";
}
