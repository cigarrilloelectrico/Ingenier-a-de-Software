import { prisma } from '../config/configDb.js';
import { MAX_CANDIDATOS, puntuarAviso } from './match.scoring.js';

// Mismo patrón que aviso.service.js: el controlador usa error.statusCode para responder
const errorHttp = (statusCode, message) => Object.assign(new Error(message), { statusCode });

// Prisma devuelve Decimal para los campos @db.Decimal; se convierte a número plano
// antes de entrar a match.scoring.js, para que esa parte no dependa de Prisma.
const aNumero = (decimal) => Number(decimal);

export const calcularCoincidencias = async (idObjeto) => {
  const objeto = await prisma.objeto.findUnique({
    where: { objetoId: idObjeto },
    include: { recintoHallazgo: { select: { latitud: true, longitud: true } } },
  });

  if (!objeto) {
    throw errorHttp(404, 'No se encontró el objeto para calcular coincidencias.');
  }

  // Un objeto reservado o entregado ya no puede cruzarse con otros avisos
  if (objeto.estado !== 'Disponible') {
    throw errorHttp(409, `El objeto no está disponible (estado: ${objeto.estado}).`);
  }

  // El tipo de objeto es filtro duro: solo se puntúan avisos del mismo tipo,
  // así no se cargan en memoria avisos que nunca podrían corresponder.
  const avisos = await prisma.aviso.findMany({
    where: {
      estado: 'Publicado',
      tipoObjetoId: objeto.tipoObjetoId,
      fechaPerdida: { lte: objeto.fechaRecepcion },
    },
    select: {
      avisoId: true,
      tipoObjetoId: true,
      color: true,
      descripcion: true,
      fechaPerdida: true,
      estado: true,
      recinto: { select: { latitud: true, longitud: true } },
    },
  });

  const objetoParaPuntuar = {
    tipoObjetoId: objeto.tipoObjetoId,
    color: objeto.color,
    descripcion: objeto.descripcion,
    fechaRecepcion: objeto.fechaRecepcion,
    recintoHallazgo: {
      latitud: aNumero(objeto.recintoHallazgo.latitud),
      longitud: aNumero(objeto.recintoHallazgo.longitud),
    },
  };

  const objetoBuscado = {
    id: objeto.objetoId,
    id_tipo_objeto: objeto.tipoObjetoId,
    color: objeto.color,
    fecha_hallazgo: objeto.fechaRecepcion,
  };

  const resultados = avisos
    .map((aviso) =>
      puntuarAviso(objetoParaPuntuar, {
        ...aviso,
        recinto: { latitud: aNumero(aviso.recinto.latitud), longitud: aNumero(aviso.recinto.longitud) },
      })
    )
    .sort((a, b) => b.scoreTotal - a.scoreTotal || a.avisoId - b.avisoId)
    .slice(0, MAX_CANDIDATOS);

  return { objetoBuscado, resultados };
};