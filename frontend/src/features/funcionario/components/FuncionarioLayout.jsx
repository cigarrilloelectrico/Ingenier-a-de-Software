import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ArchiveBoxIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../../components/Sidebar";
import CambiarPasswordTemporal from "./CambiarPasswordTemporal";
import { useSesion } from "../../../hooks/useSesion";

const ICONO_INVENTARIO = <ArchiveBoxIcon className="h-5 w-5" strokeWidth={1.8} />;
const ICONO_COINCIDENCIAS = <MagnifyingGlassIcon className="h-5 w-5" strokeWidth={1.8} />;

// Enlaces del menú del funcionario; agregar aquí cada pantalla nueva
const ENLACES = [
  { ruta: "/funcionario/inventario", texto: "Inventario", icono: ICONO_INVENTARIO },
  { ruta: "/funcionario/coincidencias", texto: "Coincidencias", icono: ICONO_COINCIDENCIAS },
];

// Estructura de todas las pantallas del funcionario: barra lateral + contenido
export default function FuncionarioLayout() {
  const { usuario, revisando, cerrarSesion } = useSesion("Funcionario");
  // Pasa a true cuando guarda su contraseña propia en el popup
  const [passwordCambiada, setPasswordCambiada] = useState(false);

  // Mientras se revisa la sesión no se muestra nada: así nadie ve una pantalla que no le corresponde
  if (revisando) return null;

  // Con la contraseña temporal no se muestra ninguna pantalla; el backend también las bloquea (RF35)
  const debeCambiarPassword = usuario.passwordTemporal && !passwordCambiada;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar rol="Funcionario" enlaces={ENLACES} usuario={usuario} onCerrarSesion={cerrarSesion} />
      <div className="flex-1 overflow-x-hidden">
        {!debeCambiarPassword && <Outlet />}
      </div>
      {debeCambiarPassword && (
        <CambiarPasswordTemporal onCambiada={() => setPasswordCambiada(true)} onCerrarSesion={cerrarSesion} />
      )}
    </div>
  );
}
