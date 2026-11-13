import { useState } from "react";
import Modal from "../../../components/Modal";
import CampoSelect from "../../../components/CampoSelect";
import MensajeError from "../../../components/MensajeError";
import { ESTILO_BOTON_PRIMARIO, ESTILO_BOTON_SECUNDARIO } from "../../../components/estilosBotones";
import { cambiarRecintoFuncionarioService } from "../services/funcionario.services";

// Cambia el recinto de un funcionario (RF36): desde ese momento actúa sobre los objetos del nuevo recinto
export default function CambiarRecintoModal({ funcionario, recintos, onCambiado, onCerrar }) {
  const [recintoId, setRecintoId] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // Recintos activos, sin el que ya tiene
  const opcionesRecinto = recintos
    .filter((recinto) => recinto.estado === "Activo" && recinto.recintoId !== funcionario.recintoId)
    .map((recinto) => ({ valor: recinto.recintoId, texto: recinto.nombre }));

  const cambiar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const respuesta = await cambiarRecintoFuncionarioService(funcionario.usuarioId, Number(recintoId));
      onCambiado(respuesta.data);
    } catch (errorCambio) {
      setError(errorCambio);
      setEnviando(false);
    }
  };

  return (
    <Modal
      titulo={`Cambiar recinto de ${funcionario.nombre} ${funcionario.apellidos}`}
      descripcion={`Hoy está en ${funcionario.recinto?.nombre}. Desde el cambio solo podrá registrar y entregar objetos del nuevo recinto.`}
      onCerrar={onCerrar}
    >
      <form onSubmit={cambiar} className="space-y-4">
        <CampoSelect
          etiqueta="Nuevo recinto"
          valor={recintoId}
          onCambiar={setRecintoId}
          opciones={opcionesRecinto}
          textoTodos="Elige un recinto"
        />

        <MensajeError error={error} />

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCerrar} className={ESTILO_BOTON_SECUNDARIO}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando || recintoId === ""} className={ESTILO_BOTON_PRIMARIO}>
            Cambiar recinto
          </button>
        </div>
      </form>
    </Modal>
  );
}
