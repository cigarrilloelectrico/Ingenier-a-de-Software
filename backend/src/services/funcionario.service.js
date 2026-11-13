import { prisma } from "../config/configDb.js";
import { hashearPassword } from "../utils/hashPassword.js";
import { verificarPoliticaPassword } from "../utils/passwordPolicy.js";

export async function cambiarPasswordTemporalService(usuarioId, sesionId, { passwordNueva }) {
  const funcionario = await prisma.usuario.findFirst({
    where: { usuarioId, rol: "Funcionario" },
  });

  if (!funcionario) throw new Error("Funcionario no encontrado.");
  if (!funcionario.passwordTemporal) throw new Error("Tu contraseña ya no es temporal.");

  const condicionesIncumplidas = verificarPoliticaPassword(passwordNueva);
  if (condicionesIncumplidas.length > 0) {
    throw new Error(`La contraseña no cumple las condiciones: ${condicionesIncumplidas.join(" ")}`);
  }

  const passwordHash = await hashearPassword(passwordNueva);

  await prisma.$transaction(async (transaccion) => {
    await transaccion.usuario.update({
      where: { usuarioId },
      data: { passwordHash, passwordTemporal: false, passwordExpiredAt: null },
    });

    await transaccion.sesion.updateMany({
      where: { usuarioId, cerradaAt: null, sesionId: { not: sesionId } },
      data: { cerradaAt: new Date() },
    });
  });
}
