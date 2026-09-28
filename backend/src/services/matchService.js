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

const calcularCoincidencias = (objetoBuscado, listaAvisos) => {
  const avisosValidos = listaAvisos.filter(aviso => {
    if (aviso.estado !== 'publicado') return false; 
    const fechaHallazgo = new Date(objetoBuscado.fecha_hallazgo);
    const fechaPerdida = new Date(aviso.fecha_perdida);
    if (fechaPerdida > fechaHallazgo) return false;

    return true;
  });

  return avisosValidos.map(aviso => {
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
      scoreTotal,
      nivelCoincidencia: nivel,
      desglose: {
        tipo: { puntos: puntosTipo, maxPuntos: 40, coincide: coincideTipo },
        ubicacion: { puntos: puntosUbicacion, maxPuntos: 25, coincide: coincideUbicacion },
        color: { puntos: puntosColor, maxPuntos: 15, coincide: coincideColor },
        fecha: { puntos: resFecha.puntos, maxPuntos: 20, coincide: resFecha.coincide, detalle: resFecha.detalle }
      }
    };
  }).sort((a, b) => b.scoreTotal - a.scoreTotal);
};

module.exports = { calcularCoincidencias };