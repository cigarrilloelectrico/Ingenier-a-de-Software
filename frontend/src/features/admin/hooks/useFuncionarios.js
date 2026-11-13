import { useEffect, useState } from "react";
import { obtenerFuncionariosService } from "../services/funcionario.services";

const FILTROS_INICIALES = { recintoId: "", estado: "" };

export function useFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vuelve a cargar cada vez que cambia un filtro
  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        // Los selects vacíos ("") no se envían: el backend solo filtra por lo que viene
        const params = {
          recintoId: filtros.recintoId || undefined,
          estado: filtros.estado || undefined,
        };

        const respuesta = await obtenerFuncionariosService(params);
        setFuncionarios(respuesta.data || []);
        setError(null);
      } catch (errorCarga) {
        setError(errorCarga.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, [filtros]);

  const cambiarFiltro = (nombre, valor) => {
    setLoading(true);
    setFiltros({ ...filtros, [nombre]: valor });
  };

  const limpiarFiltros = () => {
    setLoading(true);
    setFiltros(FILTROS_INICIALES);
  };

  // Después de una acción (agregar, desactivar...) la tabla se actualiza sin mostrar "Cargando"
  const recargar = () => {
    setFiltros({ ...filtros });
  };

  return { funcionarios, filtros, loading, error, cambiarFiltro, limpiarFiltros, recargar };
}
