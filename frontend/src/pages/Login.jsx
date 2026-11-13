import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoTexto from "../components/CampoTexto";
import MensajeError from "../components/MensajeError";
import { ESTILO_BOTON_PRIMARIO } from "../components/estilosBotones";
import { iniciarSesionService, obtenerPerfilService } from "../services/auth.services";
import { rutaInicioPorRol } from "../utils/rutaInicio";

// Un solo login para alumnos, funcionarios y administradores: el correo decide a qué endpoint se envía
export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // Si ya tiene una sesión abierta, va directo a su vista
  useEffect(() => {
    const revisarSesion = async () => {
      try {
        const respuesta = await obtenerPerfilService();
        navigate(rutaInicioPorRol(respuesta.data.rol), { replace: true });
      } catch {
        // Sin sesión: se queda en el login
      }
    };

    revisarSesion();
  }, [navigate]);

  const iniciarSesion = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const respuesta = await iniciarSesionService({ correo, password });
      navigate(rutaInicioPorRol(respuesta.data.rol), { replace: true });
    } catch (errorLogin) {
      setError(errorLogin);
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Panel de marca, con el mismo azul de la barra lateral */}
      <aside className="hidden w-96 shrink-0 flex-col justify-between bg-blue-900 p-10 text-white lg:flex">
        <div>
          <p className="text-2xl font-bold tracking-wide">UBBICA</p>
          <p className="text-sm text-blue-200">Objetos Perdidos UBB</p>
        </div>
        <p className="text-lg leading-relaxed text-blue-100">
          Los objetos perdidos y encontrados de la Universidad del Bío-Bío, en un solo lugar.
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <p className="mb-8 text-xl font-bold tracking-wide text-blue-900 lg:hidden">UBBICA</p>
          <h1 className="text-2xl font-bold text-slate-900">Inicia sesión</h1>
          <p className="mt-1 text-sm text-slate-500">Con tu correo institucional de la UBB.</p>

          <form onSubmit={iniciarSesion} className="mt-8 space-y-4">
            <CampoTexto
              etiqueta="Correo institucional"
              tipo="email"
              valor={correo}
              onCambiar={setCorreo}
              placeholder="nombre@ubiobio.cl"
              autoComplete="username"
              autoFocus
            />
            <CampoTexto
              etiqueta="Contraseña"
              tipo="password"
              valor={password}
              onCambiar={setPassword}
              autoComplete="current-password"
            />

            <MensajeError error={error} />

            <button type="submit" disabled={enviando} className={`${ESTILO_BOTON_PRIMARIO} w-full`}>
              {enviando ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-8 space-y-2 border-t border-slate-200 pt-6 text-sm text-slate-500">
            <p>
              ¿Eres alumno y no tienes cuenta?{" "}
              <Link to="/alumno/registro" className="font-medium text-blue-700 hover:text-blue-900">
                Regístrate
              </Link>
            </p>
            <p>¿Primer ingreso como funcionario? Usa la contraseña de 6 dígitos que te llegó por correo.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
