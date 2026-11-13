// Pantalla inicial según el rol devuelto por el backend.
export function rutaInicioPorRol(rol) {
  if (rol === "Administrador") return "/admin";
  if (rol === "Funcionario") return "/funcionario";
  return "/alumno";
}
