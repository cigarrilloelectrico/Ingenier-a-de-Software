// Estilos de botón compartidos para que todas las pantallas se vean igual
const BASE =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50";

export const ESTILO_BOTON_PRIMARIO = `${BASE} bg-blue-900 text-white hover:bg-blue-800 focus-visible:ring-blue-600/30`;
export const ESTILO_BOTON_SECUNDARIO = `${BASE} border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400/30`;
export const ESTILO_BOTON_PELIGRO = `${BASE} bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/30`;
