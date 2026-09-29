import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Sistema de Objetos Perdidos (UBBICA)</h1>
      <p>Modulos:</p>
      
      <ul style={{ lineHeight: '2' }}>
        <li>
          {/* Agregar Rutas Aqui */}
          <span>Registrar Avisos y Objetos (Pendiente)</span>
        </li>
        <li>
          <Link to="/motor-coincidencias" style={{ color: '#2563eb', fontWeight: 'bold' }}>
            Motor de Coincidencias
          </Link>
        </li>
      </ul>
    </div>
  );
}