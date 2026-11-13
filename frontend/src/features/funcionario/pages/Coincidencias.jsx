import { useState } from "react";
import { Link } from "react-router-dom";
import { useCoincidencias } from "../hooks/useCoincidencias";
import MatchCard from "../components/MatchCard";

const ESTILO_CAMPO =
  "w-32 rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

// Objeto de prueba del seed; más adelante el id llegará desde el detalle del inventario
const ID_DE_PRUEBA = 9001;

export default function Coincidencias() {
  const { resultado, loading, error, buscar } = useCoincidencias(ID_DE_PRUEBA);
  const [idIngresado, setIdIngresado] = useState(String(ID_DE_PRUEBA));

  const enviar = (evento) => {
    evento.preventDefault();
    if (idIngresado) buscar(Number(idIngresado));
  };

  const total = resultado?.totalResultados ?? 0;

  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Coincidencias</h1>
          <p className="text-sm text-slate-500">
            Avisos de pérdida que podrían corresponder a un objeto. Es una ayuda: la decisión es del funcionario (RF20).
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <form onSubmit={enviar} className="flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 shadow-sm">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            ID del objeto
            <input
              type="number"
              min="1"
              required
              className={ESTILO_CAMPO}
              value={idIngresado}
              onChange={(evento) => setIdIngresado(evento.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buscar coincidencias
          </button>
        </form>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error.status === 401 ? (
              <>Tu sesión expiró. <Link to="/login" className="underline">Inicia sesión de nuevo</Link>.</>
            ) : (
              error.mensaje
            )}
          </p>
        )}

        {loading && <p className="p-8 text-center text-slate-500">Analizando coincidencias...</p>}

        {!loading && resultado && (
          <>
            <p className="text-sm text-slate-600">
              Objeto #{resultado.objetoConsultado.id} · {total} {total === 1 ? "aviso posible" : "avisos posibles"}
            </p>

            {total === 0 ? (
              <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
                No hay avisos publicados que coincidan con este objeto.
              </p>
            ) : (
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {resultado.data.map((coincidencia) => (
                  <MatchCard key={coincidencia.avisoId} coincidencia={coincidencia} />
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}