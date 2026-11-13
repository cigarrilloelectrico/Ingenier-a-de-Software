import { Route, Routes } from "react-router-dom";
import AlumnoLayout from "./components/AlumnoLayout";
import AlumnoHome from "./pages/AlumnoHome";

// Rutas de la vista del alumno; todas cuelgan de /alumno y comparten la barra lateral
export default function AlumnoRoutes() {
  return (
    <Routes>
      <Route element={<AlumnoLayout />}>
        <Route index element={<AlumnoHome />} />
      </Route>
    </Routes>
  );
}