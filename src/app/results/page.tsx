'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<WizardResult | null>(null);
  const [userName, setUserName] = useState('there');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('lifeguage_result');
      const storedName = sessionStorage.getItem('lifeguage_name');
      if (stored) {
        setResult(JSON.parse(stored));
        setUserName(storedName || 'there');
      } else {
        // No result stored — redirect back to wizard
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
            ✓ Analysis Complete
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
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 text-2xl">🧠</div>
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
          <h2 className="text-lg font-bold text-slate-900 mb-4">匹配的产品 · Matched Products</h2>
          <div className="space-y-3">
            {r.products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl shrink-0">
                    {product.icon}
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
                      <span>Range: <span className="font-semibold text-slate-700">{formatCurrency(product.estimated_range.min)} – {formatCurrency(product.estimated_range.max)}</span></span>
                      <span>Rate: <span className="font-semibold text-slate-700">{product.rate_indicator}</span></span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.top_tips.slice(0, 2).map(tip => (
                        <span key={tip} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">💡 {tip}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Risk Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h3 className="font-bold text-slate-900 mb-2">📋 Risk Summary</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{r.risk_summary}</p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <h3 className="font-bold text-slate-900 mb-4">💡 Suggestions to Improve</h3>
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
          <a href="https://wa.me/14155238886" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 px-6 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition text-center">
            Get WhatsApp Advice 🤖
          </a>
        </motion.div>
      </div>
    </main>
  );
}