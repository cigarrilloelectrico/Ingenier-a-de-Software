import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { logoutService } from "../../../services/auth.services";

// Por ahora no hay pantallas propias del alumno: solo confirma que el login funciona.
// Cuando el registro (RF1-RF3) y /avisos queden listos, se agregan enlaces aquí.
const ENLACES = [];

export default function AlumnoLayout() {
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    try {
      await logoutService();
    } catch {
      // Aunque el servidor no responda (ej: sesión ya vencida), se sale igual al login
    }
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar rol="Alumno" enlaces={ENLACES} onCerrarSesion={cerrarSesion} />
      <div className="flex-1 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}