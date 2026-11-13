import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Funcionarios from "./pages/Funcionarios";

// Rutas de la vista del administrador; todas cuelgan de /admin y comparten la barra lateral
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="funcionarios" replace />} />
        <Route path="funcionarios" element={<Funcionarios />} />
      </Route>
    </Routes>
  );
}
