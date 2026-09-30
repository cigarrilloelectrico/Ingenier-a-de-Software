import { urlFotoObjeto } from "../services/inventario.services";

// Color de la etiqueta según el estado del objeto
const ESTILOS_ESTADO = {
  Disponible: "bg-green-100 text-green-800",
  Reservado: "bg-amber-100 text-amber-800",
  Entregado: "bg-slate-200 text-slate-700",
};

export default function ObjetoCard({ objeto }) {
  // Se muestra la primera foto del objeto como portada
  const foto = objeto.fotos[0];
  const urlFoto = foto ? urlFotoObjeto(foto.fotoUrl) : null;

  // La fecha viene como "2026-09-20T00:00:00.000Z"; con timeZone UTC no se corre un día atrás en Chile
  const fechaRecepcion = new Date(objeto.fechaRecepcion).toLocaleDateString("es-CL", { timeZone: "UTC" });

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="aspect-[4/3] bg-slate-100">
        {urlFoto ? (
          <img
            src={urlFoto}
            alt={objeto.tipoObjeto.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Sin foto</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900">{objeto.tipoObjeto.nombre}</h3>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[objeto.estado]}`}>
            {objeto.estado}
          </span>
        </div>

        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">Color:</span> {objeto.color}
        </p>
        <p className="line-clamp-3 text-sm text-slate-600">{objeto.descripcion}</p>

        <dl className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs">
          <div>
            <dt className="text-slate-400">Recinto</dt>
            <dd className="font-medium text-slate-700">{objeto.recinto.nombre}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Recibido</dt>
            <dd className="font-medium text-slate-700">{fechaRecepcion}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-slate-400">En custodia</dt>
            <dd className="font-medium text-slate-700">
              {objeto.antiguedadDias === 1 ? "1 día" : `${objeto.antiguedadDias} días`}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
