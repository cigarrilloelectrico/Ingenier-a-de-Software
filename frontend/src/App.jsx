import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MatchEngine from './pages/MatchEngine';
import RegistroObjeto from './components/RegistroObjeto';
import FuncionarioRoutes from './features/funcionario/FuncionarioRoutes';
import RegistroAlumno from './features/alumno/pages/RegistroAlumno';
import AdminRoutes from './features/admin/AdminRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/motor-coincidencias" element={<MatchEngine />} />
        <Route path="/registrar-objeto" element={<RegistroObjeto />} />
        <Route path="/funcionario/*" element={<FuncionarioRoutes />} />
        <Route path="/alumno/registro" element={<RegistroAlumno />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
