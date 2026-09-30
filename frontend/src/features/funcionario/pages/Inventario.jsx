import { useInventario } from "../hooks/useInventario";
import { useRecintos } from "../../../hooks/useRecintos";
import ObjetoCard from "../components/ObjetoCard";
import CampoSelect from "../../../components/CampoSelect";
import CampoFecha from "../../../components/CampoFecha";

const OPCIONES_ESTADO = [
  { valor: "Disponible", texto: "Disponible" },
  { valor: "Reservado", texto: "Reservado" },
  { valor: "Entregado", texto: "Entregado" },
];
const ESTILO_BOTON_PAGINA =
  "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40";

export default function Inventario() {
  const {
    objetos,
    filtros,
    loading,
    error,
    cambiarFiltro,
    limpiarFiltros,
    paginaSiguiente,
    paginaAnterior,
    hayPaginaSiguiente,
    hayPaginaAnterior,
  } = useInventario();
  const { recintos } = useRecintos();

  // El select espera { valor, texto }
  const opcionesRecinto = recintos.map((recinto) => ({ valor: recinto.recintoId, texto: recinto.nombre }));

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
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Filtros</h2>
            <button onClick={limpiarFiltros} className="text-sm font-medium text-blue-700 hover:text-blue-900">
              Limpiar filtros
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CampoSelect
              etiqueta="Recinto"
              valor={filtros.recintoId}
              onCambiar={(valor) => cambiarFiltro("recintoId", valor)}
              opciones={opcionesRecinto}
            />
            <CampoSelect
              etiqueta="Estado"
              valor={filtros.estado}
              onCambiar={(valor) => cambiarFiltro("estado", valor)}
              opciones={OPCIONES_ESTADO}
            />
            <CampoFecha etiqueta="Desde" valor={filtros.fechaDesde} onCambiar={(valor) => cambiarFiltro("fechaDesde", valor)} />
            <CampoFecha etiqueta="Hasta" valor={filtros.fechaHasta} onCambiar={(valor) => cambiarFiltro("fechaHasta", valor)} />
          </div>
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
