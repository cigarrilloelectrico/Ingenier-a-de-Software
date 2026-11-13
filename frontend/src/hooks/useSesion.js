import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cerrarSesionService, obtenerPerfilService } from "../services/auth.services";
import { rutaInicioPorRol } from "../utils/rutaInicio";

// Protege una vista: sin sesión manda al login, y con sesión de otro rol manda a la vista de ese rol
export function useSesion(rolPermitido) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [revisando, setRevisando] = useState(true);

  useEffect(() => {
    const revisarSesion = async () => {
      try {
        const respuesta = await obtenerPerfilService();
        const usuarioSesion = respuesta.data;

        if (usuarioSesion.rol !== rolPermitido) {
          navigate(rutaInicioPorRol(usuarioSesion.rol), { replace: true });
          return;
        }

        setUsuario(usuarioSesion);
        setRevisando(false);
      } catch {
        // Sin sesión o con la sesión expirada
        navigate("/login", { replace: true });
      }
    };

    revisarSesion();
  }, [rolPermitido, navigate]);

  const cerrarSesion = async () => {
    try {
      await cerrarSesionService();
    } finally {
      // Aunque falle (ej: la sesión ya había expirado), vuelve al login
      navigate("/login", { replace: true });
    }
  };

  return { usuario, revisando, cerrarSesion };
}
