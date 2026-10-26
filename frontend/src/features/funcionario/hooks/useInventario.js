import { useEffect, useState } from "react";
import { obtenerInventarioService } from "../services/inventario.services";

const OBJETOS_POR_PAGINA = 20;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

const FILTROS_INICIALES = {
  pagina: 1,
  recintoId: "",
  tipoObjetoId: "",
  estado: "",
  fechaDesde: "",
  fechaHasta: "",
};

export function useInventario() {
  const [objetos, setObjetos] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vuelve a cargar cada vez que cambia un filtro o la página
  useEffect(() => {
    const fetchInventario = async () => {
      try {
        // Los selects vacíos ("") no se envían: el backend solo filtra por lo que viene
        const params = {
          pagina: filtros.pagina,
          recintoId: filtros.recintoId || undefined,
          tipoObjetoId: filtros.tipoObjetoId || undefined,
          estado: filtros.estado || undefined,
          fechaDesde: filtros.fechaDesde || undefined,
          fechaHasta: filtros.fechaHasta || undefined,
        };

        const res = await obtenerInventarioService(params);

        // Días que lleva cada objeto en custodia, calculados una vez al recibir los datos
        const hoy = Date.now();
        const objetosConAntiguedad = (res.data || []).map((objeto) => ({
          ...objeto,
          antiguedadDias: Math.floor((hoy - new Date(objeto.fechaRecepcion)) / MS_POR_DIA),
        }));

        setObjetos(objetosConAntiguedad);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventario();
  }, [filtros]);

  // Al cambiar un filtro se vuelve a la página 1
  const cambiarFiltro = (nombre, valor) => {
    setLoading(true);
    setFiltros({ ...filtros, [nombre]: valor, pagina: 1 });
  };

  const limpiarFiltros = () => {
    setLoading(true);
    setFiltros(FILTROS_INICIALES);
  };

  const paginaSiguiente = () => {
    setLoading(true);
    setFiltros({ ...filtros, pagina: filtros.pagina + 1 });
  };

  const paginaAnterior = () => {
    setLoading(true);
    setFiltros({ ...filtros, pagina: filtros.pagina - 1 });
  };

  // Para volver a pedir el inventario después de registrar o corregir un objeto
  const recargar = () => {
    setLoading(true);
    setFiltros({ ...filtros });
  };

  // Si llegaron 20 objetos puede haber otra página; si llegaron menos, esta es la última
  const hayPaginaSiguiente = objetos.length === OBJETOS_POR_PAGINA;
  const hayPaginaAnterior = filtros.pagina > 1;

  return {
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
    recargar,
  };
}
