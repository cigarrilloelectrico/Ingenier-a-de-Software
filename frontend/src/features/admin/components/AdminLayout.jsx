import { Outlet } from "react-router-dom";
import { UsersIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../../components/Sidebar";
import { useSesion } from "../../../hooks/useSesion";

const ICONO_FUNCIONARIOS = <UsersIcon className="h-5 w-5" strokeWidth={1.8} />;

// Enlaces del menú del administrador; agregar aquí cada pantalla nueva
const ENLACES = [
  { ruta: "/admin/funcionarios", texto: "Funcionarios", icono: ICONO_FUNCIONARIOS },
];

// Estructura de todas las pantallas del administrador: barra lateral + contenido
export default function AdminLayout() {
  const { usuario, revisando, cerrarSesion } = useSesion("Administrador");

  // Mientras se revisa la sesión no se muestra nada: así nadie ve una pantalla que no le corresponde
  if (revisando) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar rol="Administrador" enlaces={ENLACES} usuario={usuario} onCerrarSesion={cerrarSesion} />
      <div className="flex-1 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
