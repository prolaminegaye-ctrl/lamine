import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, CreditCard, Loader2, Lock, Smartphone, Wallet } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type PaymentMethod = 'wave' | 'orange_money' | 'free_money' | null;

const paymentMethods = [
  { id: 'wave' as const, name: 'Wave', description: 'Paiement mobile Wave', icon: Smartphone, color: '#1DA1F2' },
  { id: 'orange_money' as const, name: 'Orange Money', description: 'Paiement mobile Orange Money', icon: Wallet, color: '#FF6600' },
  { id: 'free_money' as const, name: 'Free Money', description: 'Paiement mobile Free Money', icon: CreditCard, color: '#E30613' },
];

export default function Paiement() {
  const { items, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleOrder() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedMethod || phoneNumber.replace(/\D/g, '').length < 8) {
      setError('Choisissez un moyen de paiement et indiquez un numéro valide.');
      return;
    }
    setError('');
    setIsProcessing(true);
    const { data, error: orderError } = await supabase.rpc('campusforma_create_order', {
      course_ids: items.map((item) => item.id),
      selected_payment_method: selectedMethod,
      customer_phone: phoneNumber,
    });
    setIsProcessing(false);
    if (orderError) {
      setError(orderError.message || "La commande n'a pas pu être créée.");
      return;
    }
    setOrderId(String(data));
    clearCart();
  }

  if (orderId) {
    return (
      <main className="pt-[72px] min-h-screen">
        <div className="container-cf max-w-[620px] py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-[#72b249] text-white flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} /></div>
          <h1 className="section-title mb-3">Commande enregistrée</h1>
          <p className="text-[#666] mb-4">Votre demande de paiement a bien été enregistrée. Vous recevrez les instructions de validation sur le numéro indiqué.</p>
          <p className="text-xs text-[#999] mb-8">Référence : {orderId}</p>
          <Link to="/formations" className="btn-primary">Continuer à explorer <ArrowRight size={18} /></Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="pt-[72px] min-h-screen">
        <div className="container-cf max-w-[600px] py-24 text-center">
          <CreditCard size={36} className="mx-auto mb-5 text-[#72b249]" />
          <h2 className="section-title mb-3">Votre panier est vide</h2>
          <p className="text-[#666] mb-8">Ajoutez une formation avant de finaliser votre commande.</p>
          <Link to="/formations" className="btn-primary">Explorer les formations <ArrowRight size={18} /></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-[72px] min-h-screen bg-[#fbfcfa]">
      <div className="container-cf max-w-[920px] py-12">
        <h1 className="section-title mb-2">Finaliser votre commande</h1>
        <p className="section-subtitle mb-8">Les prix et le total seront contrôlés côté serveur avant l'enregistrement.</p>

        {!authLoading && !user && (
          <div className="mb-6 rounded-2xl bg-[#fff7e8] border border-[#f2d49a] p-4 text-sm text-[#795b22]">
            Vous devez être connecté pour commander. <Link to="/login" className="font-semibold underline">Se connecter</Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <section className="lg:col-span-2 bg-white rounded-2xl border border-[#eee] p-6 h-fit">
            <h2 className="font-heading font-semibold mb-4">Récapitulatif</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} alt="" className="w-16 h-12 object-cover rounded-lg" />
                  <div className="min-w-0"><p className="text-sm font-medium line-clamp-2">{item.title}</p><p className="text-xs text-[#888]">{item.price.toLocaleString('fr-FR')} FCFA</p></div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#eee] mt-5 pt-5 flex justify-between font-semibold"><span>Total</span><span className="text-[#72b249]">{total.toLocaleString('fr-FR')} FCFA</span></div>
          </section>

          <section className="lg:col-span-3 bg-white rounded-2xl border border-[#eee] p-6">
            <h2 className="font-heading font-semibold mb-4">Mode de paiement</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button key={method.id} onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left ${selectedMethod === method.id ? 'border-[#72b249] bg-[#eef6e8]' : 'border-[#eee]'}`}>
                  <method.icon size={22} style={{ color: method.color }} />
                  <div className="flex-1"><p className="font-medium">{method.name}</p><p className="text-xs text-[#888]">{method.description}</p></div>
                  <span className={`w-5 h-5 rounded-full border-2 ${selectedMethod === method.id ? 'border-[#72b249] bg-[#72b249]' : 'border-[#ccc]'}`} />
                </button>
              ))}
            </div>

            <label className="block mt-5">
              <span className="text-sm font-medium text-[#555]">Numéro de téléphone du paiement</span>
              <input type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Ex. +221 77 000 00 00"
                className="mt-2 w-full rounded-xl border border-[#ddd] py-3 px-4 outline-none focus:border-[#72b249]" />
            </label>

            {error && <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</p>}

            <button onClick={handleOrder} disabled={isProcessing || authLoading}
              className="btn-primary w-full justify-center mt-6 py-4 disabled:opacity-50">
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              {isProcessing ? 'Enregistrement sécurisé…' : 'Confirmer la commande'}
            </button>
            <p className="text-xs text-[#888] mt-3 text-center">Aucune donnée bancaire n'est collectée sur ce site.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
