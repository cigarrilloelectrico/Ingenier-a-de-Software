import { Navigate, Route, Routes } from "react-router-dom";
import FuncionarioLayout from "./components/FuncionarioLayout";
import Inventario from "./pages/Inventario";

// Rutas de la vista del funcionario; todas cuelgan de /funcionario y comparten la barra lateral
export default function FuncionarioRoutes() {
  return (
    <Routes>
      <Route element={<FuncionarioLayout />}>
        <Route index element={<Navigate to="inventario" replace />} />
        <Route path="inventario" element={<Inventario />} />
      </Route>
    </Routes>
  );
}
