import argon2 from "argon2";
import bcrypt from "bcryptjs";

// Las contraseñas nuevas se guardan con argon2id.
export async function hashearPassword(password) {
  return argon2.hash(password, { type: argon2.argon2id });
}

// Acepta Argon2 y bcrypt para mantener compatibles las cuentas existentes.
export async function verificarPassword(password, hash) {
  try {
    if (hash.startsWith("$argon2")) return argon2.verify(hash, password);
    return bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export function esHashAntiguo(hash) {
  return !hash.startsWith("$argon2");
}
