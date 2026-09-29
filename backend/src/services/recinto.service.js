"use strict";
import { prisma } from "../config/configDb.js";

export async function visualizarRecintosService({ estado }) {
  try {
    return await prisma.recinto.findMany({
      where: { estado },
      orderBy: { nombre: "asc" },
    });
  } catch (error) {
    throw new Error(`Error al obtener los recintos ${error.message}`);
  }
}

export async function crearRecintoService(administradorId, { nombre, latitud, longitud, horarioAtencion }) {
  try {
    //Validaciones regla de negocio
    const recintoExistente = await prisma.recinto.findUnique({ where: { nombre } });
    if (recintoExistente) throw new Error("Ya existe un recinto con ese nombre.");

    //Crear el recinto y registrarlo en la bitácora juntos: o se guardan los dos o ninguno (RF45)
    return await prisma.$transaction(async (transaccion) => {
      const recinto = await transaccion.recinto.create({
        data: { nombre, latitud, longitud, horarioAtencion },
      });

      await transaccion.bitacora.create({
        data: {
          administradorId,
          tipoAccion: "CrearRecinto",
          tablaAfectada: "Recinto",
          registroAfectadoId: recinto.recintoId,
          valorNuevo: JSON.stringify(recinto),
        },
      });

      return recinto;
    });
  } catch (error) {
    throw new Error(`Error al crear el recinto ${error.message}`);
  }
}

export async function actualizarRecintoService(recintoId, administradorId, { nombre, latitud, longitud, horarioAtencion }) {
  try {
    //Encontrar el recinto a actualizar
    const recinto = await prisma.recinto.findUnique({ where: { recintoId } });

    //Validaciones regla de negocio
    if (!recinto) throw new Error("Recinto no encontrado.");
    if (nombre && nombre !== recinto.nombre) {
      const recintoMismoNombre = await prisma.recinto.findUnique({ where: { nombre } });
      if (recintoMismoNombre) throw new Error("Ya existe un recinto con ese nombre.");
    }

    //Actualizar el recinto y registrar el cambio en la bitácora
    return await prisma.$transaction(async (transaccion) => {
      const recintoActualizado = await transaccion.recinto.update({
        where: { recintoId },
        data: { nombre, latitud, longitud, horarioAtencion },
      });

      await transaccion.bitacora.create({
        data: {
          administradorId,
          tipoAccion: "EditarRecinto",
          tablaAfectada: "Recinto",
          registroAfectadoId: recintoId,
         valorAnterior: JSON.stringify(recinto), // Transformar el objeto de JS en un string formato JSON
         valorNuevo: JSON.stringify(recintoActualizado),
        },
      });

      return recintoActualizado;
    });
  } catch (error) {
    throw new Error(`Error al actualizar el recinto ${error.message}`);
  }
}

export async function desactivarRecintoService(recintoId, administradorId) {
  try {
    //Encontrar el recinto a desactivar
    const recinto = await prisma.recinto.findUnique({ where: { recintoId } });

    //Validaciones regla de negocio
    if (!recinto) throw new Error("Recinto no encontrado.");
    if (recinto.estado === "Inactivo") throw new Error("El recinto ya está desactivado.");

    //No se puede desactivar si deja objetos sin custodia o funcionarios sin recinto (RF34)
    const objetosEnCustodia = await prisma.objeto.count({
      where: { recintoId, estado: { in: ["Disponible", "Reservado"] } },
    });
    const funcionariosAsignados = await prisma.usuario.count({
      where: { recintoId, rol: "Funcionario", estado: "Activo" },
    });
    if (objetosEnCustodia > 0 || funcionariosAsignados > 0) {
      throw new Error(`No se puede desactivar: tiene ${objetosEnCustodia} objetos en custodia y ${funcionariosAsignados} funcionarios asignados.`);
    }

    //Desactivar el recinto y registrar el cambio en la bitácora
    return await prisma.$transaction(async (transaccion) => {
      const recintoDesactivado = await transaccion.recinto.update({
        where: { recintoId },
        data: { estado: "Inactivo" },
      });

      await transaccion.bitacora.create({
        data: {
          administradorId,
          tipoAccion: "DesactivarRecinto",
          tablaAfectada: "Recinto",
          registroAfectadoId: recintoId,
          valorAnterior: "Activo",
          valorNuevo: "Inactivo",
        },
      });

      return recintoDesactivado;
    });
  } catch (error) {
    throw new Error(`Error al desactivar el recinto ${error.message}`);
  }
}

export async function reactivarRecintoService(recintoId, administradorId) {
  try {
    //Encontrar el recinto a reactivar
    const recinto = await prisma.recinto.findUnique({ where: { recintoId } });

    //Validaciones regla de negocio
    if (!recinto) throw new Error("Recinto no encontrado.");
    if (recinto.estado === "Activo") throw new Error("El recinto ya está activo.");

    //Reactivar el recinto y registrar el cambio en la bitácora
    return await prisma.$transaction(async (transaccion) => {
      const recintoReactivado = await transaccion.recinto.update({
        where: { recintoId },
        data: { estado: "Activo" },
      });

      await transaccion.bitacora.create({
        data: {
          administradorId,
          tipoAccion: "ReactivarRecinto",
          tablaAfectada: "Recinto",
          registroAfectadoId: recintoId,
          valorAnterior: "Inactivo",
          valorNuevo: "Activo",
        },
      });

      return recintoReactivado;
    });
  } catch (error) {
    throw new Error(`Error al reactivar el recinto ${error.message}`);
  }
}
