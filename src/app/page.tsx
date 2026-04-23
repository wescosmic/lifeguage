'use client';

import Link from 'next/link';
import { Banknote, Landmark, MessageSquare, MonitorPlay, Check } from 'lucide-react';
import { ClipboardList, Brain, Target } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Landmark className="w-4 h-4" />
            <span>AI-Powered Loan Prequalification</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Know Your Loan Eligibility in Minutes
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Get instant insights into your borrowing potential. No credit check, no commitment — just smart, AI-driven prequalification through the channel that suits you best.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
                <ClipboardList className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Answer a Few Questions</h3>
              <p className="text-sm text-slate-600">Quick conversational questions about your income, employment, and loan needs.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">We Analyse Your Profile</h3>
              <p className="text-sm text-slate-600">Our AI evaluates your financial profile to determine your loan prequalification.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Get Your Loan Estimate</h3>
              <p className="text-sm text-slate-600">Instant results with matched loan products, rates, and approval odds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              Start on WhatsApp
              <MessageSquare className="w-6 h-6 text-green-600" />
            </h2>
            <p className="text-slate-600 mb-6">
              Chat with our AI assistant in a conversational flow. Get prequalified in minutes through a friendly, familiar interface.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-500" />
                Conversational AI guidance
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-500" />
                Quick replies for fast input
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-500" />
                Available 24/7
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-500" />
                Results via chat
              </li>
            </ul>
            <Link
              href="https://wa.me/14155238886"
              className="inline-flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Start WhatsApp Chat
            </Link>
          </div>

          {/* Web Wizard Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <MonitorPlay className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              Use Web Wizard
              <MonitorPlay className="w-6 h-6 text-indigo-600" />
            </h2>
            <p className="text-slate-600 mb-6">
              Complete a guided 5-step form with visual sliders and clear progress tracking. Ideal for detailed applications.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-indigo-500" />
                Visual progress bar
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-indigo-500" />
                Intuitive slider inputs
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-indigo-500" />
                Step-by-step guidance
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-indigo-500" />
                Instant results display
              </li>
            </ul>
            <Link
              href="/wizard"
              className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Web Wizard
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your data is secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>No credit check impact</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant results</span>
            </div>
          </div>
          <div className="text-center mt-6 text-xs text-slate-400">
            © 2025 Lifeguage. AI-powered loan prequalification.
          </div>
        </div>
      </footer>
    </main>
  );
}
