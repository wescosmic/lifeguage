'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Home, Car, GraduationCap, Plane, Briefcase, CreditCard,
  Brain, Lightbulb, FileText, Check, CheckCircle, X,
  ExternalLink, Phone, Globe, ArrowRight, ChevronRight, Star,
  MessageSquare
} from 'lucide-react';

interface LoanProductResult {
  id: string;
  name: string;
  icon: string;
  match_score: number;
  estimated_range: { min: number; max: number };
  rate_indicator: string;
  approval_chances: string;
  mini_summary: string;
  top_tips: string[];
}

interface WizardResult {
  overall_score: number;
  loan_range: { min: number; max: number };
  confidence: string;
  risk_summary: string;
  suggestions: string[];
  products: LoanProductResult[];
  behavioural_profile: { label: string; tag: string; description: string };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Home: <Home className="w-6 h-6 text-slate-700" />,
  Car: <Car className="w-6 h-6 text-slate-700" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-slate-700" />,
  Plane: <Plane className="w-6 h-6 text-slate-700" />,
  Briefcase: <Briefcase className="w-6 h-6 text-slate-700" />,
  CreditCard: <CreditCard className="w-6 h-6 text-slate-700" />,
};

const PROVIDERS: Record<string, Array<{ name: string; offer: string; rate: string; phone: string; website: string; logo: string; whatsapp: string; message: string }>> = {
  Home: [
    { name: 'First Citizens Bank', offer: 'Home loans & mortgages', rate: '6.5–8%', phone: '+1 (868) 624-3244', website: 'firstcitizens.tt', logo: '/logos/firstcitizens.svg', whatsapp: '18686243244', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a home loan. I\'d like to know more about your mortgage options. My score: ' },
    { name: 'Republic Bank', offer: 'Residential mortgages', rate: '7–9%', phone: '+1 (868) 623-7219', website: 'republictt.com', logo: '/logos/republicbank.svg', whatsapp: '18686237219', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a home loan. I\'d like to know more about your residential mortgage options. My score: ' },
    { name: 'Trinidad & Tobago Mortgage Finance', offer: 'Government-backed home loans', rate: '6–7.5%', phone: '+1 (868) 627-6237', website: 'ttmf.com', logo: '/logos/ttmf.svg', whatsapp: '18686276237', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a home loan. I\'d like to learn about your government-backed home loan options. My score: ' },
    { name: 'JMMB Bank', offer: 'Home improvement & purchase loans', rate: '8–10%', phone: '+1 (868) 627-9100', website: 'jmmb.com', logo: '/logos/jmmb.svg', whatsapp: '18686279100', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a home loan. I\'d like to know more about your home loan products. My score: ' },
  ],
  Car: [
    { name: 'Republic Bank', offer: 'New & used car loans', rate: '7–9%', phone: '+1 (868) 623-7219', website: 'republictt.com', logo: '/logos/republicbank.svg', whatsapp: '18686237219', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a car loan. I\'d like to know more about your auto financing options. My score: ' },
    { name: 'First Citizens Bank', offer: 'Auto financing', rate: '7.5–9.5%', phone: '+1 (868) 624-3244', website: 'firstcitizens.tt', logo: '/logos/firstcitizens.svg', whatsapp: '18686243244', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a car loan. I\'d like to know more about your auto financing options. My score: ' },
    { name: 'Scotiabank TT', offer: 'Vehicle loans', rate: '6.5–8.5%', phone: '+1 (868) 627-9100', website: 'scotiabank.com/tt', logo: '/logos/scotiabank.svg', whatsapp: '18686279100', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a car loan. I\'d like to know more about your vehicle loan options. My score: ' },
  ],
  Education: [
    { name: 'First Citizens Bank', offer: 'Education loans for locals', rate: '5–7%', phone: '+1 (868) 624-3244', website: 'firstcitizens.tt', logo: '/logos/firstcitizens.svg', whatsapp: '18686243244', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for an education loan. I\'d like to know more about your education financing options. My score: ' },
    { name: 'Government GATE Programme', offer: 'Government Assistance for Tuition Expenses', rate: '3–5%', phone: '+1 (868) 627-0094', website: 'gate.gov.tt', logo: '/logos/gate.svg', whatsapp: '18686270094', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for an education loan. I\'d like to learn more about the GATE programme. My score: ' },
    { name: 'Caribbean Union Bank', offer: 'Student loans & education financing', rate: '6–8%', phone: '+1 (868) 623-6441', website: 'caribbeanunionbank.com', logo: '/logos/caribbeanunion.svg', whatsapp: '18686236441', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for an education loan. I\'d like to know more about your student loan options. My score: ' },
  ],
  Vacation: [
    { name: 'First Citizens Bank', offer: 'Personal loans for travel', rate: '8–12%', phone: '+1 (868) 624-3244', website: 'firstcitizens.tt', logo: '/logos/firstcitizens.svg', whatsapp: '18686243244', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a travel loan. I\'d like to know more about your personal loan options for travel. My score: ' },
    { name: 'JMMB Bank', offer: 'Travel financing personal loans', rate: '9–12%', phone: '+1 (868) 627-9100', website: 'jmmb.com', logo: '/logos/jmmb.svg', whatsapp: '18686279100', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a travel loan. I\'d like to know more about your travel financing options. My score: ' },
    { name: 'Republic Bank', offer: 'Personal loans for leisure', rate: '8–11%', phone: '+1 (868) 623-7219', website: 'republictt.com', logo: '/logos/republicbank.svg', whatsapp: '18686237219', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a travel loan. I\'d like to know more about your personal loan options. My score: ' },
  ],
  Business: [
    { name: 'JMMB Business Banking', offer: 'SME loans, working capital, equipment financing', rate: '8–14%', phone: '+1 (868) 627-9100', website: 'jmmb.com', logo: '/logos/jmmb.svg', whatsapp: '18686279100', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a business loan. I\'d like to know more about your SME banking and loan products. My score: ' },
    { name: 'First Citizens SME Division', offer: 'Small business loans & start-up financing', rate: '7–12%', phone: '+1 (868) 624-3244', website: 'firstcitizens.tt', logo: '/logos/firstcitizens.svg', whatsapp: '18686243244', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a business loan. I\'d like to know more about your SME and start-up financing options. My score: ' },
    { name: 'Caribbean Development Bank (CDB)', offer: 'Development finance for businesses & NGOs', rate: '5–9%', phone: '+1 (246) 539-1600', website: 'caribank.org', logo: '/logos/cdb.svg', whatsapp: '12465391600', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a business loan. I\'d like to know more about your development finance products. My score: ' },
  ],
  Personal: [
    { name: 'JMMB Bank', offer: 'Personal loans & credit lines', rate: '10–14%', phone: '+1 (868) 627-9100', website: 'jmmb.com', logo: '/logos/jmmb.svg', whatsapp: '18686279100', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a personal loan. I\'d like to know more about your personal loan products. My score: ' },
    { name: 'Metro Certified Investments', offer: 'Quick personal loans', rate: '9–13%', phone: '+1 (868) 627-8900', website: 'metro.tt', logo: '/logos/metro.svg', whatsapp: '18686278900', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a personal loan. I\'d like to know more about your quick personal loan options. My score: ' },
    { name: 'First Citizens Bank', offer: 'Personal loan products', rate: '8–14%', phone: '+1 (868) 624-3244', website: 'firstcitizens.tt', logo: '/logos/firstcitizens.svg', whatsapp: '18686243244', message: 'Hi, I completed a Lifeguage prequalification and got a loan eligibility score for a personal loan. I\'d like to know more about your personal loan products. My score: ' },
  ],
};

