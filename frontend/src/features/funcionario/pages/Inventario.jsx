import { useInventario } from "../hooks/useInventario";
import { useRecintos } from "../../../hooks/useRecintos";
import ObjetoCard from "../components/ObjetoCard";

const ESTILO_CAMPO =
  "rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";
const ESTILO_ETIQUETA = "flex flex-col gap-1 text-sm font-medium text-slate-700";
const ESTILO_BOTON_PAGINA =
  "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40";

export default function Inventario() {
  const {
    objetos,
    filtros,
    loading,
    error,
    cambiarFiltro,
    paginaSiguiente,
    paginaAnterior,
    hayPaginaSiguiente,
    hayPaginaAnterior,
  } = useInventario();
  const { recintos } = useRecintos();

  return (
    <div>
      {/* Encabezado */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Inventario</h1>
          <p className="text-sm text-slate-500">Objetos encontrados en todos los recintos</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {/* Filtros */}
        <section className="grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <label className={ESTILO_ETIQUETA}>
            Recinto
            <select
              className={ESTILO_CAMPO}
              value={filtros.recintoId}
              onChange={(evento) => cambiarFiltro("recintoId", evento.target.value)}
            >
              <option value="">Todos</option>
              {recintos.map((recinto) => (
                <option key={recinto.recintoId} value={recinto.recintoId}>
                  {recinto.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className={ESTILO_ETIQUETA}>
            Estado
            <select
              className={ESTILO_CAMPO}
              value={filtros.estado}
              onChange={(evento) => cambiarFiltro("estado", evento.target.value)}
            >
              <option value="">Todos</option>
              <option value="Disponible">Disponible</option>
              <option value="Reservado">Reservado</option>
              <option value="Entregado">Entregado</option>
            </select>
          </label>

          <label className={ESTILO_ETIQUETA}>
            Desde
            <input
              type="date"
              className={ESTILO_CAMPO}
              value={filtros.fechaDesde}
              onChange={(evento) => cambiarFiltro("fechaDesde", evento.target.value)}
            />
          </label>

          <label className={ESTILO_ETIQUETA}>
            Hasta
            <input
              type="date"
              className={ESTILO_CAMPO}
              value={filtros.fechaHasta}
              onChange={(evento) => cambiarFiltro("fechaHasta", evento.target.value)}
            />
          </label>
        </section>

        {/* Error del backend (ej: sesión expirada) */}
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
        )}

        {/* Cargando */}
        {loading && <p className="p-8 text-center text-slate-500">Cargando inventario...</p>}

        {/* Sin resultados */}
        {!loading && !error && objetos.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
            No hay objetos que coincidan con los filtros.
          </p>
        )}

        {/* Grilla de objetos */}
        {!loading && objetos.length > 0 && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {objetos.map((objeto) => (
              <ObjetoCard key={objeto.objetoId} objeto={objeto} />
            ))}
          </section>
        )}

        {/* Paginación */}
        <nav className="flex items-center justify-between">
          <button className={ESTILO_BOTON_PAGINA} onClick={paginaAnterior} disabled={!hayPaginaAnterior || loading}>
            ← Anterior
          </button>
          <span className="text-sm text-slate-600">Página {filtros.pagina}</span>
          <button className={ESTILO_BOTON_PAGINA} onClick={paginaSiguiente} disabled={!hayPaginaSiguiente || loading}>
            Siguiente →
          </button>
        </nav>
      </main>
    </div>
  );
}
