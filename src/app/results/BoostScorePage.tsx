'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp, Sparkles, FileText, Lock, Unlock, ChevronRight,
  Target, Lightbulb, DollarSign, CreditCard, PiggyBank,
  GraduationCap, Briefcase, Clock, CheckCircle2, Star, ArrowRight
} from 'lucide-react';

interface BoostResult {
  overall_score: number;
  loan_range: { min: number; max: number };
  confidence: string;
  risk_summary: string;
  suggestions: string[];
  behavioural_profile: { label: string; tag: string; description: string };
  products: Array<{ id: string; name: string; icon: string; match_score: number; approval_chances: string }>;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

const SCORE_TIPS: Record<string, { focus: string; tip: string; impact: string }[]> = {
  saving: [
    { focus: 'Emergency Fund', tip: 'Build 3 months of expenses as a buffer before applying. Even $2,000 reduces your risk flag significantly.', impact: '+$8K–15K on loan range' },
    { focus: 'Automated Savings', tip: 'Set up a standing order for $200/mo immediately after payday. Consistency matters more than amount.', impact: 'Score +8 points' },
  ],
  expense: [
    { focus: 'Debt Consolidation', tip: 'Consolidate high-interest debt into one lower payment. Reduces expense ratio quickly.', impact: '+$12K–20K loan range' },
    { focus: 'Subscription Audit', tip: 'Cancel 2 unused subscriptions. Redirect saved amount to debt or savings.', impact: 'Score +5 points' },
  ],
  employment: [
    { focus: 'Job Tenure', tip: 'Stay in your current role for 12+ months. Lenders treat 2+ years at same employer as stability signal.', impact: 'Approval odds +25%' },
  ],
  borrowing: [
    { focus: 'Start Small', tip: 'Take a $500–$1,000 credit builder loan and repay on time. 6 months of positive history unlocks better rates.', impact: 'Score +12 points' },
  ],
};

const BUSINESS_IDEAS: Array<{ icon: React.ReactNode; title: string; description: string; revenue_potential: string; effort: string; loan_fit: string }> = [
  {
    icon: <Briefcase size={20} />,
    title: 'Freelance Consulting',
    description: 'Turn existing professional skills into a side income. Remote work opportunities in finance, IT, marketing, HR.',
    revenue_potential: '$800–3,000/mo part-time',
    effort: 'Low startup cost',
    loan_fit: 'Personal or SME loan to cover initial equipment + software',
  },
  {
    icon: <GraduationCap size={20} />,
    title: 'Tutoring / Coaching',
    description: 'Offer academic tutoring, exam prep, or professional coaching. High demand in TT for CXC, CAPE, and university-level support.',
    revenue_potential: '$600–2,500/mo',
    effort: 'Very low cost to start',
    loan_fit: 'Small personal loan for materials + marketing',
  },
  {
    icon: <DollarSign size={20} />,
    title: 'Resale / Import Business',
    description: 'Source products from US/UK wholesale and resell on Instagram, Facebook Marketplace, or a small Shopify store.',
    revenue_potential: '$500–5,000/mo depending on scale',
    effort: 'Moderate — inventory investment needed',
    loan_fit: 'Business loan for initial inventory',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Short-Term Rentals',
    description: 'List a room or property on Airbnb. TT tourism season (Nov–April) generates strong returns.',
    revenue_potential: '$1,500–8,000/mo',
    effort: 'Property dependent',
    loan_fit: 'Home improvement loan to renovate space',
  },
  {
    icon: <CreditCard size={20} />,
    title: 'Food & Catering Side Hustle',
    description: 'Home-based food business — lunches for offices, event catering, packaged goods. Low barrier to entry in TT.',
    revenue_potential: '$400–3,000/mo',
    effort: 'Low — mainly time investment',
    loan_fit: 'Small equipment loan or personal loan',
  },
  {
    icon: <PiggyBank size={20} />,
    title: 'Vehicle Hustle',
    description: 'Use a car/van for delivery, courier runs, or transport services. Works well alongside a day job.',
    revenue_potential: '$600–2,000/mo',
    effort: 'Vehicle required',
    loan_fit: 'Car loan with income-generating asset rationale',
  },
];

export default function BoostScorePage() {
  const router = useRouter();
  const [tab, setTab] = useState<'plan' | 'business' | 'review'>('plan');

  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('lifeguage_result') : null;
  const storedName = typeof window !== 'undefined' ? sessionStorage.getItem('lifeguage_name') : null;
  const result: BoostResult | null = stored ? JSON.parse(stored) : null;
  const userName = storedName || 'there';

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No profile data found. Complete the wizard first.</p>
          <Link href="/wizard" className="text-indigo-600 font-medium hover:underline">Start Wizard →</Link>
        </div>
      </main>
    );
  }

  const score = result.overall_score;

  // Generate personalised tips based on actual wizard answers
  const tips: { category: string; icon: React.ReactNode; title: string; body: string; impact: string; priority: number }[] = [];

  // Saving habit (from wizard)
  if (score < 70) {
    tips.push({
      category: 'Savings Buffer',
      icon: <PiggyBank size={18} />,
      title: 'Build an emergency fund',
      body: `Set aside ${formatCurrency(result.loan_range.min * 0.05)} as a start. Even small consistent deposits signal financial discipline to lenders. Target 3 months of expenses.`,
      impact: '+5–8 points on your score',
      priority: 1,
    });
  }

  if (result.confidence === 'Experimental') {
    tips.push({
      category: 'Credit History',
      icon: <CreditCard size={18} />,
      title: 'Establish borrowing history',
      body: 'Apply for a small credit builder product (even $500). Six months of on-time payments dramatically improves your confidence level.',
      impact: 'Confidence: Experimental → Medium',
      priority: 2,
    });
  }

  const expenseRatioHigh = result.risk_summary.includes('expense') || result.risk_summary.includes('obligation');
  if (expenseRatioHigh) {
    tips.push({
      category: 'Debt Management',
      icon: <TrendingUp size={18} />,
      title: 'Reduce your expense ratio',
      body: 'Consolidate any high-interest debt into a single lower-payment plan. Target keeping total obligations below 40% of monthly income.',
      impact: '+$15K+ on max loan range',
      priority: 3,
    });
  }

  tips.push({
    category: 'Income Documentation',
    icon: <FileText size={18} />,
    title: 'Prepare 3 months of payslips/bank statements',
    body: 'Lenders require income verification. Having these ready speeds up approval and often unlocks better rates without requiring additional collateral.',
    impact: 'Faster approval, better rate tier',
    priority: 4,
  });

  tips.push({
    category: 'Job Stability',
    icon: <Clock size={18} />,
    title: 'Stay employed for 12+ months before applying',
    body: 'Many lenders weigh employment tenure heavily. If you\'ve been in your current role under 6 months, wait until the 12-month mark for maximum leverage.',
    impact: 'Approval odds +20–30%',
    priority: 5,
  });

  tips.sort((a, b) => a.priority - b.priority);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/results" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm font-medium">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Results
          </Link>
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">Boost My Score</span>
          <div className="w-20" />
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 flex gap-1">
          {[
            { key: 'plan', label: 'Action Plan', icon: <Target size={14} /> },
            { key: 'business', label: 'Business Ideas', icon: <Lightbulb size={14} /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'plan' | 'business')}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {tab === 'plan' && (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Your Personalised Action Plan</h1>
              <p className="text-slate-500 text-sm">Hi {userName}, based on your profile (score: {score}/100 — {result.confidence} confidence), here are the steps to unlock your full loan potential.</p>
            </motion.div>

            {/* Score meter */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="3"
                      strokeDasharray={`${score}, 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900">{score}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">Current Score: {score}/100</div>
                  <div className="text-sm text-slate-500">{result.behavioural_profile.label} · {result.confidence} confidence</div>
                  <div className="text-sm text-slate-500 mt-0.5">Loan range: {formatCurrency(result.loan_range.min)} – {formatCurrency(result.loan_range.max)}</div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                {result.behavioural_profile.description}
              </div>
            </div>

            {/* Action steps */}
            <div>
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                Your Priority Steps
              </h2>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <motion.div
                    key={tip.category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-xl border border-slate-200 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                        {tip.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-slate-900 text-sm">{tip.title}</h3>
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{tip.impact}</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{tip.body}</p>
                        <span className="inline-block mt-2 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{tip.category}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Estimated improvement */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                If you follow this plan in 3–6 months
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">{score + 12}+</div>
                  <div className="text-sm text-slate-600">Estimated Score</div>
                </div>
                <div className="bg-white/70 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">{formatCurrency(result.loan_range.max * 1.3)}</div>
                  <div className="text-sm text-slate-600">New Max Loan Range</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">Estimates based on typical improvement patterns. Actual results depend on lender criteria and financial behaviour changes.</p>
            </div>

            <Link href="/results" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">
              Back to My Results <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {tab === 'business' && (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Side Hustle & Business Ideas</h1>
              <p className="text-slate-500 text-sm">Boost your income to improve your loan eligibility. These are matched to TT market conditions and your profile.</p>
            </motion.div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4">
              <p className="text-sm text-indigo-700 font-medium">💡 Revenue generated from a side hustle directly improves your income-to-loan ratio. Even $600/mo extra can push your score up by 8–15 points.</p>
            </div>

            <div className="space-y-4">
              {BUSINESS_IDEAS.map((idea, i) => (
                <motion.div
                  key={idea.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      {idea.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{idea.title}</h3>
                      <p className="text-sm text-slate-600 mt-0.5">{idea.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">💰 {idea.revenue_potential}</span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">⚡ {idea.effort}</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                    <span className="font-semibold text-indigo-600">Loan fit: </span>{idea.loan_fit}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        const msg = `Hi, I'm interested in a loan for a ${idea.title.toLowerCase()} side hustle. Can you advise on the best product for this? My Lifeguage score is ${score}.`;
                        window.open(`https://wa.me/18686243244?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1.5"
                    >
                      <span>Ask Lender via WhatsApp</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
              <strong>Pro tip:</strong> Lifeguage takes no commission on your business revenue — we're here to help you earn more and qualify for bigger loans. 🚀
            </div>

            <Link href="/results" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">
              Back to My Results <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}