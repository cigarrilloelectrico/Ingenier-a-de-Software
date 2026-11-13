import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Select con el estilo de la app: se oculta la flecha del navegador y se dibuja una propia
export default function CampoSelect({ etiqueta, valor, onCambiar, opciones, textoTodos = "Todos" }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{etiqueta}</span>
      <div className="relative">
        <select
          value={valor}
          onChange={(evento) => onCambiar(evento.target.value)}
          className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-10 text-sm text-slate-800 transition hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
        >
          <option value="">{textoTodos}</option>
          {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
      </div>
    </label>
  );
}
