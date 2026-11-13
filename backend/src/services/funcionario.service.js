import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import { prisma } from "../config/configDb.js";
import { enviarPasswordTemporal } from "./email.service.js";
import { verificarPoliticaPassword } from "../utils/passwordPolicy.js";

// Token numérico de 6 dígitos. randomInt usa un generador criptográfico: Math.random es predecible
function generarClaveTemporal() {
  return String(randomInt(0, 1000000)).padStart(6, "0");
}

// La contraseña temporal caduca a los 7 días (RF35)
function calcularVencimientoClaveTemporal() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

export async function visualizarFuncionariosService({ recintoId, estado }) {
  try {
    return await prisma.usuario.findMany({
      where: { rol: "Funcionario", recintoId, estado },
      omit: { passwordHash: true },
      include: {
        recinto: true,
        // La sesión más reciente es su último ingreso al sistema (RF38)
        sesiones: { select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { nombre: "asc" },
    });
  } catch (error) {
    throw new Error(`Error al obtener los funcionarios ${error.message}`);
  }
}

export async function obtenerFuncionarioService(usuarioId) {
  try {
    const funcionario = await prisma.usuario.findFirst({
      where: { usuarioId, rol: "Funcionario" },
      omit: { passwordHash: true },
      include: {
        recinto: true,
        sesiones: { select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!funcionario) throw new Error("Funcionario no encontrado.");
    return funcionario;
  } catch (error) {
    throw new Error(`Error al obtener el funcionario ${error.message}`);
  }
}

export async function crearFuncionarioService(administradorId, { rut, nombre, apellidos, correo, recintoId }) {
  try {
    //Validaciones regla de negocio
    const correoRegistrado = await prisma.usuario.findUnique({ where: { correo } });
    if (correoRegistrado) throw new Error("El correo ya está registrado en otra cuenta.");

    const rutRegistrado = await prisma.usuario.findUnique({ where: { rut } });
    if (rutRegistrado) throw new Error("El rut ya está registrado en otra cuenta.");

    const recinto = await prisma.recinto.findUnique({ where: { recintoId } });
    if (!recinto || recinto.estado !== "Activo") throw new Error("El recinto no existe o no está activo.");

    //Generar la contraseña temporal: solo viaja al correo del funcionario, el administrador nunca la ve (RF35)
    const claveTemporal = generarClaveTemporal();
    const passwordHash = await bcrypt.hash(claveTemporal, 10);

    //Crear la cuenta, registrarla en la bitácora y enviar el correo juntos: si el correo falla, la cuenta no se crea
    return await prisma.$transaction(async (transaccion) => {
      const funcionario = await transaccion.usuario.create({
        data: {
          rut,
          nombre,
          apellidos,
          correo,
          recintoId,
          rol: "Funcionario",
          estado: "Activo",
          passwordHash,
          passwordTemporal: true,
          passwordExpiredAt: calcularVencimientoClaveTemporal(),
        },
        omit: { passwordHash: true },
      });

      await transaccion.bitacora.create({
        data: {
          administradorId,
          tipoAccion: "CrearFuncionario",
          tablaAfectada: "Usuario",
          registroAfectadoId: funcionario.usuarioId,
          valorNuevo: JSON.stringify(funcionario),
        },
      });

      await enviarPasswordTemporal({ correo, nombre, claveTemporal });

      return funcionario;
    }, { timeout: 20000 }); // El envío del correo puede tardar más que los 5 segundos por defecto
  } catch (error) {
    throw new Error(`Error al crear el funcionario ${error.message}`);
  }
}

export async function cambiarRecintoFuncionarioService(usuarioId, administradorId, { recintoId }) {
  try {
    //Encontrar el funcionario a cambiar de recinto
    const funcionario = await prisma.usuario.findFirst({ where: { usuarioId, rol: "Funcionario" } });

    //Validaciones regla de negocio
    if (!funcionario) throw new Error("Funcionario no encontrado.");
    if (funcionario.recintoId === recintoId) throw new Error("El funcionario ya está asignado a ese recinto.");

    const recinto = await prisma.recinto.findUnique({ where: { recintoId } });
    if (!recinto || recinto.estado !== "Activo") throw new Error("El recinto no existe o no está activo.");

    //Cambiar el recinto y registrar el origen y el destino en la bitácora (RF36)
    return await prisma.$transaction(async (transaccion) => {
      const funcionarioActualizado = await transaccion.usuario.update({
        where: { usuarioId },
        data: { recintoId },
        omit: { passwordHash: true },
        include: { recinto: true },
      });

      await transaccion.bitacora.create({
        data: {
          administradorId,
          tipoAccion: "CambiarRecinto",
          tablaAfectada: "Usuario",
          registroAfectadoId: usuarioId,
          valorAnterior: String(funcionario.recintoId),
          valorNuevo: String(recintoId),
        },
      });

      return funcionarioActualizado;
    });
  } catch (error) {
    throw new Error(`Error al cambiar el recinto del funcionario ${error.message}`);
  }
}

export async function desactivarFuncionarioService(usuarioId, administradorId) {
  try {
    //Encontrar el funcionario a desactivar
    const funcionario = await prisma.usuario.findFirst({ where: { usuarioId, rol: "Funcionario" } });

    //Validaciones regla de negocio
    if (!funcionario) throw new Error("Funcionario no encontrado.");
    if (funcionario.estado === "Desactivado") throw new Error("El funcionario ya está desactivado.");

    //Desactivar la cuenta, cerrar sus sesiones abiertas y registrar el cambio en la bitácora (RF37)
    return await prisma.$transaction(async (transaccion) => {
      const funcionarioDesactivado = await transaccion.usuario.update({
        where: { usuarioId },
        data: { estado: "Desactivado" },
        omit: { passwordHash: true },
      });

      await transaccion.sesion.updateMany({
        where: { usuarioId, cerradaAt: null },
        data: { cerradaAt: new Date() },
      });

      await transaccion.bitacora.create({
        data: {
          administradorId,
          tipoAccion: "DesactivarFuncionario",
          tablaAfectada: "Usuario",
          registroAfectadoId: usuarioId,
          valorAnterior: funcionario.estado,
          valorNuevo: "Desactivado",
        },
      });

      return funcionarioDesactivado;
    });
  } catch (error) {
    throw new Error(`Error al desactivar el funcionario ${error.message}`);
  }
}

export async function reactivarFuncionarioService(usuarioId, administradorId) {
  try {
    //Encontrar el funcionario a reactivar
    const funcionario = await prisma.usuario.findFirst({
      where: { usuarioId, rol: "Funcionario" },
      include: { recinto: true },
    });

    //Validaciones regla de negocio
    if (!funcionario) throw new Error("Funcionario no encontrado.");
    if (funcionario.estado === "Activo") throw new Error("El funcionario ya está activo.");
    if (!funcionario.recinto || funcionario.recinto.estado !== "Activo") {
      throw new Error("Su recinto está desactivado: asígnale un recinto activo antes de reactivarlo.");
    }

    //Reactivar la cuenta y registrar el cambio en la bitácora
    return await prisma.$transaction(async (transaccion) => {
      const funcionarioReactivado = await transaccion.usuario.update({
        where: { usuarioId },
        data: { estado: "Activo" },
        omit: { passwordHash: true },
      });

      await transaccion.bitacora.create({
        data: {
          administradorId,
          tipoAccion: "ReactivarFuncionario",
          tablaAfectada: "Usuario",
          registroAfectadoId: usuarioId,
          valorAnterior: funcionario.estado,
          valorNuevo: "Activo",
        },
      });

      return funcionarioReactivado;
    });
  } catch (error) {
    throw new Error(`Error al reactivar el funcionario ${error.message}`);
  }
}

export async function cambiarPasswordTemporalService(usuarioId, sesionId, { passwordNueva }) {
  try {
    //Encontrar al funcionario que reemplaza su contraseña temporal
    const funcionario = await prisma.usuario.findFirst({ where: { usuarioId, rol: "Funcionario" } });

    //Validaciones regla de negocio
    if (!funcionario) throw new Error("Funcionario no encontrado.");
    if (!funcionario.passwordTemporal) throw new Error("Tu contraseña ya no es temporal.");

    const condicionesIncumplidas = verificarPoliticaPassword(passwordNueva);
    if (condicionesIncumplidas.length > 0) {
      throw new Error(`La contraseña no cumple las condiciones: ${condicionesIncumplidas.join(" ")}`);
    }

    //Guardar la contraseña definitiva: la temporal queda invalidada de inmediato (RF35)
    const passwordHash = await bcrypt.hash(passwordNueva, 10);

    //Sigue trabajando en esta sesión; cualquier otra abierta con la temporal se cierra
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
  } catch (error) {
    throw new Error(`Error al cambiar la contraseña ${error.message}`);
  }
}
