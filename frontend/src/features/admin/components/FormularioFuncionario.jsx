import { useState } from "react";
import Modal from "../../../components/Modal";
import CampoTexto from "../../../components/CampoTexto";
import CampoSelect from "../../../components/CampoSelect";
import MensajeError from "../../../components/MensajeError";
import { ESTILO_BOTON_PRIMARIO, ESTILO_BOTON_SECUNDARIO } from "../../../components/estilosBotones";
import { crearFuncionarioService } from "../services/funcionario.services";

const DATOS_INICIALES = { rut: "", nombre: "", apellidos: "", correo: "", recintoId: "" };

// Formulario para agregar un funcionario (RF35). La contraseña no se escribe aquí: el sistema la envía a su correo
export default function FormularioFuncionario({ recintos, onAgregado, onCerrar }) {
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const cambiarDato = (nombre, valor) => {
    setDatos({ ...datos, [nombre]: valor });
  };

  const agregar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    // Si no eligió recinto se manda sin él, para que el backend responda "Debes elegir un recinto"
    let recintoId;
    if (datos.recintoId !== "") recintoId = Number(datos.recintoId);

    try {
      const respuesta = await crearFuncionarioService({ ...datos, recintoId });
      onAgregado(respuesta.data);
    } catch (errorCreacion) {
      setError(errorCreacion);
      setEnviando(false);
    }
  };

  // Solo se puede asignar un recinto activo
  const opcionesRecinto = recintos
    .filter((recinto) => recinto.estado === "Activo")
    .map((recinto) => ({ valor: recinto.recintoId, texto: recinto.nombre }));

  return (
    <Modal
      titulo="Agregar funcionario"
      descripcion="Le enviaremos una contraseña temporal de 6 dígitos a su correo. Tú no la verás."
      onCerrar={onCerrar}
    >
      <form onSubmit={agregar} className="space-y-4">
        <CampoTexto etiqueta="Rut" valor={datos.rut} onCambiar={(valor) => cambiarDato("rut", valor)} placeholder="12.345.678-5" autoFocus />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CampoTexto etiqueta="Nombre" valor={datos.nombre} onCambiar={(valor) => cambiarDato("nombre", valor)} autoComplete="off" />
          <CampoTexto etiqueta="Apellidos" valor={datos.apellidos} onCambiar={(valor) => cambiarDato("apellidos", valor)} autoComplete="off" />
        </div>
        <CampoTexto
          etiqueta="Correo institucional"
          tipo="email"
          valor={datos.correo}
          onCambiar={(valor) => cambiarDato("correo", valor)}
          placeholder="nombre@ubiobio.cl"
          autoComplete="off"
        />
        <CampoSelect
          etiqueta="Recinto"
          valor={datos.recintoId}
          onCambiar={(valor) => cambiarDato("recintoId", valor)}
          opciones={opcionesRecinto}
          textoTodos="Elige un recinto"
        />

        <MensajeError error={error} />

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCerrar} className={ESTILO_BOTON_SECUNDARIO}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className={ESTILO_BOTON_PRIMARIO}>
            {enviando ? "Agregando..." : "Agregar funcionario"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
