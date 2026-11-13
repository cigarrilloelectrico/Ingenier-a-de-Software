import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import CambiarPasswordTemporal from "./CambiarPasswordTemporal";
import { logoutService, obtenerPerfilService } from "../../../services/auth.services";

const ICONO_INVENTARIO = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const ICONO_COINCIDENCIAS = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

// Enlaces del menú del funcionario; agregar aquí cada pantalla nueva
const ENLACES = [
  { ruta: "/funcionario/inventario", texto: "Inventario", icono: ICONO_INVENTARIO },
  { ruta: "/funcionario/coincidencias", texto: "Coincidencias", icono: ICONO_COINCIDENCIAS },
];

// Estructura de todas las pantallas del funcionario: barra lateral + contenido
export default function FuncionarioLayout() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [passwordCambiada, setPasswordCambiada] = useState(false);

  useEffect(() => {
    obtenerPerfilService().then((respuesta) => setUsuario(respuesta.data)).catch(() => undefined);
  }, []);

  const cerrarSesion = async () => {
    try {
      await logoutService();
    } catch {
      // Aunque el servidor no responda (ej: sesión ya vencida), se sale igual al login
    }
    navigate("/login", { replace: true });
  };

  const debeCambiarPassword = usuario?.passwordTemporal && !passwordCambiada;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar rol="Funcionario" enlaces={ENLACES} usuario={usuario} onCerrarSesion={cerrarSesion} />
      <div className="flex-1 overflow-x-hidden">
        {!debeCambiarPassword && <Outlet />}
      </div>
      {debeCambiarPassword && (
        <CambiarPasswordTemporal
          onCambiada={() => setPasswordCambiada(true)}
          onCerrarSesion={cerrarSesion}
        />
      )}
    </div>
  );
}