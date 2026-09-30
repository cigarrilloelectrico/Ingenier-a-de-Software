import { prisma } from '../config/configDb.js';
import { MAX_CANDIDATOS, puntuarAviso } from './match.scoring.js';

const errorHttp = (statusCode, message) => Object.assign(new Error(message), { statusCode });

export const calcularCoincidencias = async (idObjeto) => {
  const objeto = await prisma.objeto.findUnique({
    where: { objetoId: idObjeto },
  });

  if (!objeto) {
    throw errorHttp(404, 'No se encontró el objeto para calcular coincidencias.');
  }

  // Un objeto reservado o entregado ya no puede cruzarse con otros avisos
  if (objeto.estado !== 'Disponible') {
    throw errorHttp(409, `El objeto no está disponible (estado: ${objeto.estado}).`);
  }

  // Solo avisos del mismo tipo 
  const avisos = await prisma.aviso.findMany({
    where: {
      estado: 'Publicado',
      tipoObjetoId: objeto.tipoObjetoId,
      fechaPerdida: { lte: objeto.fechaRecepcion },
    },
    select: {
      avisoId: true,
      tipoObjetoId: true,
      recintoId: true,
      color: true,
      fechaPerdida: true,
      estado: true,
    },
  });

  const objetoBuscado = {
    id: objeto.objetoId,
    id_tipo_objeto: objeto.tipoObjetoId,
    color: objeto.color,
    id_sede: objeto.recintoHallazgoId,
    fecha_hallazgo: objeto.fechaRecepcion,
  };

  const resultados = avisos
    .map((aviso) => puntuarAviso(objeto, aviso))
    .sort((a, b) => b.scoreTotal - a.scoreTotal || a.avisoId - b.avisoId)
    .slice(0, MAX_CANDIDATOS);

  return { objetoBuscado, resultados };
};