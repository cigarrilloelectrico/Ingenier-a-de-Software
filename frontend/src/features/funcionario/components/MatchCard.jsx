// Color según el nivel que calcula el backend (ALTA, MEDIA, BAJA)
const ESTILOS_NIVEL = {
  ALTA: { etiqueta: "bg-green-100 text-green-800", barra: "bg-green-500" },
  MEDIA: { etiqueta: "bg-amber-100 text-amber-800", barra: "bg-amber-500" },
  BAJA: { etiqueta: "bg-slate-200 text-slate-700", barra: "bg-slate-400" },
};

// Criterios del desglose, en el orden en que se muestran
const CRITERIOS = [
  { clave: "tipo", nombre: "Tipo de objeto" },
  { clave: "ubicacion", nombre: "Ubicación" },
  { clave: "senas", nombre: "Señas" },
  { clave: "color", nombre: "Color" },
  { clave: "fecha", nombre: "Fecha" },
];

// Texto corto que explica el puntaje de cada criterio
function explicacion(clave, dato) {
  if (clave === "senas") {
    return dato.palabrasEnComun?.length
      ? `En común: ${dato.palabrasEnComun.join(", ")}`
      : "Sin palabras en común";
  }
  // ubicacion y fecha ya traen su propio texto (distancia en metros / diferencia de días)
  if (clave === "ubicacion" || clave === "fecha") return dato.detalle;
  return dato.coincide ? "Coincide" : "No coincide";
}

export default function MatchCard({ coincidencia }) {
  const { scoreTotal, nivelCoincidencia, detalles, desglose } = coincidencia;
  const estilo = ESTILOS_NIVEL[nivelCoincidencia] || ESTILOS_NIVEL.BAJA;

  // La fecha viene como "2026-09-27T00:00:00.000Z"; con timeZone UTC no se corre un día atrás en Chile
  const fechaPerdida = new Date(detalles.fecha_perdida).toLocaleDateString("es-CL", { timeZone: "UTC" });

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">Aviso #{detalles.id}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${estilo.etiqueta}`}>
          {nivelCoincidencia} · {scoreTotal}/100
        </span>
      </div>

      <div className="space-y-1 text-sm text-slate-600">
        {detalles.descripcion && <p className="line-clamp-3">{detalles.descripcion}</p>}
        <p>
          <span className="font-medium text-slate-700">Color declarado:</span> {detalles.color}
        </p>
        <p>
          <span className="font-medium text-slate-700">Perdido el:</span> {fechaPerdida}
        </p>
      </div>

      <ul className="space-y-2 border-t border-slate-100 pt-3">
        {CRITERIOS.filter(({ clave }) => desglose[clave]).map(({ clave, nombre }) => {
          const dato = desglose[clave];
          const porcentaje = dato.maxPuntos ? (dato.puntos / dato.maxPuntos) * 100 : 0;

          return (
            <li key={clave} className="text-xs">
              <div className="flex justify-between text-slate-700">
                <span className="font-medium">{nombre}</span>
                <span>{dato.puntos}/{dato.maxPuntos}</span>
              </div>
              <div className="my-1 h-1.5 rounded-full bg-slate-100">
                <div className={`h-1.5 rounded-full ${estilo.barra}`} style={{ width: `${porcentaje}%` }} />
              </div>
              <p className="text-slate-400">{explicacion(clave, dato)}</p>
            </li>
          );
        })}
      </ul>
    </article>
  );
}