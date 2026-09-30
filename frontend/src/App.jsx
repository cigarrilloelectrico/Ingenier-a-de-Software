import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MatchEngine from './pages/MatchEngine';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/motor-coincidencias" element={<MatchEngine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;