import { useEffect, useState } from "react";
import { obtenerCoincidenciasService } from "../services/match.services";

export function useCoincidencias(idInicial) {
  const [objetoId, setObjetoId] = useState(idInicial);
  const [intento, setIntento] = useState(0); // permite repetir la búsqueda del mismo id
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false; // evita mostrar una respuesta vieja si se buscó otro objeto mientras tanto

    obtenerCoincidenciasService(objetoId)
      .then((res) => {
        if (cancelado) return;
        setResultado(res);
        setError(null);
      })
      .catch((err) => {
        if (cancelado) return;
        setResultado(null);
        setError({ mensaje: err.message, status: err.status });
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [objetoId, intento]);

  const buscar = (id) => {
    setLoading(true);
    setObjetoId(id);
    setIntento((n) => n + 1);
  };

  return { resultado, loading, error, buscar };
}