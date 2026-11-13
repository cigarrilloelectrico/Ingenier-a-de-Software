import argon2 from "argon2";
import bcrypt from "bcryptjs";

// Toda contraseña nueva se guarda con argon2id (resiste mejor ataques con GPU que bcrypt)
export async function hashearPassword(password) {
  return await argon2.hash(password, { type: argon2.argon2id });
}

// Compara una contraseña con su hash. Acepta argon2 y también bcrypt ($2a$ / $2b$),
// para que las cuentas creadas antes del cambio sigan pudiendo entrar
export async function verificarPassword(password, hash) {
  try {
    if (hash.startsWith("$argon2")) {
      return await argon2.verify(hash, password);
    }
    return await bcrypt.compare(password, hash);
  } catch {
    // Un hash dañado en la base de datos cuenta como contraseña incorrecta, no como error del servidor
    return false;
  }
}

// true si el hash todavía es bcrypt: tras un login exitoso conviene regenerarlo con argon2
export function esHashAntiguo(hash) {
  return !hash.startsWith("$argon2");
}
