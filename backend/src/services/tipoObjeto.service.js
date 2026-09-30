"use strict";
import { prisma } from "../config/configDb.js";

export async function visualizarTiposObjetoService() {
  try {
    return await prisma.tipoObjeto.findMany({
      where: { estado: "Activo" },
      orderBy: { nombre: "asc" },
    });
  } catch (error) {
    throw new Error(`Error al obtener los tipos de objeto ${error.message}`);
  }
}