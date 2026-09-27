// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import MatchCard from './components/MatchCard';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Le pegamos a la ruta de prueba de tu backend buscando el objeto 101
    fetch('http://localhost:3000/api/match/101')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMatches(data.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al conectar con el backend:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ fontFamily: 'sans-serif' }}>Analizando coincidencias...</h2>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Motor de Coincidencias RF20</h2>
      <p>Buscando posibles dueños para el objeto encontrado #101</p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
        {matches.map(match => (
          <MatchCard key={match.aviso_id} matchData={match} />
        ))}
      </div>
    </div>
  );
}

export default App;