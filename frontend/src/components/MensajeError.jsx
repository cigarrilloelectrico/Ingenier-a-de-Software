// Error que devuelve el backend; si rechazó un formulario, también lista qué falló en cada campo
export default function MensajeError({ error }) {
  if (!error) return null;

  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <p className="font-medium">{error.message}</p>
      {error.detalles && error.detalles.length > 0 && (
        <ul className="mt-1 list-disc space-y-0.5 pl-5">
          {error.detalles.map((detalle) => (
            <li key={detalle}>{detalle}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
