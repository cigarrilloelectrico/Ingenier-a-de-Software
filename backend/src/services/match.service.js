import { prisma } from '../config/configDb.js';

const calcularPuntajeFecha = (fechaHallazgo, fechaPerdida) => {
  const f1 = new Date(fechaHallazgo);
  const f2 = new Date(fechaPerdida);

  const difMilisegundos = Math.abs(f1 - f2);
  const difDias = Math.floor(difMilisegundos / (1000 * 60 * 60 * 24));

  if (difDias === 0) return { puntos: 20, coincide: true, detalle: "Mismo día" };
  if (difDias <= 3)  return { puntos: 15, coincide: true, detalle: `Diferencia de ${difDias} día(s)` };
  if (difDias <= 7)  return { puntos: 10, coincide: true, detalle: `Diferencia de ${difDias} días` };
  
  return { puntos: 0, coincide: false, detalle: "Más de una semana de diferencia" };
};

export const calcularCoincidencias = async (idObjeto) => {
  const objeto = await prisma.objeto.findUnique({
    where: { objetoId: idObjeto },
  });

  if (!objeto) {
    throw new Error('No se encontró el objeto reportado para calcular coincidencias.');
  }

  const avisos = await prisma.aviso.findMany({
    where: {
      estado: 'Publicado',
      fechaPerdida: { lte: objeto.fechaRecepcion },
    },
  });

  const objetoBuscado = {
    id: objeto.objetoId,
    id_tipo_objeto: objeto.tipoObjetoId,
    color: objeto.color,
    id_sede: objeto.recintoHallazgoId,
    fecha_hallazgo: objeto.fechaRecepcion,
  };

  const listaAvisos = avisos.map(aviso => ({
    id: aviso.avisoId,
    id_tipo_objeto: aviso.tipoObjetoId,
    color: aviso.color,
    id_sede: aviso.recintoId,
    fecha_perdida: aviso.fechaPerdida,
    estado: aviso.estado.toLowerCase(),
  }));

  const avisosValidos = listaAvisos.filter(aviso => {
    if (aviso.estado !== 'publicado') return false; 
    const fechaHallazgo = new Date(objetoBuscado.fecha_hallazgo);
    const fechaPerdida = new Date(aviso.fecha_perdida);
    if (fechaPerdida > fechaHallazgo) return false;

    return true;
  });

  const resultados = avisosValidos.map(aviso => {
    const coincideTipo = aviso.id_tipo_objeto === objetoBuscado.id_tipo_objeto;
    const puntosTipo = coincideTipo ? 40 : 0;

    const coincideUbicacion = aviso.id_sede === objetoBuscado.id_sede;
    const puntosUbicacion = coincideUbicacion ? 25 : 0;

    const coincideColor = aviso.color?.toLowerCase() === objetoBuscado.color?.toLowerCase();
    const puntosColor = coincideColor ? 15 : 0;

    const resFecha = calcularPuntajeFecha(objetoBuscado.fecha_hallazgo, aviso.fecha_perdida);

    const scoreTotal = puntosTipo + puntosUbicacion + puntosColor + resFecha.puntos;

    let nivel = "BAJA";
    if (scoreTotal >= 80) nivel = "ALTA";
    else if (scoreTotal >= 50) nivel = "MEDIA";

    return {
      avisoId: aviso.id,
      aviso_id: aviso.id,
      scoreTotal,
      porcentaje_match: scoreTotal,
      detalles: aviso,
      nivelCoincidencia: nivel,
      desglose: {
        tipo: { puntos: puntosTipo, maxPuntos: 40, coincide: coincideTipo },
        ubicacion: { puntos: puntosUbicacion, maxPuntos: 25, coincide: coincideUbicacion },
        color: { puntos: puntosColor, maxPuntos: 15, coincide: coincideColor },
        fecha: { puntos: resFecha.puntos, maxPuntos: 20, coincide: resFecha.coincide, detalle: resFecha.detalle }
      }
    };
  }).sort((a, b) => b.scoreTotal - a.scoreTotal);

  return { objetoBuscado, resultados };
};