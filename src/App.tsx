import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import Home from '@/pages/Home';
import Formations from '@/pages/Formations';
import BilanVae from '@/pages/BilanVae';
import Paiement from '@/pages/Paiement';
import FormationDetail from '@/pages/FormationDetail';
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import InfoPage from '@/pages/InfoPage';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import LegalPage from '@/pages/LegalPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollToTop />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route path="/bilan-vae" element={<BilanVae />} />
          <Route path="/paiement" element={<Paiement />} />
          <Route path="/login" element={<Login />} />
          <Route path="/a-propos" element={<InfoPage page="about" />} />
          <Route path="/methode" element={<InfoPage page="method" />} />
          <Route path="/referents" element={<InfoPage page="referents" />} />
          <Route path="/equipe" element={<InfoPage page="team" />} />
          <Route path="/faq" element={<InfoPage page="faq" />} />
          <Route path="/temoignages" element={<InfoPage page="testimonials" />} />
          <Route path="/entreprises" element={<InfoPage page="enterprise" />} />
          <Route path="/partenaires" element={<InfoPage page="partners" />} />
          <Route path="/recrutement" element={<InfoPage page="recruitment" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/mentions-legales" element={<LegalPage type="mentions" />} />
          <Route path="/confidentialite" element={<LegalPage type="privacy" />} />
          <Route path="/cgu" element={<LegalPage type="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
