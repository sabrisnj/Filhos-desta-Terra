import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Agenda from './pages/Agenda';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Stories from './pages/Stories';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="eventos" element={<Events />} />
          <Route path="historias" element={<Stories />} />
          <Route path="sobre" element={<About />} />
          <Route path="contato" element={<Contact />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
