'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Download, ChevronRight, CheckCircle, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

const today = new Date().toLocaleDateString('en-TT', { day: 'numeric', month: 'long', year: 'numeric' });

export default function PreApprovalPage() {
  const router = useRouter();
  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('lifeguage_result') : null;
  const storedName = typeof window !== 'undefined' ? sessionStorage.getItem('lifeguage_name') : null;

  const result = stored ? JSON.parse(stored) : null;
  const userName = storedName || 'there';

  useEffect(() => {
    if (!result) router.replace('/wizard');
  }, [result, router]);

  if (!result) return null;

  const r = result;

  const topProducts = [...r.products]
    .sort((a: any, b: any) => b.match_score - a.match_score)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white" id="print-area">
      {/* Header - hidden on print */}
      <div className="no-print sticky top-0 bg-white border-b border-slate-200 z-10 px-4 py-3 flex items-center justify-between">
        <Link href="/results" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Results
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <Printer className="w-4 h-4" />
            Print Letter
          </button>
        </div>
      </div>

      {/* Letter Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-6 py-10 print:py-0"
      >
        {/* Letterhead */}
        <div className="flex items-start justify-between mb-8 border-b border-slate-200 pb-6">
          <div>
            <div className="text-2xl font-bold text-indigo-700 tracking-tight">Lifeguage</div>
            <div className="text-sm text-slate-500 mt-0.5">AI-Powered Loan Prequalification</div>
            <div className="text-xs text-slate-400 mt-0.5">lifeguage.app</div>
          </div>
          <div className="text-right text-sm text-slate-600">
            <div>Date: {today}</div>
            <div className="mt-1">Ref: LG-{Math.round(Math.random() * 90000 + 10000)}</div>
          </div>
        </div>

        {/* Recipient */}
        <div className="mb-8">
          <div className="text-sm text-slate-600 mb-4">
            <div className="font-semibold text-slate-900">{userName}</div>
            <div>Trinidad & Tobago</div>
          </div>
          <div className="text-sm text-slate-500 italic">
            Re: Lifeguage Pre-Qualification Certificate
          </div>
        </div>

        {/* Opening */}
        <div className="mb-8 space-y-3">
          <p className="text-slate-700 text-sm leading-relaxed">
            Dear {userName},
          </p>
          <p className="text-slate-700 text-sm leading-relaxed">
            Thank you for completing the Lifeguage pre-qualification assessment. Based on the information you provided, we have generated the following pre-qualification summary. This document is intended to support your loan application process at Trinidad and Tobago financial institutions.
          </p>
          <p className="text-slate-600 text-xs">
            <strong>Important:</strong> This certificate represents an indicative pre-qualification estimate only and does not constitute a formal loan offer from any financial institution. Final loan approval is subject to each lender&apos;s credit assessment, documentation verification, and internal approval processes.
          </p>
        </div>

        {/* Score Highlight */}
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Pre-Qualification Score</div>
              <div className="text-5xl font-bold text-indigo-900">{r.overall_score}<span className="text-xl text-indigo-400">/100</span></div>
              <div className="mt-2 text-sm text-slate-600">
                <strong>{r.behavioural_profile.label}</strong> · {r.confidence} Confidence
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Est. Loan Range</div>
              <div className="text-2xl font-bold text-indigo-900">{formatCurrency(r.loan_range.min)}</div>
              <div className="text-sm text-slate-600">to {formatCurrency(r.loan_range.max)}</div>
            </div>
          </div>
          <div className="mt-4 bg-white/60 rounded-xl p-3 text-xs text-slate-600">
            {r.behavioural_profile.description}
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mb-8">
          <div className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Recommended Loan Products</div>
          <div className="space-y-3">
            {topProducts.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">📄</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">Range: {formatCurrency(p.estimated_range.min)} – {formatCurrency(p.estimated_range.max)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">{p.match_score}% Match</div>
                  <div className={`text-xs font-semibold ${p.approval_chances === 'High' ? 'text-green-600' : p.approval_chances === 'Medium' ? 'text-amber-600' : 'text-slate-500'}`}>{p.approval_chances} Approval</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Summary */}
        <div className="mb-8">
          <div className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Risk Summary</div>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4">{r.risk_summary}</p>
        </div>

        {/* Suggestions */}
        <div className="mb-8">
          <div className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Improving Your Score</div>
          <div className="space-y-2">
            {r.suggestions.slice(0, 4).map((s: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-600">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-200 pt-4 mt-8">
          <p className="text-xs text-slate-400 leading-relaxed">
            This Pre-Qualification Certificate is generated by Lifeguage based on user-provided financial data. It is provided for informational purposes only. Lifeguage makes no representations or warranties regarding the accuracy of this estimate or the approval of any loan application. Users are advised to directly contact their chosen financial institution for formal loan eligibility assessment. Lifeguage accepts no liability for decisions made based on this certificate.
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-slate-400">Generated on {today} · Lifeguage Pre-Qualification System v1.0</div>
            <div className="text-xs text-slate-400 font-mono">ID: LG-{Math.round(r.overall_score * 100)}-{Math.round(r.loan_range.min / 1000)}</div>
          </div>
        </div>

        {/* Print CTA */}
        <div className="no-print mt-6 flex justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
          <Link
            href="/results"
            className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
          >
            Back to Results
          </Link>
        </div>
      </motion.div>
    </div>
  );
}