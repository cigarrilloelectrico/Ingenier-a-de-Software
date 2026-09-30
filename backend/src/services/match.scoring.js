// Cálculo puro del puntaje de coincidencia (sin base de datos), para poder probarlo aparte.

export const MAX_CANDIDATOS = 20;

const MS_POR_DIA = 24 * 60 * 60 * 1000;

const PESOS = { tipo: 40, ubicacion: 20, senas: 20, fecha: 10, color: 10 };

// Sin señas parecidas el máximo es 80
const UMBRAL_ALTA = 85;
const UMBRAL_MEDIA = 50;

// Palabras que no ayudan a distinguir un objeto de otro
const PALABRAS_VACIAS = new Set([
  "los", "las", "una", "unos", "unas", "del", "con", "sin", "por", "para", "que", "como",
  "pero", "muy", "mas", "sus", "mis", "tiene", "tenia", "esta", "este", "esto", "ese",
  "esa", "eso", "hay", "era", "son", "fue", "han", "ser", "hacia", "desde", "sobre",
  "entre", "cuando", "donde", "tambien", "solo", "algo", "todo", "toda",
  "perdi", "perdido", "perdida", "perdimos", "encontre", "encontrado", "encontrada",
  "objeto", "dejado", "olvide", "olvidado",
]);

const raiz = (palabra) =>
  palabra.length > 4 && palabra.endsWith("s") ? palabra.slice(0, -1) : palabra;


export const extraerPalabras = (texto) => {  
  const palabras = new Map();
  if (!texto) return palabras;
 
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((p) => (p.length >= 3 || /\d/.test(p)) && !PALABRAS_VACIAS.has(p)) // conserva "s10", "2b"
    .forEach((p) => palabras.set(raiz(p), p));

  return palabras;
};

export const compararSenas = (textoObjeto, textoAviso) => {
  const a = extraerPalabras(textoObjeto);
  const b = extraerPalabras(textoAviso);
 
  if (a.size === 0 || b.size === 0) return { similitud: 0, palabrasEnComun: [] };
 
  const palabrasEnComun = [...a].filter(([r]) => b.has(r)).map(([, original]) => original);
  return {
    similitud: (2 * palabrasEnComun.length) / (a.size + b.size),
    palabrasEnComun,
  };
};

export const calcularPuntajeFecha = (fechaHallazgo, fechaPerdida) => {
  const difDias = Math.floor(
    Math.abs(new Date(fechaHallazgo) - new Date(fechaPerdida)) / MS_POR_DIA
  );

  if (difDias === 0) return { puntos: 10, coincide: true, detalle: "Mismo día" };
  if (difDias <= 3) return { puntos: 8, coincide: true, detalle: `Diferencia de ${difDias} día(s)` };
  if (difDias <= 7) return { puntos: 5, coincide: true, detalle: `Diferencia de ${difDias} días` };

  return { puntos: 0, coincide: false, detalle: "Más de una semana de diferencia" };
};

export const nivelDe = (score) => {
  if (score >= 80) return "ALTA";
  if (score >= 50) return "MEDIA";
  return "BAJA";
};

/**
 * Puntúa un aviso frente a un objeto.
 * @param {{tipoObjetoId:number, color:string, descripcion:string, recintoHallazgoId:number, fechaRecepcion:Date}} objeto
 * @param {{avisoId:number, tipoObjetoId:number, color:string, descripcion:string, recintoId:number, fechaPerdida:Date, estado:string}} aviso
 */
export const puntuarAviso = (objeto, aviso) => {
  const coincideTipo = aviso.tipoObjetoId === objeto.tipoObjetoId;
  const puntosTipo = coincideTipo ? PESOS.tipo : 0;

  const coincideUbicacion = aviso.recintoId === objeto.recintoHallazgoId;
  const puntosUbicacion = coincideUbicacion ? PESOS.ubicacion : 0;

  const coincideColor = aviso.color?.trim().toLowerCase() === objeto.color?.trim().toLowerCase();
  const puntosColor = coincideColor ? PESOS.color : 0;

  const senas = compararSenas(objeto.descripcion, aviso.descripcion);
  const puntosSenas = Math.round(senas.similitud * PESOS.senas);

  const resFecha = calcularPuntajeFecha(objeto.fechaRecepcion, aviso.fechaPerdida);

  const scoreTotal = puntosTipo + puntosUbicacion + puntosColor + puntosSenas + resFecha.puntos;

  return {
    avisoId: aviso.avisoId,
    aviso_id: aviso.avisoId,
    scoreTotal,
    porcentaje_match: scoreTotal,
    detalles: {
      id: aviso.avisoId,
      id_tipo_objeto: aviso.tipoObjetoId,
      color: aviso.color,
      descripcion: aviso.descripcion,
      id_sede: aviso.recintoId,
      fecha_perdida: aviso.fechaPerdida,
      estado: aviso.estado.toLowerCase(),
    },
    nivelCoincidencia: nivelDe(scoreTotal),
    desglose: {
      tipo: { puntos: puntosTipo, maxPuntos: PESOS.tipo, coincide: coincideTipo },
      ubicacion: { puntos: puntosUbicacion, maxPuntos: PESOS.ubicacion, coincide: coincideUbicacion },
      senas: {
        puntos: puntosSenas,
        maxPuntos: PESOS.senas,
        coincide: senas.palabrasEnComun.length > 0,
        similitud: Number(senas.similitud.toFixed(2)),
        palabrasEnComun: senas.palabrasEnComun,
      },
      color: { puntos: puntosColor, maxPuntos: PESOS.color, coincide: coincideColor },
      fecha: { puntos: resFecha.puntos, maxPuntos: PESOS.fecha, coincide: resFecha.coincide, detalle: resFecha.detalle },
    },
  };
};