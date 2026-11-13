// Campo de texto con el mismo estilo que CampoSelect
export default function CampoTexto({ etiqueta, valor, onCambiar, tipo = "text", placeholder, autoComplete, autoFocus = false }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{etiqueta}</span>
      <input
        type={tipo}
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
      />
    </label>
  );
}
