// Cálculo puro del puntaje de coincidencia (sin base de datos), para poder probarlo aparte.

export const MAX_CANDIDATOS = 20;

const MS_POR_DIA = 24 * 60 * 60 * 1000;

export const calcularPuntajeFecha = (fechaHallazgo, fechaPerdida) => {
  const difDias = Math.floor(
    Math.abs(new Date(fechaHallazgo) - new Date(fechaPerdida)) / MS_POR_DIA
  );

  if (difDias === 0) return { puntos: 20, coincide: true, detalle: "Mismo día" };
  if (difDias <= 3) return { puntos: 15, coincide: true, detalle: `Diferencia de ${difDias} día(s)` };
  if (difDias <= 7) return { puntos: 10, coincide: true, detalle: `Diferencia de ${difDias} días` };

  return { puntos: 0, coincide: false, detalle: "Más de una semana de diferencia" };
};

export const nivelDe = (score) => {
  if (score >= 80) return "ALTA";
  if (score >= 50) return "MEDIA";
  return "BAJA";
};

/**
 * Puntúa un aviso frente a un objeto
 * @param {{tipoObjetoId:number, color:string, recintoHallazgoId:number, fechaRecepcion:Date}} objeto
 * @param {{avisoId:number, tipoObjetoId:number, color:string, recintoId:number, fechaPerdida:Date, estado:string}} aviso
 */
export const puntuarAviso = (objeto, aviso) => {
  const coincideTipo = aviso.tipoObjetoId === objeto.tipoObjetoId;
  const puntosTipo = coincideTipo ? 40 : 0;

  const coincideUbicacion = aviso.recintoId === objeto.recintoHallazgoId;
  const puntosUbicacion = coincideUbicacion ? 25 : 0;

  const coincideColor = aviso.color?.trim().toLowerCase() === objeto.color?.trim().toLowerCase();
  const puntosColor = coincideColor ? 15 : 0;

  const resFecha = calcularPuntajeFecha(objeto.fechaRecepcion, aviso.fechaPerdida);

  const scoreTotal = puntosTipo + puntosUbicacion + puntosColor + resFecha.puntos;

  return {
    avisoId: aviso.avisoId,
    aviso_id: aviso.avisoId,
    scoreTotal,
    porcentaje_match: scoreTotal,
    detalles: {
      id: aviso.avisoId,
      id_tipo_objeto: aviso.tipoObjetoId,
      color: aviso.color,
      id_sede: aviso.recintoId,
      fecha_perdida: aviso.fechaPerdida,
      estado: aviso.estado.toLowerCase(),
    },
    nivelCoincidencia: nivelDe(scoreTotal),
    desglose: {
      tipo: { puntos: puntosTipo, maxPuntos: 40, coincide: coincideTipo },
      ubicacion: { puntos: puntosUbicacion, maxPuntos: 25, coincide: coincideUbicacion },
      color: { puntos: puntosColor, maxPuntos: 15, coincide: coincideColor },
      fecha: { puntos: resFecha.puntos, maxPuntos: 20, coincide: resFecha.coincide, detalle: resFecha.detalle },
    },
  };
};