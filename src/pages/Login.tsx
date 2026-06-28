import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2, LockKeyhole, Mail, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/formations');
      } else {
        const result = await signUp(email, password, fullName);
        if (result.needsConfirmation) {
          setMessage('Compte créé. Consultez votre e-mail pour confirmer votre inscription.');
        } else {
          navigate('/formations');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="pt-[72px] min-h-screen bg-[#f8fbf6]">
      <div className="container-cf max-w-[460px] py-14">
        <Link to="/" className="inline-flex items-center gap-2 text-sm mb-6 text-[#555] hover:text-[#72b249]">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
        <div className="bg-white rounded-3xl border border-[#e8e8e8] p-7 md:p-9 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#eef6e8] text-[#72b249] flex items-center justify-center mb-5">
            <LockKeyhole size={24} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-black">
            {mode === 'login' ? 'Connexion' : 'Créer votre compte'}
          </h1>
          <p className="text-sm mt-2 mb-7 text-[#777]">
            {mode === 'login' ? 'Retrouvez vos commandes et vos formations.' : 'Inscrivez-vous gratuitement sur CampusForma.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <label className="block">
                <span className="text-sm font-medium text-[#444]">Nom complet</span>
                <div className="relative mt-2">
                  <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]" />
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} required
                    className="w-full rounded-xl border border-[#ddd] py-3 pl-10 pr-4 outline-none focus:border-[#72b249]" />
                </div>
              </label>
            )}
            <label className="block">
              <span className="text-sm font-medium text-[#444]">E-mail</span>
              <div className="relative mt-2">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full rounded-xl border border-[#ddd] py-3 pl-10 pr-4 outline-none focus:border-[#72b249]" />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#444]">Mot de passe</span>
              <div className="relative mt-2">
                <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]" />
                <input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full rounded-xl border border-[#ddd] py-3 pl-10 pr-4 outline-none focus:border-[#72b249]" />
              </div>
            </label>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</p>}
            {message && <p className="text-sm text-green-700 bg-green-50 rounded-xl p-3 flex gap-2"><CheckCircle size={17} />{message}</p>}

            <button disabled={submitting} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>

          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}
            className="w-full text-center text-sm mt-5 text-[#555] hover:text-[#72b249]">
            {mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà inscrit ? Se connecter'}
          </button>
        </div>
      </div>
    </main>
  );
}
