import { X, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, total, itemCount } = useCart();

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f7f7f7] transition-colors"
        aria-label="Panier"
      >
        <ShoppingCart size={20} className="text-[#555]" />
        {itemCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
            style={{ backgroundColor: '#72b249' }}
          >
            {itemCount}
          </span>
        )}
      </button>

      {createPortal(
        <>
          {/* Overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1001] transition-opacity"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Drawer */}
          <div
            className={`fixed inset-y-0 right-0 w-full max-w-[420px] bg-white z-[1002] shadow-2xl transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E4E4E4]">
            <h3 className="font-heading text-base sm:text-lg font-semibold text-black flex items-center gap-2 min-w-0">
              <ShoppingCart size={20} style={{ color: '#72b249' }} />
              Votre panier
              {itemCount > 0 && (
                <span className="text-xs sm:text-sm font-normal whitespace-nowrap" style={{ color: 'var(--cf-gray-light)' }}>
                  ({itemCount} formation{itemCount > 1 ? 's' : ''})
                </span>
              )}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-lg hover:bg-[#f7f7f7] flex items-center justify-center transition-colors touch-manipulation"
              aria-label="Fermer le panier"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 overscroll-contain">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-[#eef6e8] flex items-center justify-center mb-4">
                  <ShoppingCart size={28} style={{ color: '#72b249' }} />
                </div>
                <p className="font-heading font-semibold text-black mb-1">Votre panier est vide</p>
                <p className="text-sm" style={{ color: 'var(--cf-gray-light)' }}>
                  Explorez nos formations et ajoutez-les ici
                </p>
                <Link
                  to="/formations"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary mt-6 text-sm py-3 px-6"
                >
                  Voir les formations
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-[#EEEEEE] bg-white hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 sm:w-20 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-black line-clamp-2">{item.title}</h4>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--cf-gray-light)' }}>
                        {item.instructor} · {item.duration}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold" style={{ color: '#72b249' }}>
                          {item.price.toLocaleString('fr-FR')} FCFA
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-red-50 text-[var(--cf-gray-light)] hover:text-red-500 transition-colors touch-manipulation"
                          aria-label={`Retirer ${item.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-[#E4E4E4] bg-[#fafafa] pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm" style={{ color: 'var(--cf-gray)' }}>Total</span>
                <span className="font-heading text-xl font-bold" style={{ color: '#72b249' }}>
                  {total.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <Link
                to="/paiement"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full py-3.5"
              >
                Procéder au paiement
                <ArrowRight size={18} />
              </Link>
              <p className="text-xs text-center mt-3 flex items-center justify-center gap-1" style={{ color: 'var(--cf-gray-light)' }}>
                Commande sécurisée avec Wave, Orange Money ou Free Money
              </p>
            </div>
          )}
        </div>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}
