'use client';

import Link from 'next/link';
import { Landmark, MessageSquare, MonitorPlay, Check } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Hero */}
      <section className="pt-20 pb-14 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Landmark className="w-4 h-4" />
            <span>For Trinidad & Tobago</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
            Find out how much you can borrow — in 3 minutes
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
            No credit check. No bank visit. Just answer a few quick questions and we&apos;ll show you your loan eligibility with real TT lenders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="https://wa.me/14155238886" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-green-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Start on WhatsApp — Free
            </Link>
            <Link href="/wizard" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-indigo-200">
              <MonitorPlay className="w-5 h-5" />
              Try Web Wizard — Also Free
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">Takes about 3 minutes · No account needed</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 pb-14">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-6">How it works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: '1', title: 'Answer a few questions', desc: 'Tell us about your income, job, and spending. Nothing too personal.' },
              { n: '2', title: 'Get your score instantly', desc: 'We calculate your loan eligibility and show you how much you could borrow.' },
              { n: '3', title: 'See real TT lenders', desc: 'Compare rates from First Citizens, Republic Bank, JMMB, credit unions and more.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center mx-auto mb-3">{n}</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-6">What you get</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Your score out of 100', desc: 'Know exactly where you stand with lenders.' },
              { title: 'Estimated loan amount', desc: 'See how much you could borrow, from $5K up to $500K.' },
              { title: 'Lenders in TT', desc: 'Real banks and credit unions with real rates — click to chat on WhatsApp.' },
              { title: 'Ways to improve', desc: 'Get tips on what to fix before applying for a better rate.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-5 py-4">
                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-7 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">WhatsApp</h2>
            <p className="text-slate-600 text-sm mb-5 leading-relaxed">Chat with us on WhatsApp at your own pace. Quick questions, friendly flow, results delivered in chat.</p>
            <ul className="space-y-2 mb-5 text-sm text-slate-700">
              {['Takes about 2 minutes', 'No forms to fill', 'Available 24/7'].map(item => (
                <li key={item} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> {item}</li>
              ))}
            </ul>
            <Link href="https://wa.me/14155238886" className="inline-flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Start on WhatsApp
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
              <MonitorPlay className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Web Wizard</h2>
            <p className="text-slate-600 text-sm mb-5 leading-relaxed">Fill in a quick form online with sliders and buttons. Great for detailed applications with full results dashboard.</p>
            <ul className="space-y-2 mb-5 text-sm text-slate-700">
              {['8 quick steps', 'Visual progress bar', 'See all loan options at once'].map(item => (
                <li key={item} className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500 shrink-0" /> {item}</li>
              ))}
            </ul>
            <Link href="/wizard" className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Start Web Wizard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 text-sm text-slate-500 mb-5">
            <span className="flex items-center gap-1.5">🔒 Your data is secure</span>
            <span className="flex items-center gap-1.5">📊 No credit check impact</span>
            <span className="flex items-center gap-1.5">✅ 100% free</span>
          </div>
          <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
            © 2026 Lifeguage · Trinidad & Tobago · Not a lender — for informational purposes only
          </div>
        </div>
      </footer>
    </main>
  );
}