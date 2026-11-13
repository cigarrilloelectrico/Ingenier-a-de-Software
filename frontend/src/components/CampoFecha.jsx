import { CalendarIcon } from "@heroicons/react/24/outline";

export default function CampoFecha({ etiqueta, valor, onCambiar }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{etiqueta}</span>
      <div className="relative">
        <input
          type="date"
          value={valor}
          onChange={(evento) => onCambiar(evento.target.value)}
          className="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-10 text-sm text-slate-800 transition hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
        />
        <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.8} />
      </div>
    </label>
  );
}
