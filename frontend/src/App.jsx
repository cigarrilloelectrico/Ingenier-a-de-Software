import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MatchEngine from './pages/MatchEngine';
import RegistroObjeto from './components/RegistroObjeto';
import RegistroAlumno from './features/alumno/pages/RegistroAlumno';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/motor-coincidencias" element={<MatchEngine />} />
        <Route path="/registrar-objeto" element={<RegistroObjeto />} />
        <Route path="/alumno/registro" element={<RegistroAlumno />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
