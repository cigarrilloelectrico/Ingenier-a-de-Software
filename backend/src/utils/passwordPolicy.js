// Condiciones de toda contraseña: al menos 12 caracteres, empezar con mayúscula y tener un carácter especial.
// Devuelve la lista de condiciones que NO cumple: si viene vacía, la contraseña es válida.
export function verificarPoliticaPassword(password) {
  const condicionesIncumplidas = [];

  if (password.length < 12) {
    condicionesIncumplidas.push("Debe tener al menos 12 caracteres.");
  }
  // \p{Lu} es cualquier letra mayúscula, incluidas Ñ y las con tilde
  if (!/^\p{Lu}/u.test(password)) {
    condicionesIncumplidas.push("Debe empezar con una letra mayúscula.");
  }
  // \p{P} y \p{S} son signos de puntuación y símbolos: ! @ # $ % & * . - _ etc.
  if (!/[\p{P}\p{S}]/u.test(password)) {
    condicionesIncumplidas.push("Debe contener al menos un carácter especial.");
  }

  return condicionesIncumplidas;
}
