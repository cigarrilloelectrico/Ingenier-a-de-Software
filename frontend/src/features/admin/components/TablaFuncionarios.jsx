// Color de la etiqueta según el estado de la cuenta
const ESTILOS_ESTADO = {
  Activo: "bg-green-100 text-green-800",
  Desactivado: "bg-slate-200 text-slate-700",
};
const ESTILO_ACCION =
  "rounded-md px-2 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40";

// Solo muestra la tabla: cada acción avisa a la página, que abre el modal que corresponde
export default function TablaFuncionarios({ funcionarios, onCambiarRecinto, onDesactivar, onReactivar }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="w-full min-w-[56rem] text-left text-sm">
        <thead className="whitespace-nowrap border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3">Funcionario</th>
            <th scope="col" className="px-4 py-3">Rut</th>
            <th scope="col" className="px-4 py-3">Recinto</th>
            <th scope="col" className="px-4 py-3">Estado</th>
            <th scope="col" className="px-4 py-3">Último ingreso</th>
            <th scope="col" className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {funcionarios.map((funcionario) => {
            // La sesión más reciente es su último ingreso; si no tiene, nunca ha entrado
            const ultimaSesion = funcionario.sesiones[0];
            const ultimoIngreso = ultimaSesion
              ? new Date(ultimaSesion.createdAt).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" })
              : "Nunca";
            const estaActivo = funcionario.estado === "Activo";

            return (
              <tr key={funcionario.usuarioId} className="align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{funcionario.nombre} {funcionario.apellidos}</p>
                  <p className="text-slate-500">{funcionario.correo}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{funcionario.rut}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{funcionario.recinto?.nombre}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1 whitespace-nowrap">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[funcionario.estado]}`}>
                      {funcionario.estado}
                    </span>
                    {funcionario.passwordTemporal && (
                      <span
                        title="Todavía no reemplaza la contraseña que recibió por correo"
                        className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                      >
                        Contraseña temporal
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{ultimoIngreso}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onCambiarRecinto(funcionario)}
                      className={`${ESTILO_ACCION} text-blue-800 hover:bg-blue-50`}
                    >
                      Cambiar recinto
                    </button>
                    {estaActivo ? (
                      <button
                        type="button"
                        onClick={() => onDesactivar(funcionario)}
                        className={`${ESTILO_ACCION} text-red-700 hover:bg-red-50`}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onReactivar(funcionario)}
                        className={`${ESTILO_ACCION} text-green-800 hover:bg-green-50`}
                      >
                        Reactivar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