const RATE_RANGES: Record<string, string> = {
  Home: '6.0–10%',
  Car: '6.5–9.5%',
  Education: '3–8%',
  Vacation: '8–12%',
  Business: '5–14%',
  Personal: '8–14%',
};

function ProviderModal({ productId, productName, onClose, score }: { productId: string; productName: string; onClose: () => void; score: number }) {
  const providers = PROVIDERS[productId] || [];
  const typeMap: Record<string, string> = {
    '🏠 Home': 'Home', '🚗 Car': 'Car', '🎓 Education': 'Education',
    '✈️ Vacation': 'Vacation', '💼 Business': 'Business', '💳 Personal': 'Personal',
  };
  const key = Object.keys(typeMap).find(k => productName.includes(k.split(' ')[1])) || productName;
  const mapped = Object.values(typeMap).find(v => productName.includes(v)) || productId;
  const providerList = PROVIDERS[mapped] || providers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="font-bold text-slate-900">Local Trinidad Providers for {productName}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {providerList.length === 0 ? (
            <p className="text-slate-500 text-sm">No providers listed for this loan type yet.</p>
          ) : (
            providerList.map((p, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3 mb-2">
                  <img
                    src={p.logo}
                    alt={`${p.name} logo`}
                    className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-0.5">
                      <h4 className="font-semibold text-slate-900 text-sm">{p.name}</h4>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0 ml-2">{p.rate}</span>
                    </div>
                    <p className="text-xs text-slate-600">{p.offer}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <a
                    href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(p.message + score)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat on WhatsApp
                  </a>
                  <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                    <Phone className="w-3 h-3" /> {p.phone}
                  </a>
                  <a href={`https://${p.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                    <Globe className="w-3 h-3" /> {p.website}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<WizardResult | null>(null);
  const [userName, setUserName] = useState('there');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ productId: string; productName: string } | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('lifeguage_result');
      const storedName = sessionStorage.getItem('lifeguage_name');
      if (stored) {
        setResult(JSON.parse(stored));
        setUserName(storedName || 'there');
      } else {
        router.replace('/wizard');
        return;
      }
    } catch {
      router.replace('/wizard');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleStartOver = () => {
    sessionStorage.removeItem('lifeguage_result');
    sessionStorage.removeItem('lifeguage_name');
    router.push('/wizard');
  };

  if (loading || !result) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-600">Loading results...</p>
        </div>
      </main>
    );
  }

  const r = result;

  return (
    <main className="min-h-screen bg-slate-50">
      <AnimatePresence>
        {modal && (
          <ProviderModal
            productId={modal.productId}
            productName={modal.productName}
            onClose={() => setModal(null)}
            score={r.overall_score}
          />
        )}
      </AnimatePresence>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </Link>
          <button onClick={handleStartOver} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Start Over →</button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <CheckCircle className="w-4 h-4" />
            Analysis Complete
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Your Prequalification Results</h1>
          <p className="text-slate-500">Hi {userName}, here&apos;s what we found based on your profile</p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-indigo-200 text-sm font-medium mb-1">Overall Score</div>
              <div className="text-5xl font-bold">{r.overall_score}<span className="text-2xl opacity-60">/100</span></div>
              <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm mt-3">
                <span>Confidence:</span>
                <span className="font-bold">{r.confidence}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-indigo-200 text-sm mb-1">Loan Range</div>
              <div className="text-2xl font-bold">{formatCurrency(r.loan_range.min)}</div>
              <div className="text-indigo-200 text-sm">to {formatCurrency(r.loan_range.max)}</div>
            </div>
          </div>
        </motion.div>

        {/* Behavioural Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900">{r.behavioural_profile.label}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  r.behavioural_profile.tag === 'Excellent' ? 'bg-green-100 text-green-700' :
                  r.behavioural_profile.tag === 'Good' ? 'bg-blue-100 text-blue-700' :
                  r.behavioural_profile.tag === 'Developing' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>{r.behavioural_profile.tag}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{r.behavioural_profile.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Products */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Your Loan Options</h2>
          <div className="space-y-3">
            {r.products.map((product, i) => {
              const iconEl = ICON_MAP[product.icon];
              const avgRate = RATE_RANGES[product.id] || RATE_RANGES[product.name] || '—';
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      {iconEl || <CreditCard className="w-6 h-6 text-slate-700" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            product.approval_chances === 'High' ? 'bg-green-100 text-green-700' :
                            product.approval_chances === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-50 text-red-600'
                          }`}>{product.approval_chances} Approval</span>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{product.match_score}% Match</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{product.mini_summary}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.top_tips.slice(0, 2).map(tip => (
                          <span key={tip} className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                            <Lightbulb className="w-3 h-3" /> {tip}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-semibold text-slate-700">
                          Range: {formatCurrency(product.estimated_range.min)} – {formatCurrency(product.estimated_range.max)}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          Rate: {product.rate_indicator}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700">
                          Avg. Local Rate: {avgRate}
                        </span>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => setModal({ productId: product.id, productName: product.name })}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                        >
                          View Providers <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Risk Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            Risk Summary
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">{r.risk_summary}</p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-slate-700" />
            Suggestions to Improve
          </h3>
          <ul className="space-y-3">
            {r.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                <span className="text-slate-700 text-sm">{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 pb-8"
        >
          <button onClick={handleStartOver} className="flex-1 py-3 px-6 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-center">
            Start Over
          </button>
          <a href="https://wa.me/14155238886" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 px-6 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition text-center flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Get WhatsApp Advice
          </a>
        </motion.div>
      </div>
    </main>
  );
}
