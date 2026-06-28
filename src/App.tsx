import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Formations from '@/pages/Formations';
import BilanVae from '@/pages/BilanVae';
import Paiement from '@/pages/Paiement';
import FormationDetail from '@/pages/FormationDetail';
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route path="/bilan-vae" element={<BilanVae />} />
          <Route path="/paiement" element={<Paiement />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
