import { useState } from "react";
import { useFuncionarios } from "../hooks/useFuncionarios";
import { useRecintos } from "../../../hooks/useRecintos";
import TablaFuncionarios from "../components/TablaFuncionarios";
import FormularioFuncionario from "../components/FormularioFuncionario";
import CambiarRecintoModal from "../components/CambiarRecintoModal";
import CampoSelect from "../../../components/CampoSelect";
import ModalConfirmacion from "../../../components/ModalConfirmacion";
import { ESTILO_BOTON_PRIMARIO } from "../../../components/estilosBotones";
import { desactivarFuncionarioService, reactivarFuncionarioService } from "../services/funcionario.services";

const OPCIONES_ESTADO = [
  { valor: "Activo", texto: "Activo" },
  { valor: "Desactivado", texto: "Desactivado" },
];

function nombreCompleto(funcionario) {
  return `${funcionario.nombre} ${funcionario.apellidos}`;
}

// Padrón de funcionarios del administrador (RF35 a RF38)
export default function Funcionarios() {
  const { funcionarios, filtros, loading, error, cambiarFiltro, limpiarFiltros, recargar } = useFuncionarios();
  const { recintos } = useRecintos();
  // Modal abierto: { tipo: "agregar" | "recinto" | "desactivar", funcionario }
  const [modal, setModal] = useState(null);
  // Resultado de la última acción: { tipo: "exito" | "error", texto }
  const [aviso, setAviso] = useState(null);

  const cerrarModal = () => setModal(null);

  // Cierra el modal, avisa qué pasó y actualiza la tabla
  const terminarAccion = (texto) => {
    setModal(null);
    setAviso({ tipo: "exito", texto });
    recargar();
  };

  const funcionarioAgregado = (funcionario) => {
    terminarAccion(`Se agregó a ${nombreCompleto(funcionario)}. Su contraseña temporal se envió a ${funcionario.correo}.`);
  };

  const recintoCambiado = (funcionario) => {
    terminarAccion(`${nombreCompleto(funcionario)} ahora está en ${funcionario.recinto.nombre}.`);
  };

  // Si falla, ModalConfirmacion muestra el error y queda abierto
  const desactivar = async () => {
    const funcionario = modal.funcionario;
    await desactivarFuncionarioService(funcionario.usuarioId);
    terminarAccion(`Se desactivó a ${nombreCompleto(funcionario)}.`);
  };

  // Reactivar no pide confirmación: no corta el acceso de nadie
  const reactivar = async (funcionario) => {
    try {
      await reactivarFuncionarioService(funcionario.usuarioId);
      terminarAccion(`Se reactivó a ${nombreCompleto(funcionario)}.`);
    } catch (errorReactivar) {
      setAviso({ tipo: "error", texto: errorReactivar.message });
    }
  };

  // En el filtro aparecen también los recintos desactivados, marcados
  const opcionesRecinto = recintos.map((recinto) => ({
    valor: recinto.recintoId,
    texto: recinto.estado === "Activo" ? recinto.nombre : `${recinto.nombre} (desactivado)`,
  }));
  const hayFiltros = filtros.recintoId !== "" || filtros.estado !== "";
  const textoCantidad = funcionarios.length === 1 ? "1 funcionario" : `${funcionarios.length} funcionarios`;

  return (
    <div>
      {/* Encabezado */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Funcionarios</h1>
            <p className="text-sm text-slate-500">Cuentas de quienes reciben y entregan objetos en cada recinto</p>
          </div>
          <button type="button" onClick={() => setModal({ tipo: "agregar" })} className={ESTILO_BOTON_PRIMARIO}>
            Agregar funcionario
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {/* Resultado de la última acción */}
        {aviso && (
          <div
            role="status"
            className={`flex items-start justify-between gap-4 rounded-xl border p-4 text-sm ${
              aviso.tipo === "exito" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <p>{aviso.texto}</p>
            <button type="button" onClick={() => setAviso(null)} className="shrink-0 font-medium hover:underline">
              Cerrar
            </button>
          </div>
        )}

        {/* Filtros */}
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Filtros</h2>
            <button onClick={limpiarFiltros} className="text-sm font-medium text-blue-700 hover:text-blue-900">
              Limpiar filtros
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CampoSelect
              etiqueta="Recinto"
              valor={filtros.recintoId}
              onCambiar={(valor) => cambiarFiltro("recintoId", valor)}
              opciones={opcionesRecinto}
            />
            <CampoSelect
              etiqueta="Estado"
              valor={filtros.estado}
              onCambiar={(valor) => cambiarFiltro("estado", valor)}
              opciones={OPCIONES_ESTADO}
            />
          </div>
        </section>

        {/* Error del backend (ej: sesión expirada) */}
        {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        {/* Cargando */}
        {loading && <p className="p-8 text-center text-slate-500">Cargando funcionarios...</p>}

        {/* Sin resultados */}
        {!loading && !error && funcionarios.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
            {hayFiltros
              ? "Ningún funcionario coincide con los filtros."
              : "Todavía no hay funcionarios. Agrega el primero para que su recinto pueda recibir objetos."}
          </p>
        )}

        {/* Tabla */}
        {!loading && funcionarios.length > 0 && (
          <section className="space-y-2">
            <p className="text-sm text-slate-500">{textoCantidad}</p>
            <TablaFuncionarios
              funcionarios={funcionarios}
              onCambiarRecinto={(funcionario) => setModal({ tipo: "recinto", funcionario })}
              onDesactivar={(funcionario) => setModal({ tipo: "desactivar", funcionario })}
              onReactivar={reactivar}
            />
          </section>
        )}
      </main>

      {/* Modales */}
      {modal?.tipo === "agregar" && (
        <FormularioFuncionario recintos={recintos} onAgregado={funcionarioAgregado} onCerrar={cerrarModal} />
      )}
      {modal?.tipo === "recinto" && (
        <CambiarRecintoModal funcionario={modal.funcionario} recintos={recintos} onCambiado={recintoCambiado} onCerrar={cerrarModal} />
      )}
      {modal?.tipo === "desactivar" && (
        <ModalConfirmacion
          titulo={`¿Desactivar a ${nombreCompleto(modal.funcionario)}?`}
          mensaje="No podrá ingresar al sistema y se cerrarán sus sesiones abiertas. Los objetos, citaciones y entregas que registró se conservan, y puedes reactivarlo cuando quieras."
          textoConfirmar="Desactivar"
          peligro
          onConfirmar={desactivar}
          onCerrar={cerrarModal}
        />
      )}
    </div>
  );
}
