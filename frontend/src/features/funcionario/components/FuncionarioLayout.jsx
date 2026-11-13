import { Outlet } from "react-router-dom";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../../components/Sidebar";

const ICONO_INVENTARIO = <ArchiveBoxIcon className="h-5 w-5" strokeWidth={1.8} />;

// Enlaces del menú del funcionario; agregar aquí cada pantalla nueva
const ENLACES = [
  { ruta: "/funcionario/inventario", texto: "Inventario", icono: ICONO_INVENTARIO },
];

// Estructura de todas las pantallas del funcionario: barra lateral + contenido
export default function FuncionarioLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar rol="Funcionario" enlaces={ENLACES} />
      <div className="flex-1 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
