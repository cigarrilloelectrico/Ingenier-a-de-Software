import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { obtenerPerfilService } from "../services/auth.services";

// Deja pasar solo si hay sesión activa (y con el rol pedido); si no, manda a /login.
// El backend igual valida cada petición: esto solo evita mostrar pantallas vacías o prohibidas.
export default function RutaProtegida({ rol }) {
  const [estado, setEstado] = useState("cargando"); // cargando | ok | sinSesion | sinPermiso | error
  const location = useLocation();

  useEffect(() => {
    obtenerPerfilService()
      .then((res) => setEstado(rol && res.data.rol !== rol ? "sinPermiso" : "ok"))
      .catch((err) => setEstado(err.status === 401 ? "sinSesion" : "error"));
  }, [rol]);

  if (estado === "cargando") {
    return <p className="p-8 text-center text-slate-500">Verificando sesión...</p>;
  }

  if (estado === "sinSesion") {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (estado === "sinPermiso" || estado === "error") {
    return (
      <div className="p-8 text-center text-slate-600">
        <p>{estado === "sinPermiso" ? "No tienes permisos para ver esta sección." : "No se pudo conectar con el servidor."}</p>
        <Link to="/" className="mt-2 inline-block text-blue-700 underline">Volver al inicio</Link>
      </div>
    );
  }

  return <Outlet />;
}