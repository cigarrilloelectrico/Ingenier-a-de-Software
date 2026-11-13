// Devuelve las condiciones de contraseña que todavía no se cumplen.
export function verificarPoliticaPassword(password) {
  const condicionesIncumplidas = [];

  if (password.length < 12) {
    condicionesIncumplidas.push("Debe tener al menos 12 caracteres.");
  }
  if (!/^\p{Lu}/u.test(password)) {
    condicionesIncumplidas.push("Debe empezar con una letra mayúscula.");
  }
  if (!/[\p{P}\p{S}]/u.test(password)) {
    condicionesIncumplidas.push("Debe contener al menos un carácter especial.");
  }

  return condicionesIncumplidas;
}
