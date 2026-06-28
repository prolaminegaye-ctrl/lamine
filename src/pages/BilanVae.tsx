import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Lock,
  Send,
  CreditCard,
  Smartphone,
  Wallet,
  Building2,
  CircleDollarSign,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

type TabType = 'bilan' | 'vae';

/* ── DATA ── */
const bilanSteps = [
  {
    number: '1',
    title: 'Entretien préliminaire',
    description:
      "Nous analysons votre situation, vos attentes et vos objectifs lors d'un entretien individuel avec un consultant expert.",
    duration: '~1 semaine',
  },
  {
    number: '2',
    title: 'Investigation',
    description:
      "À travers des exercices, questionnaires et mises en situation, nous explorons vos compétences, motivations et centres d'intérêt.",
    duration: '~4 semaines',
  },
  {
    number: '3',
    title: 'Synthèse',
    description:
      'Votre consultant rédige un rapport détaillé avec vos compétences identifiées, votre projet professionnel et les formations recommandées.',
    duration: '~2 semaines',
  },
  {
    number: '4',
    title: "Plan d'action",
    description:
      'Nous construisons ensemble un plan d\'action concret avec des étapes claires pour atteindre vos objectifs professionnels.',
    duration: '~1 semaine',
  },
];

const bilanPricing = [
  {
    name: 'Essentiel',
    price: '75 000',
    features: [
      'Entretien préliminaire (1h)',
      'Investigation simplifiée',
      'Rapport de synthèse (5 pages)',
      '1 séance de suivi',
    ],
    recommended: false,
  },
  {
    name: 'Complet',
    price: '150 000',
    features: [
      'Entretien préliminaire (2h)',
      'Investigation complète',
      'Tests psychométriques',
      'Rapport détaillé (15 pages)',
      '3 séances de suivi',
      'Plan d\'action personnalisé',
    ],
    recommended: true,
  },
  {
    name: 'Premium',
    price: '250 000',
    features: [
      'Tout le pack Complet',
      'Accompagnement sur 6 mois',
      'Sessions de coaching (6h)',
      'Accès privilégié aux formations CampusForma',
      'Mise en relation réseau pro',
    ],
    recommended: false,
  },
];

const vaeSteps = [
  {
    number: '1',
    title: 'Information & orientation',
    description:
      "Nous évaluons votre éligibilité et vous orientons vers le diplôme adapté à votre expérience lors d'un entretien gratuit.",
    duration: '~1 semaine',
  },
  {
    number: '2',
    title: 'Constitution du dossier',
    description:
      'Vous rassemblez les preuves de votre expérience (attestations, fiches de poste, réalisations) avec notre accompagnement méthodique.',
    duration: '~4 semaines',
  },
  {
    number: '3',
    title: 'Rédaction du livret',
    description:
      'Nous vous aidons à rédiger votre livret de présentation des acquis, en mettant en valeur vos compétences transférables.',
    duration: '~6 semaines',
  },
  {
    number: '4',
    title: 'Validation du jury',
    description:
      'Votre dossier est soumis à un jury de professionnels qui évalue vos acquis et peut vous convoquer à un entretien.',
    duration: '~2 semaines',
  },
  {
    number: '5',
    title: 'Obtention du diplôme',
    description:
      'En cas de validation totale ou partielle, vous obtenez votre certification. En cas de compléments nécessaires, nous vous aidons à combler les écarts.',
    duration: '~1 semaine',
  },
];

const vaePricing = [
  {
    name: 'Accompagnement Light',
    price: '95 000',
    features: [
      'Entretien d\'orientation (1h)',
      'Guide méthodologique',
      '2 séances de suivi',
      'Relecture du dossier',
    ],
    recommended: false,
  },
  {
    name: 'Accompagnement Complet',
    price: '195 000',
    features: [
      'Entretien d\'orientation (2h)',
      'Accompagnement constitution du dossier',
      'Rédaction du livret 1',
      '5 séances de suivi',
      'Simulation d\'entretien jury',
    ],
    recommended: true,
  },
  {
    name: 'Accompagnement Premium',
    price: '350 000',
    features: [
      'Tout le pack Complet',
      'Accompagnement jury complet',
      'Rédaction livret 2',
      'Coaching pré-entretien (3h)',
      'Garantie satisfaction ou remboursement',
    ],
    recommended: false,
  },
];

const bilanBenefits = [
  'Identifier vos compétences clés',
  'Clarifier vos objectifs professionnels',
  'Définir un plan d\'action concret',
  'Bénéficier d\'un accompagnement personnalisé',
];

