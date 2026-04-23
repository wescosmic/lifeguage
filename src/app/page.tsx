'use client';

import Link from 'next/link';
import { Landmark, MessageSquare, MonitorPlay, Check, ClipboardList, Brain, Target, Shield, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Hero Section */}
      <section className="pt-20 pb-14 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Landmark className="w-4 h-4" />
            <span>Built for Trinidad & Tobago</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
            Know Your Loan Eligibility<br className="hidden md:block" /> in Under 3 Minutes
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Stop guessing. Lifeguage gives you a real pre-qualification score — with actual TT lenders, real rates, and a clear action plan. No credit check, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="https://wa.me/14155238886" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-green-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Start on WhatsApp — Free
            </Link>
            <Link href="/wizard" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-indigo-200">
              <MonitorPlay className="w-5 h-5" />
              Take the Web Wizard
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">No account needed · No credit check · Results in minutes</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 pb-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <ClipboardList className="w-7 h-7" />, step: '1', title: 'Answer Quick Questions', desc: 'Tell us about your income, employment, expenses, and borrowing habits. Takes under 3 minutes.' },
              { icon: <Brain className="w-7 h-7" />, step: '2', title: 'AI Analysis', desc: 'We evaluate your financial profile against real TT lending criteria to generate your pre-qualification score.' },
              { icon: <Target className="w-7 h-7" />, step: '3', title: 'See Your Loan Options', desc: 'Get your estimated range, match scores per loan type, and direct WhatsApp links to real TT lenders.' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4 mx-auto text-indigo-600">{icon}</div>
                <div className="text-xs font-bold text-indigo-500 mb-2">STEP {step}</div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="px-6 pb-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: <Zap className="w-5 h-5" />, title: 'Your Score Out of 100', desc: 'A clear numerical pre-qualification score based on real lending criteria used by TT banks and credit unions.' },
              { icon: <Shield className="w-5 h-5" />, title: 'Loan Range Estimates', desc: 'Estimated minimum and maximum loan amounts across Home, Car, Education, Business, Vacation, and Personal products.' },
              { icon: <Users className="w-5 h-5" />, title: 'Matched TT Providers', desc: 'Real lenders in Trinidad — banks and credit unions — with their rates, approval odds, and direct WhatsApp links.' },
              { icon: <Brain className="w-5 h-5" />, title: 'Behavioural Profile', desc: 'We categorise your financial personality (Financial Guardian, Growth Planner, etc.) and explain what it means for lenders.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">{icon}</div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Full Details */}
      <section className="px-6 pb-14">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h3 className="text-white font-bold text-lg">Complete Feature Breakdown</h3>
              <p className="text-indigo-200 text-sm mt-0.5">Everything you get with Lifeguage prequalification</p>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">8-Step Web Wizard</h4>
                    <p className="text-sm text-slate-500 mt-1">Profile → Income → Expenses → Financial Behaviour → Borrowing History → Loan Purpose → Adaptive Questions → Document Upload. Adaptive questions change based on loan type (e.g. collateral questions for home loans, urgency for car loans).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Animated Assessment Screen</h4>
                    <p className="text-sm text-slate-500 mt-1">Watch your profile being analysed in real time with a circular progress indicator and step-by-step analysis descriptions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">6 Loan Products with Match Scores</h4>
                    <p className="text-sm text-slate-500 mt-1">Home, Car, Education, Vacation, Business, and Personal — each with a 0–100% match score, rate range, approval chance, mini-summary, and tips.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Local TT Provider Network</h4>
                    <p className="text-sm text-slate-500 mt-1">Every product shows real Trinidad and Tobago lenders (First Citizens, Republic Bank, JMMB, credit unions, and more) with their rates and a direct WhatsApp deep-link with your score already in the message.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">5</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Upsell: Boost My Score (Free)</h4>
                    <p className="text-sm text-slate-500 mt-1">Personalised action plan based on your actual profile weaknesses. Includes side hustle ideas with TT-specific income potential and loan fit advice.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">6</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Upsell: Pre-Approval Letter $9.99</h4>
                    <p className="text-sm text-slate-500 mt-1">Printable PDF Lifeguage Pre-Qualification Certificate with your score, loan range, and top product matches. Present it directly at any TT bank.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm shrink-0">7</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Upsell: Free Document Review (Limited)</h4>
                    <p className="text-sm text-slate-500 mt-1">Upload a payslip or bank statement and get an instant breakdown of what lenders will see — income signals, expense ratio, and account stability.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-5">
          {/* WhatsApp */}
          <div className="bg-white rounded-2xl p-7 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Start on WhatsApp</h2>
            <p className="text-slate-600 mb-5 text-sm leading-relaxed">Chat with our AI assistant at your own pace. Conversational, friendly, and available 24/7. Takes about 2 minutes.</p>
            <ul className="space-y-2.5 mb-6 text-sm text-slate-700">
              {[
                'Guided conversational flow',
                'Quick reply buttons for speed',
                'Results delivered in chat',
                'Direct WhatsApp to lender',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link href="https://wa.me/14155238886" className="inline-flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Start on WhatsApp
            </Link>
          </div>

          {/* Web Wizard */}
          <div className="bg-white rounded-2xl p-7 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-5">
              <MonitorPlay className="w-7 h-7 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Use Web Wizard</h2>
            <p className="text-slate-600 mb-5 text-sm leading-relaxed">8-step guided form with visual sliders, adaptive questions, and a detailed results dashboard.</p>
            <ul className="space-y-2.5 mb-6 text-sm text-slate-700">
              {[
                'Progress bar across 8 steps',
                'Slider inputs with live values',
                'Adaptive questions per loan type',
                'Full results with provider network',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/wizard" className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Start Web Wizard
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-6 text-sm text-slate-500 text-center mb-6">
            {[
              { icon: '🔒', label: 'Your data is secure' },
              { icon: '📊', label: 'No credit check impact' },
              { icon: '⚡', label: 'Results in minutes' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
            © 2026 Lifeguage · Trinidad & Tobago · lifeguage.app · For informational purposes only. Lifeguage is not a lender.
          </div>
        </div>
      </footer>
    </main>
  );
}