import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import RutaProtegida from "../components/RutaProtegida";
import FuncionarioRoutes from "../features/funcionario/FuncionarioRoutes";
import AlumnoRoutes from "../features/alumno/AlumnoRoutes";
import RegistroAlumno from "../features/alumno/pages/RegistroAlumno";

// Todas las rutas de la app; cada vista (funcionario, alumno, admin) se monta con su prefijo
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* RF1: registro de alumno. Pendiente: verificar código (RF2) y definir contraseña (RF3). */}
      <Route path="/alumno/registro" element={<RegistroAlumno />} />

      {/* Solo con sesión de funcionario */}
      <Route element={<RutaProtegida rol="Funcionario" />}>
        <Route path="/funcionario/*" element={<FuncionarioRoutes />} />
      </Route>

      {/* Solo con sesión de alumno */}
      <Route element={<RutaProtegida rol="Alumno" />}>
        <Route path="/alumno/*" element={<AlumnoRoutes />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}