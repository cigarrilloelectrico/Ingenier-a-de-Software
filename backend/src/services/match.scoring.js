// Cálculo puro del puntaje de coincidencia (sin base de datos), para poder probarlo aparte.
//
// Pesos (suman 100): tipo 40, ubicación 20, señas 20, fecha 10, color 10.
// El tipo de objeto ya se filtró en la consulta, así que siempre suma sus 40 puntos;
// se conserva en el desglose para no cambiar la forma de la respuesta.

export const MAX_CANDIDATOS = 20;

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const RADIO_TIERRA_METROS = 6371000;

const PESOS = { tipo: 40, ubicacion: 20, senas: 20, fecha: 10, color: 10 };

// Sin señas parecidas el máximo es 80, así que ALTA exige algo de similitud en la descripción
const UMBRAL_ALTA = 85;
const UMBRAL_MEDIA = 50;

// ---------- Ubicación (RF20: "cercanía entre el lugar del hallazgo y el lugar de la pérdida") ----------

/**
 * Distancia entre dos puntos (lat/long en grados), en metros. Fórmula de Haversine.
 * Suficientemente precisa para distancias cortas dentro de un campus.
 */
export const distanciaMetros = (a, b) => {
  const radianes = (grados) => (grados * Math.PI) / 180;
  const dLat = radianes(b.latitud - a.latitud);
  const dLon = radianes(b.longitud - a.longitud);

  const senoLatMedio =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radianes(a.latitud)) * Math.cos(radianes(b.latitud)) * Math.sin(dLon / 2) ** 2;

  return 2 * RADIO_TIERRA_METROS * Math.asin(Math.sqrt(senoLatMedio));
};

/**
 * Puntaje de ubicación: no es todo o nada, decae con la distancia entre el recinto
 * donde se encontró el objeto y el recinto donde el alumno declaró haberlo perdido.
 * Los metros de corte son un supuesto inicial para el campus; ajustarlos con el equipo
 * si en la práctica resultan muy estrictos o muy laxos.
 */
export const calcularPuntajeUbicacion = (metros) => {
  if (metros <= 5) return { puntos: 20, detalle: "Mismo recinto" };
  if (metros <= 150) return { puntos: 14, detalle: `A ${Math.round(metros)} m, recinto cercano` };
  if (metros <= 400) return { puntos: 7, detalle: `A ${Math.round(metros)} m, mismo sector del campus` };

  return { puntos: 0, detalle: `A ${Math.round(metros)} m, recinto lejano` };
};

// ---------- Señas (texto) ----------

const raiz = (palabra) =>
  palabra.length > 4 && palabra.endsWith("s") ? palabra.slice(0, -1) : palabra; // mochilas -> mochila

// Palabras que no ayudan a distinguir un objeto de otro, más las propias del dominio
const PALABRAS_VACIAS = new Set([
  "los", "las", "una", "unos", "unas", "del", "con", "sin", "por", "para", "que", "como",
  "pero", "muy", "mas", "sus", "mis", "tiene", "tenia", "esta", "este", "esto", "ese",
  "esa", "eso", "hay", "era", "son", "fue", "han", "ser", "hacia", "desde", "sobre",
  "entre", "cuando", "donde", "tambien", "solo", "algo", "todo", "toda",
  // dominio: aparecen en casi todas las descripciones
  "perdi", "perdido", "perdida", "perdimos", "encontre", "encontrado", "encontrada",
  "objeto", "dejado", "olvide", "olvidado",
]);

/**
 * Convierte una descripción en sus palabras significativas: minúsculas, sin tildes ni signos
 * y sin palabras vacías. Devuelve un Map raíz -> palabra original, para comparar por raíz
 * (mochila = mochilas) pero mostrar la palabra tal como se escribió.
 * @param {string|null|undefined} texto
 * @returns {Map<string, string>}
 */
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

/**
 * Similitud de Dice entre dos descripciones: 2·|A∩B| / (|A|+|B|), de 0 a 1.
 * Se eligió sobre Jaccard porque el aviso y el objeto suelen tener largos muy distintos.
 */
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

// ---------- Fecha y nivel ----------

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
  if (score >= UMBRAL_ALTA) return "ALTA";
  if (score >= UMBRAL_MEDIA) return "MEDIA";
  return "BAJA";
};

// ---------- Puntaje total ----------

/**
 * Puntúa un aviso frente a un objeto.
 * @param {{tipoObjetoId:number, color:string, descripcion:string, fechaRecepcion:Date, recintoHallazgo:{latitud:number,longitud:number}}} objeto
 * @param {{avisoId:number, tipoObjetoId:number, color:string, descripcion:string, fechaPerdida:Date, estado:string, recinto:{latitud:number,longitud:number}}} aviso
 */
export const puntuarAviso = (objeto, aviso) => {
  const coincideTipo = aviso.tipoObjetoId === objeto.tipoObjetoId;
  const puntosTipo = coincideTipo ? PESOS.tipo : 0;

  const metros = distanciaMetros(objeto.recintoHallazgo, aviso.recinto);
  const resUbicacion = calcularPuntajeUbicacion(metros);

  const coincideColor = aviso.color?.trim().toLowerCase() === objeto.color?.trim().toLowerCase();
  const puntosColor = coincideColor ? PESOS.color : 0;

  const senas = compararSenas(objeto.descripcion, aviso.descripcion);
  const puntosSenas = Math.round(senas.similitud * PESOS.senas);

  const resFecha = calcularPuntajeFecha(objeto.fechaRecepcion, aviso.fechaPerdida);

  const scoreTotal = puntosTipo + resUbicacion.puntos + puntosColor + puntosSenas + resFecha.puntos;

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
      fecha_perdida: aviso.fechaPerdida,
      estado: aviso.estado.toLowerCase(),
    },
    nivelCoincidencia: nivelDe(scoreTotal),
    desglose: {
      tipo: { puntos: puntosTipo, maxPuntos: PESOS.tipo, coincide: coincideTipo },
      ubicacion: {
        puntos: resUbicacion.puntos,
        maxPuntos: PESOS.ubicacion,
        coincide: resUbicacion.puntos === PESOS.ubicacion,
        distanciaMetros: Math.round(metros),
        detalle: resUbicacion.detalle,
      },
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