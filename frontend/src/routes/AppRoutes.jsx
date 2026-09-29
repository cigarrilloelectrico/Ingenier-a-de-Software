import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import MatchEngine from "../pages/MatchEngine";
import FuncionarioRoutes from "../features/funcionario/FuncionarioRoutes";

// Todas las rutas de la app; cada vista (funcionario, alumno, admin) se monta con su prefijo
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/motor-coincidencias" element={<MatchEngine />} />
      <Route path="/funcionario/*" element={<FuncionarioRoutes />} />
    </Routes>
  );
}
