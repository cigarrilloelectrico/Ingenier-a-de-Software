import { useEffect } from "react";

// Ventana modal. Sin onCerrar no se puede cerrar, para cambios obligatorios.
export default function Modal({ titulo, descripcion, onCerrar, children }) {
  useEffect(() => {
    if (!onCerrar) return undefined;

    const cerrarConEscape = (evento) => {
      if (evento.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", cerrarConEscape);
    return () => window.removeEventListener("keydown", cerrarConEscape);
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
        {descripcion && <p className="mt-1 text-sm text-slate-500">{descripcion}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
