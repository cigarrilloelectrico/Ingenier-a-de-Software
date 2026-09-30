import { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard';
import { Link } from 'react-router-dom';
import axios from '../services/root.service';

export default function MatchEngine() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/match/9001')
      .then(response => {
        const { data } = response;
        if (data.success) {
          setMatches(data.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al conectar con el backend:', error);
        setLoading(false);
      })
  }, []);

  if (loading) return <h2 style={{ fontFamily: 'sans-serif' }}>Analizando coincidencias...</h2>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#252e39', marginBottom: '20px', display: 'inline-block' }}>
        ← Volver al inicio
      </Link>

      <h2>Motor de Coincidencias RF20</h2>
      <p>Buscando posibles dueños para el objeto encontrado</p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
        {matches.map(match => (
          <MatchCard key={match.aviso_id} matchData={match} />
        ))}
      </div>
    </div>
  );
}
