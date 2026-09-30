"use strict";
import { prisma } from "../config/configDb.js";

export async function visualizarInventarioService({ pagina = 1, recintoId, tipoObjetoId, estado, fechaDesde, fechaHasta }) {
  try {
    return await prisma.objeto.findMany({
      where: {
        recintoId,
        tipoObjetoId,
        estado,
        fechaRecepcion: { gte: fechaDesde, lte: fechaHasta },
      },
      include: { tipoObjeto: true, recinto: true, fotos: true },
      orderBy: { fechaRecepcion: "desc" },
      skip: (pagina - 1) * 20,
      take: 20,
    });
  } catch (error) {
    throw new Error(`Error al obtener el inventario ${error.message}`);
  }
}

export async function registrarObjetoService(funcionarioId, recintoFuncionarioId, { tipoObjetoId, recintoHallazgoId, color, descripcion, fechaRecepcion, entregadoPor, fotosUrl }) {
  try {
    //Validar que el tipo y el recinto del hallazgo existan y estén activos
    const tipoObjeto = await prisma.tipoObjeto.findUnique({ where: { tipoObjetoId } });
    if (!tipoObjeto || tipoObjeto.estado !== "Activo") throw new Error("El tipo de objeto no existe o no está activo.");

    const recintoHallazgo = await prisma.recinto.findUnique({ where: { recintoId: recintoHallazgoId } });
    if (!recintoHallazgo || recintoHallazgo.estado !== "Activo") throw new Error("El recinto del hallazgo no existe o no está activo.");

    //Validaciones regla de negocio
    if (fechaRecepcion > new Date()) throw new Error("La fecha de recepción no puede ser futura.");
    if (!fotosUrl || fotosUrl.length === 0) throw new Error("Debes adjuntar al menos una fotografía.");

    //Registrar el objeto en el recinto del funcionario junto con sus fotos
    return await prisma.objeto.create({
      data: {
        recintoId: recintoFuncionarioId,
        registradoPorId: funcionarioId,
        tipoObjetoId,
        recintoHallazgoId,
        color,
        descripcion,
        fechaRecepcion,
        entregadoPor,
        fotos: { create: fotosUrl.map((fotoUrl) => ({ fotoUrl })) },
      },
      include: { fotos: true },
    });
  } catch (error) {
    throw new Error(`Error al registrar el objeto ${error.message}`);
  }
}

export async function actualizarObjetoService(objetoId, recintoFuncionarioId, { tipoObjetoId, recintoHallazgoId, color, descripcion, fechaRecepcion, entregadoPor }) {
  try {
    //Encontrar el objeto a actualizar   
    const objeto = await prisma.objeto.findUnique({
      where: { objetoId },
      include: { citaciones: true },
    });

    //Validaciones regla de negocio
    if (!objeto) throw new Error("Objeto no encontrado.");
    if (objeto.recintoId !== recintoFuncionarioId) throw new Error("Solo puedes modificar objetos de tu recinto.");
    if (objeto.estado !== "Disponible") throw new Error("Solo se pueden modificar objetos disponibles.");
    if (objeto.citaciones.length > 0) throw new Error("El objeto ya fue cruzado con un aviso y no se puede modificar.");
    //Validaciones Actualizar el objeto con los parametros
    return await prisma.objeto.update({
      where: { objetoId },
      data: { tipoObjetoId, recintoHallazgoId, color, descripcion, fechaRecepcion, entregadoPor },
    });
  } catch (error) {
    throw new Error(`Error al actualizar el objeto ${error.message}`);
  }
}
