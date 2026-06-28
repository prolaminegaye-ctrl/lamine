import { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export type RequestType = 'contact' | 'enterprise' | 'partner' | 'recruitment';

export default function ContactRequestForm({ requestType = 'contact' }: { requestType?: RequestType }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', organization: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const { error: submitError } = await supabase.rpc('campusforma_submit_contact', {
      contact_request_type: requestType,
      contact_full_name: form.fullName,
      contact_email: form.email,
      contact_phone: form.phone,
      contact_organization: form.organization,
      contact_message: form.message,
    });
    setSubmitting(false);
    if (submitError) {
      setError("La demande n'a pas pu être envoyée. Vérifiez les informations puis réessayez.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-white p-8 sm:p-12 text-center" style={{ borderColor: 'var(--cf-border-light)' }}>
        <CheckCircle className="mx-auto" size={44} style={{ color: 'var(--cf-green)' }} />
        <h2 className="font-heading text-2xl font-bold mt-5">Votre demande est bien enregistrée</h2>
        <p className="mt-2" style={{ color: 'var(--cf-gray-medium)' }}>L’équipe CampusForma reviendra vers vous avec une réponse adaptée.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-white p-5 sm:p-8 shadow-sm" style={{ borderColor: 'var(--cf-border-light)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="text-sm font-medium">Nom complet *
          <input required minLength={2} maxLength={120} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-medium">Adresse e-mail *
          <input required type="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-medium">Téléphone
          <input type="tel" maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3 font-normal" />
        </label>
        <label className="text-sm font-medium">Organisation
          <input maxLength={160} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3 font-normal" />
        </label>
      </div>
      <label className="text-sm font-medium block mt-5">Votre message *
        <textarea required minLength={10} maxLength={4000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 w-full rounded-lg border px-4 py-3 font-normal resize-y" />
      </label>
      {error && <p role="alert" className="text-sm text-red-600 mt-4">{error}</p>}
      <button disabled={submitting} className="btn-primary mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 disabled:opacity-60">
        <Send size={17} /> {submitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </button>
    </form>
  );
}
