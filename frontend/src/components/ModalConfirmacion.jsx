import { useState } from "react";
import Modal from "./Modal";
import MensajeError from "./MensajeError";
import { ESTILO_BOTON_PELIGRO, ESTILO_BOTON_PRIMARIO, ESTILO_BOTON_SECUNDARIO } from "./estilosBotones";

// Pide confirmación antes de una acción con consecuencias (desactivar una cuenta, invalidar una contraseña)
export default function ModalConfirmacion({ titulo, mensaje, textoConfirmar, peligro = false, onConfirmar, onCerrar }) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const confirmar = async () => {
    setEnviando(true);
    setError(null);
    try {
      // Si sale bien, quien abrió el modal lo cierra
      await onConfirmar();
    } catch (errorAccion) {
      setError(errorAccion);
      setEnviando(false);
    }
  };

  return (
    <Modal titulo={titulo} descripcion={mensaje} onCerrar={onCerrar}>
      <div className="space-y-4">
        <MensajeError error={error} />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCerrar} className={ESTILO_BOTON_SECUNDARIO}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={enviando}
            className={peligro ? ESTILO_BOTON_PELIGRO : ESTILO_BOTON_PRIMARIO}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </Modal>
  );
}
