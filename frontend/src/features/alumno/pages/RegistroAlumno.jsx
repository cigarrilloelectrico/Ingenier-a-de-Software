import { useState } from "react";
import api from "../../../services/api";

export default function RegistroAlumno() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function registrar(evento) {
    evento.preventDefault();
    setMensaje("");
    setError("");
    setEnviando(true);

    try {
      const respuesta = await api.post("/auth/registro", { correo });
      setMensaje(respuesta.message);
      setCorreo("");
    } catch (registroError) {
      setError(registroError.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="mx-auto mt-16 max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Registro de alumno</h1>
      <p className="mt-2 text-sm text-slate-600">
        Usa tu correo institucional para recibir el código de verificación.
      </p>

      <form className="mt-6 space-y-4" onSubmit={registrar}>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Correo institucional
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            placeholder="nombre@alumnos.ubiobio.cl"
            required
          />
        </label>

        {mensaje && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{mensaje}</p>}
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={enviando}
        >
          {enviando ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </main>
  );
}
