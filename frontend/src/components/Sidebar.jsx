import { NavLink } from "react-router-dom";

const ESTILO_ENLACE = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
const ESTILO_ACTIVO = "bg-white/15 text-white";
const ESTILO_INACTIVO = "text-blue-100 hover:bg-white/10 hover:text-white";

// Barra lateral compartida: cada vista (funcionario, alumno, admin) le pasa su rol y sus enlaces
export default function Sidebar({ rol, enlaces }) {
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-blue-900 text-white">
      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-xl font-bold tracking-wide">UBBICA</p>
        <p className="text-xs text-blue-200">Objetos Perdidos UBB · {rol}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.ruta}
            to={enlace.ruta}
            className={({ isActive }) => `${ESTILO_ENLACE} ${isActive ? ESTILO_ACTIVO : ESTILO_INACTIVO}`}
          >
            {enlace.icono}
            {enlace.texto}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
