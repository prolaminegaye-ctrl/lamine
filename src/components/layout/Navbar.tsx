import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, Menu, User, X } from 'lucide-react';
import CartDrawer from '@/components/ui/CartDrawer';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Formations', path: '/formations' },
  { label: 'Bilan & VAE', path: '/bilan-vae' },
  { label: 'Paiement', path: '/paiement' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();


  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-xl border-b border-[#E4E4E4]/80 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
        <div className="container-cf h-[72px] flex items-center justify-between gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: '#72b249' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <text x="12" y="18" textAnchor="middle" fill="white" fontFamily="Plus Jakarta Sans" fontWeight="700" fontSize="16">C</text>
              </svg>
            </div>
            <div className="flex items-baseline">
              <span className="font-heading text-lg sm:text-xl font-bold text-black tracking-tight">Campus</span>
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight" style={{ color: '#72b249' }}>Forma</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-[14px] font-medium rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-[#72b249] bg-[#eef6e8]'
                    : 'text-[#555] hover:text-[#72b249] hover:bg-[#f7f7f7]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Cart */}
            <CartDrawer />

            {user ? (
              <button onClick={() => void signOut()} title={user.email ?? 'Compte'}
                className="hidden md:flex items-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-lg bg-[#eef6e8] text-[#4d8a2f]">
                <User size={16} /> Mon compte <LogOut size={15} />
              </button>
            ) : (
              <Link to="/login" className="hidden md:flex btn-primary text-[13px] py-2.5 px-5">
                <LogIn size={16} /> Se connecter
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f7f7f7] transition-colors touch-manipulation"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-[#E4E4E4] ${
            mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="container-cf py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[15px] font-medium px-4 py-3 rounded-lg ${
                  isActive(link.path) ? 'text-[#72b249] bg-[#eef6e8]' : 'text-black hover:bg-[#f7f7f7]'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={() => { void signOut(); setMobileOpen(false); }} className="flex items-center gap-2 text-[15px] font-medium px-4 py-3 rounded-lg text-black hover:bg-[#f7f7f7]">
                <LogOut size={17} /> Se déconnecter
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-[15px] font-medium px-4 py-3 rounded-lg text-[#72b249] bg-[#eef6e8]">
                <LogIn size={17} /> Se connecter
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
