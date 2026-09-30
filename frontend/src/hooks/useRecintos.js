import { useEffect, useState } from "react";
import { obtenerRecintosService } from "../services/recinto.services";

// Recintos activos para los selects y el mapa; los usan todas las vistas
export function useRecintos() {
  const [recintos, setRecintos] = useState([]);

  useEffect(() => {
    const fetchRecintos = async () => {
      try {
        const res = await obtenerRecintosService();
        setRecintos(res.data || []);
      } catch (err) {
        console.error("No se pudieron cargar los recintos:", err.message);
      }
    };

    fetchRecintos();
  }, []);

  return { recintos };
}
