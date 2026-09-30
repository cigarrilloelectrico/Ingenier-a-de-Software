import { prisma } from "../config/configDb.js";

export async function crearAvisoService(datos, usuarioId, archivoFoto = null) {

  // 1. Obtener usuario alumno desde la base de datos
  const usuario = await prisma.usuario.findUnique({
    where: { usuarioId },
  });

  if (!usuario) {
    const error = new Error("Usuario no encontrado en el sistema");
    error.statusCode = 404;
    throw error;
  }

  // 2. Verificar que tenga rol de alumno
  if (usuario.rol !== "Alumno") {
    const error = new Error("Solo los usuarios con rol de alumno pueden publicar avisos de pérdida");
    error.statusCode = 403;
    throw error;
  }

  // 3. Verificar datos personales completos
  if (!usuario.nombre || !usuario.apellidos || !usuario.rut || !usuario.carreraId) {
    const error = new Error(
      "Debes tener tus datos personales completos (Nombre, Apellidos, Rut y Carrera) para poder publicar un aviso"
    );
    error.statusCode = 400;
    throw error;
  }

  // 4. Verificar que la cuenta no esté bloqueada
  const estaBloqueadoPorEstado = usuario.estado === "Bloqueado";
  const estaBloqueadoTemporal = usuario.bloqueoHastaAt && new Date(usuario.bloqueoHastaAt) > new Date();

  if (estaBloqueadoPorEstado || estaBloqueadoTemporal) {
    const error = new Error("Tu cuenta se encuentra bloqueada. No tienes permitido publicar avisos");
    error.statusCode = 403;
    throw error;
  }

  // 5. Verificar límite de avisos abiertos: máximo 5 avisos
  const avisosAbiertos = await prisma.aviso.count({
    where: {
      alumnoId: usuarioId,
      estado: "Publicado",
    },
  });

  if (avisosAbiertos >= 5) {
    const error = new Error(
      "No puedes publicar un nuevo aviso porque ya tienes cinco avisos abiertos simultáneamente"
    );
    error.statusCode = 400;
    throw error;
  }

  // 6. Verificar que el Tipo de Objeto exista y esté activo
  const tipoObjeto = await prisma.tipoObjeto.findUnique({
    where: { tipoObjetoId: datos.tipoObjetoId },
  });

  if (!tipoObjeto || tipoObjeto.estado !== "Activo") {
    const error = new Error("El tipo de objeto seleccionado no es válido o no se encuentra activo");
    error.statusCode = 400;
    throw error;
  }

  // 7. Verificar que el Recinto exista y esté activo
  const recinto = await prisma.recinto.findUnique({
    where: { recintoId: datos.recintoId },
  });

  if (!recinto || recinto.estado !== "Activo") {
    const error = new Error("El recinto seleccionado no es válido o no se encuentra activo");
    error.statusCode = 400;
    throw error;
  }

  // 8. Formatear la URL de la fotografía si se adjuntó
  const fotoUrl = archivoFoto ? `/uploads/${archivoFoto.filename}` : null;

  // 9. Crear el registro en la base de datos
  const nuevoAviso = await prisma.aviso.create({
    data: {
      alumnoId: usuarioId,
      tipoObjetoId: datos.tipoObjetoId,
      recintoId: datos.recintoId,
      color: datos.color,
      descripcion: datos.descripcion,
      fechaPerdida: new Date(datos.fechaPerdida),
      fotoUrl,
      estado: "Publicado",
    },
    include: {
      tipoObjeto: {
        select: {
          tipoObjetoId: true,
          nombre: true,
        },
      },
      recinto: {
        select: {
          recintoId: true,
          nombre: true,
        },
      },
    },
  });

  return nuevoAviso;
}

/**
 * Servicio para consultar los avisos del alumno autenticado.
 * Garantiza total aislamiento: bajo ningún concepto consulta objetos en depósito.
 *
 * @param {number} usuarioId - ID del alumno
 */
export async function obtenerMisAvisosService(usuarioId) {
  return await prisma.aviso.findMany({
    where: {
      alumnoId: usuarioId,
    },
    include: {
      tipoObjeto: {
        select: {
          tipoObjetoId: true,
          nombre: true,
        },
      },
      recinto: {
        select: {
          recintoId: true,
          nombre: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Servicio para obtener las listas fijas activas (recintos y tipos de objeto)
 * para alimentar los selectores del formulario de aviso.
 */
export async function obtenerCatalogosService() {
  const [recintos, tiposObjeto] = await Promise.all([
    prisma.recinto.findMany({
      where: { estado: "Activo" },
      select: { recintoId: true, nombre: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.tipoObjeto.findMany({
      where: { estado: "Activo" },
      select: { tipoObjetoId: true, nombre: true },
      orderBy: { nombre: "asc" },
    }),
  ]);

  return { recintos, tiposObjeto };
}