const vaeBenefits = [
  'Obtenir un diplôme sans reprendre les cours',
  'Faire reconnaître toute votre expérience',
  'Avancer dans votre carrière',
  'Bénéficier d\'un accompagnement de A à Z',
];

/* ── PRICING CARD ── */
function PricingCard({
  name,
  price,
  features,
  recommended,
}: {
  name: string;
  price: string;
  features: string[];
  recommended: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-8 bg-white transition-all duration-300 hover:-translate-y-1 ${
        recommended
          ? 'border-2 shadow-lg'
          : 'border shadow-sm'
      }`}
      style={{
        borderColor: recommended ? 'var(--cf-green)' : 'var(--cf-border)',
      }}
    >
      {recommended && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: 'var(--cf-green)' }}
        >
          Recommandé
        </div>
      )}
      <h4 className="font-heading text-lg font-semibold text-black">{name}</h4>
      <div className="mt-3">
        <span className="font-heading text-3xl font-bold" style={{ color: 'var(--cf-green)' }}>
          {price} FCFA
        </span>
      </div>
      <p className="text-[13px] mt-1" style={{ color: 'var(--cf-gray-light)' }}>
        TTC, modalités précisées par votre conseiller
      </p>
      <div className="h-px w-full my-5" style={{ backgroundColor: 'var(--cf-border-light)' }} />
      <ul className="flex flex-col gap-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--cf-gray-medium)' }}>
            <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--cf-green)' }} />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => document.getElementById('campusforma-contact')?.scrollIntoView({ behavior: 'smooth' })}
        className={`w-full mt-6 py-3 rounded-lg font-medium transition-all duration-300 ${
          recommended ? 'btn-primary' : 'btn-secondary'
        }`}
      >
        Choisir cette formule
      </button>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function BilanVae() {
  const [activeTab, setActiveTab] = useState<TabType>('bilan');
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    interest: 'bilan',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    const { error } = await supabase.rpc('campusforma_submit_lead', {
      lead_first_name: formData.prenom,
      lead_last_name: formData.nom,
      lead_email: formData.email,
      lead_phone: formData.telephone,
      lead_interest: formData.interest,
      lead_message: formData.message,
    });
    setFormSubmitting(false);
    if (error) {
      setFormError("Votre demande n'a pas pu être enregistrée. Vérifiez les informations saisies.");
      return;
    }
    setFormSubmitted(true);
  };

  const currentSteps = activeTab === 'bilan' ? bilanSteps : vaeSteps;
  const currentPricing = activeTab === 'bilan' ? bilanPricing : vaePricing;
  const currentBenefits = activeTab === 'bilan' ? bilanBenefits : vaeBenefits;
  const titleText =
    activeTab === 'bilan'
      ? 'Comprenez vos atouts et définissez votre projet professionnel'
      : "Faites valider votre expérience et obtenez un diplôme";
  const descriptionText =
    activeTab === 'bilan'
      ? "Le bilan de compétences est un outil d'analyse personnalisé qui permet de faire le point sur votre parcours, identifier vos compétences, vos motivations et définir un projet professionnel cohérent. Notre méthode sur-mesure s'adapte à votre situation unique."
      : "La VAE permet d'obtenir un diplôme, un titre ou un certificat de qualification en faisant reconnaître votre expérience professionnelle. Peu importe comment vous avez acquis vos compétences : travail, bénévolat, engagement associatif... Tout compte !";

  return (
    <main className="pt-[72px]">
      {/* Header */}
      <section
        className="w-full pt-16 md:pt-20 pb-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(108,190,17,0.08), rgba(108,190,17,0))',
        }}
      >
        <div className="container-cf">
          {/* Breadcrumb */}
          <div className="text-[13px] mb-6" style={{ color: 'var(--cf-gray-light)' }}>
            <Link to="/" className="hover:text-[#6CBE11] transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <span>Bilan &amp; VAE</span>
          </div>

          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-black leading-tight">
              Faites le point sur votre carrière
            </h1>
            <p className="text-base mt-3 max-w-[700px]" style={{ color: 'var(--cf-gray-medium)' }}>
              Que vous souhaitiez faire le bilan de vos compétences ou faire reconnaître votre expérience, nos experts vous accompagnent dans votre évolution professionnelle.
            </p>
          </ScrollReveal>

          {/* Tabs */}
          <ScrollReveal delay={0.2}>
            <div className="flex gap-0 mt-10 border-b-2" style={{ borderColor: 'var(--cf-border-light)' }}>
              <button
                onClick={() => setActiveTab('bilan')}
                className={`px-6 md:px-8 py-4 text-base font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === 'bilan'
                    ? 'border-b-[3px]'
                    : 'hover:text-black'
                }`}
                style={{
                  color: activeTab === 'bilan' ? 'var(--cf-green)' : 'var(--cf-gray-light)',
                  borderColor: activeTab === 'bilan' ? 'var(--cf-green)' : 'transparent',
                }}
              >
                Bilan de Compétences
              </button>
              <button
                onClick={() => setActiveTab('vae')}
                className={`px-6 md:px-8 py-4 text-base font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === 'vae'
                    ? 'border-b-[3px]'
                    : 'hover:text-black'
                }`}
                style={{
                  color: activeTab === 'vae' ? 'var(--cf-green)' : 'var(--cf-gray-light)',
                  borderColor: activeTab === 'vae' ? 'var(--cf-green)' : 'transparent',
                }}
              >
                Validation des Acquis (VAE)
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What is it */}
      <section className="w-full py-16 bg-white">
        <div className="container-cf">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <ScrollReveal>
              <div>
                <span
                  className="inline-block text-[13px] font-medium px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: 'var(--cf-green-light)', color: 'var(--cf-green)' }}
                >
                  {activeTab === 'bilan' ? 'Bilan de Compétences' : 'Validation des Acquis de l\'Expérience'}
                </span>
                <h2 className="section-title">{titleText}</h2>
                <p className="text-base mt-4 leading-relaxed" style={{ color: 'var(--cf-gray-medium)' }}>
                  {descriptionText}
                </p>
                <ul className="flex flex-col gap-3 mt-6">
                  {currentBenefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-3 text-[15px]" style={{ color: 'var(--cf-gray-medium)' }}>
                      <CheckCircle size={18} style={{ color: 'var(--cf-green)' }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary mt-8">
                  {activeTab === 'bilan' ? 'Demander mon bilan' : 'Commencer ma VAE'}
                </button>
              </div>
            </ScrollReveal>

            {/* Image */}
            <ScrollReveal delay={0.2} direction="left">
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <img
                  src={activeTab === 'bilan' ? '/bilan-consultation.jpg' : '/vae-ceremonie.jpg'}
                  alt={activeTab === 'bilan' ? 'Consultation bilan de compétences' : 'Cérémonie de certification VAE'}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="campusforma-contact" className="w-full py-20" style={{ backgroundColor: 'var(--cf-bg)' }}>
        <div className="container-cf">
          <ScrollReveal>
            <h2 className="section-title text-center">
              {activeTab === 'bilan' ? 'Comment se déroule votre bilan ?' : 'Comment se déroule votre VAE ?'}
            </h2>
            <p className="section-subtitle text-center max-w-xl mx-auto">
              {activeTab === 'bilan'
                ? 'Un parcours structuré en 4 étapes, sur une durée de 3 à 6 mois'
                : 'Un parcours structuré en 5 étapes, sur une durée de 6 à 12 mois'}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {currentSteps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#EEEEEE] text-center h-full">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto"
                    style={{ backgroundColor: 'var(--cf-green)' }}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-black mt-5">{step.title}</h3>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--cf-gray-light)' }}>
                    {step.description}
                  </p>
                  <span
                    className="inline-block text-[13px] font-medium mt-4"
                    style={{ color: 'var(--cf-green)' }}
                  >
                    {step.duration}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
          {/* For VAE, add the 5th step below on mobile or in a second row */}
          {activeTab === 'vae' && (
            <div className="flex justify-center mt-6">
              <ScrollReveal delay={0.6}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#EEEEEE] text-center max-w-sm">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto"
                    style={{ backgroundColor: 'var(--cf-green)' }}
                  >
                    5
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-black mt-5">{vaeSteps[4].title}</h3>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--cf-gray-light)' }}>
                    {vaeSteps[4].description}
                  </p>
                  <span
                    className="inline-block text-[13px] font-medium mt-4"
                    style={{ color: 'var(--cf-green)' }}
                  >
                    {vaeSteps[4].duration}
                  </span>
                </div>
              </ScrollReveal>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="w-full py-20 bg-white">
        <div className="container-cf max-w-[1000px]">
          <ScrollReveal>
            <h2 className="section-title text-center">
              {activeTab === 'bilan' ? 'Nos formules de bilan' : 'Nos formules VAE'}
            </h2>
            <p className="section-subtitle text-center max-w-xl mx-auto">
              Choisissez la formule qui correspond à vos besoins
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {currentPricing.map((plan, i) => (
              <ScrollReveal key={i} delay={i * 0.2}>
                <PricingCard {...plan} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full py-20" style={{ backgroundColor: 'var(--cf-bg)' }}>
        <div className="container-cf max-w-[800px]">
          <ScrollReveal>
            <h2 className="section-title text-center">Prenez rendez-vous avec un conseiller</h2>
            <p className="section-subtitle text-center max-w-xl mx-auto">
              Remplissez le formulaire ci-dessous et nous vous recontactons sous 24h pour un entretien gratuit.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-[#EEEEEE] mt-10">
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: 'var(--cf-green-light)' }}
                  >
                    <CheckCircle size={32} style={{ color: 'var(--cf-green)' }} />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-black">
                    Demande envoyée avec succès !
                  </h3>
                  <p className="text-sm mt-2" style={{ color: 'var(--cf-gray-light)' }}>
                    Un conseiller vous contactera sous 24h.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--cf-gray-light)' }}>
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        className="w-full py-3 px-4 rounded-lg border text-base transition-all duration-300 focus:outline-none"
                        style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-gray-medium)' }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'var(--cf-green)';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,190,17,0.12)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'var(--cf-border)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--cf-gray-light)' }}>
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="w-full py-3 px-4 rounded-lg border text-base transition-all duration-300 focus:outline-none"
                        style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-gray-medium)' }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'var(--cf-green)';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,190,17,0.12)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'var(--cf-border)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--cf-gray-light)' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full py-3 px-4 rounded-lg border text-base transition-all duration-300 focus:outline-none"
                        style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-gray-medium)' }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'var(--cf-green)';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,190,17,0.12)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'var(--cf-border)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--cf-gray-light)' }}>
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        className="w-full py-3 px-4 rounded-lg border text-base transition-all duration-300 focus:outline-none"
                        style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-gray-medium)' }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'var(--cf-green)';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,190,17,0.12)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'var(--cf-border)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--cf-gray-light)' }}>
                      Je suis intéressé par *
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full py-3 px-4 rounded-lg border text-base transition-all duration-300 focus:outline-none cursor-pointer"
                      style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-gray-medium)' }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--cf-green)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,190,17,0.12)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--cf-border)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="bilan">Bilan de Compétences</option>
                      <option value="vae">Validation des Acquis (VAE)</option>
                      <option value="both">Les deux</option>
                    </select>
                  </div>
                  <div className="mt-5">
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--cf-gray-light)' }}>
                      Message (optionnel)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full py-3 px-4 rounded-lg border text-base transition-all duration-300 focus:outline-none resize-y"
                      style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-gray-medium)' }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--cf-green)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,190,17,0.12)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--cf-border)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  {formError && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 mt-5">{formError}</p>}
                  <button type="submit" disabled={formSubmitting} className="btn-primary w-full mt-6 py-4 disabled:opacity-60">
                    <Send size={18} />
                    {formSubmitting ? 'Enregistrement…' : 'Envoyer ma demande'}
                  </button>
                  <p className="text-xs text-center mt-4 flex items-center justify-center gap-1" style={{ color: 'var(--cf-gray-light)' }}>
                    <Lock size={12} />
                    Vos données sont protégées et ne seront jamais partagées.
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Payment & Security */}
      <section className="w-full py-10 bg-white border-t" style={{ borderColor: 'var(--cf-border-light)' }}>
        <div className="container-cf">
          <ScrollReveal>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <div className="flex items-center gap-2">
                <Lock size={18} style={{ color: 'var(--cf-green)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--cf-gray-light)' }}>
                  Paiement sécurisé
                </span>
              </div>

              {/* Payment method icons */}
              {[
                { name: 'Wave', Icon: Smartphone, color: '#00A8E8' },
                { name: 'Orange Money', Icon: Wallet, color: '#FF6600' },
                { name: 'Free Money', Icon: Building2, color: '#E30613' },
                { name: 'Free Money', Icon: CreditCard, color: '#E30613' },
                { name: 'Visa', Icon: CircleDollarSign, color: '#1A1F71' },
                { name: 'Mastercard', Icon: CreditCard, color: '#EB001B' },
              ].map(({ name, Icon, color }) => (
                <div
                  key={name}
                  className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300"
                  title={name}
                >
                  <Icon size={20} style={{ color }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--cf-gray)' }}>
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
