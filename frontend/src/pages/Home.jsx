import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">UBBICA</h1>
          <p className="text-sm text-slate-500">Sistema de objetos perdidos · Universidad del Bío-Bío</p>
        </div>

        <Link
          to="/login"
          className="block rounded-lg bg-blue-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800"
        >
          Iniciar sesión
        </Link>
        <p className="text-center text-xs text-slate-400">Elige tu rol (alumno o funcionario) en la pantalla de ingreso.</p>
      </div>
    </div>
  );
}