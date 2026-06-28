import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="pt-[72px] min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-sm font-semibold text-[#72b249]">Erreur 404</p>
        <h1 className="font-heading text-3xl font-bold mt-2">Page introuvable</h1>
        <p className="text-[#777] mt-3 mb-7">Cette page n'existe pas ou a été déplacée.</p>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    </main>
  );
}
