import { useState } from "react";
import Modal from "../../../components/Modal";
import CampoTexto from "../../../components/CampoTexto";
import MensajeError from "../../../components/MensajeError";
import { ESTILO_BOTON_PRIMARIO } from "../../../components/estilosBotones";
import { cambiarPasswordTemporalService } from "../services/password.services";

const REGLAS = [
  { texto: "Al menos 12 caracteres", cumple: (password) => password.length >= 12 },
  { texto: "Empieza con una letra mayúscula", cumple: (password) => /^\p{Lu}/u.test(password) },
  { texto: "Tiene un carácter especial", cumple: (password) => /[\p{P}\p{S}]/u.test(password) },
];

export default function CambiarPasswordTemporal({ onCambiada, onCerrarSesion }) {
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const cumpleTodas = REGLAS.every((regla) => regla.cumple(passwordNueva));
  const coinciden = confirmarPassword !== "" && passwordNueva === confirmarPassword;

  const guardar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      await cambiarPasswordTemporalService({ passwordNueva, confirmarPassword });
      onCambiada();
    } catch (errorCambio) {
      setError(errorCambio);
      setEnviando(false);
    }
  };

  return (
    <Modal titulo="Crea tu contraseña" descripcion="Reemplaza la contraseña temporal antes de comenzar a usar el sistema.">
      <form onSubmit={guardar} className="space-y-4">
        <CampoTexto etiqueta="Nueva contraseña" tipo="password" valor={passwordNueva} onCambiar={setPasswordNueva} autoComplete="new-password" autoFocus />
        <ul className="space-y-1 text-sm" aria-live="polite">
          {REGLAS.map((regla) => {
            const cumple = regla.cumple(passwordNueva);
            return <li key={regla.texto} className={cumple ? "text-green-700" : "text-slate-500"}>{cumple ? "✓" : "○"} {regla.texto}</li>;
          })}
        </ul>
        <CampoTexto etiqueta="Repite la contraseña" tipo="password" valor={confirmarPassword} onCambiar={setConfirmarPassword} autoComplete="new-password" />
        {confirmarPassword !== "" && !coinciden && <p className="text-sm text-red-700">Las contraseñas no coinciden.</p>}
        <MensajeError error={error} />
        <button type="submit" disabled={!cumpleTodas || !coinciden || enviando} className={`${ESTILO_BOTON_PRIMARIO} w-full`}>
          {enviando ? "Guardando..." : "Guardar contraseña"}
        </button>
        <button type="button" onClick={onCerrarSesion} className="w-full text-sm font-medium text-slate-500 hover:text-slate-800">
          Cerrar sesión
        </button>
      </form>
    </Modal>
  );
}
