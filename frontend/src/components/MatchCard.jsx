// frontend/src/components/MatchCard.jsx

export default function MatchCard({ matchData }) {
  const { porcentaje_match, detalles } = matchData;

  // Lógica del semáforo
  let colorSemaforo = '#ef4444'; // Rojo (Descartable)
  if (porcentaje_match >= 75) colorSemaforo = '#22c55e'; // Verde (Alta coincidencia)
  else if (porcentaje_match >= 40) colorSemaforo = '#eab308'; // Amarillo (Coincidencia dudosa)

  return (
    <div style={{ 
      border: `2px solid ${colorSemaforo}`, 
      borderRadius: '8px', 
      padding: '16px', 
      width: '250px',
      backgroundColor: '#f9fafb',
      color: '#111827',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Aviso #{detalles.id}</h3>
        <span style={{ 
          backgroundColor: colorSemaforo, 
          color: 'white', 
          padding: '4px 8px', 
          borderRadius: '99px',
          fontWeight: 'bold'
        }}>
          {porcentaje_match}%
        </span>
      </div>
      
      <hr style={{ borderColor: '#e5e7eb', margin: '12px 0' }} />
      
      <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
        <p style={{ margin: 0 }}><strong>Tipo Objeto ID:</strong> {detalles.id_tipo_objeto}</p>
        <p style={{ margin: 0 }}><strong>Color:</strong> {detalles.color}</p>
        <p style={{ margin: 0 }}><strong>Sede ID:</strong> {detalles.id_sede}</p>
        <p style={{ margin: 0 }}><strong>Fecha Perdida:</strong> {detalles.fecha_perdida}</p>
      </div>
    </div>
  );
}