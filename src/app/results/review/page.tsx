'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertTriangle, ChevronRight, X, Loader } from 'lucide-react';

export default function DocumentReviewPage() {
  const router = useRouter();
  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('lifeguage_result') : null;
  const storedName = typeof window !== 'undefined' ? sessionStorage.getItem('lifeguage_name') : null;
  const [file, setFile] = useState<File | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    income: { status: 'good' | 'warn' | 'bad'; note: string };
    obligations: { status: 'good' | 'warn' | 'bad'; note: string };
    stability: { status: 'good' | 'warn' | 'bad'; note: string };
    overall: 'ready' | 'needs-work' | 'not-ready';
    overallNote: string;
    tips: string[];
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!stored) {
    router.replace('/wizard');
    return null;
  }

  const userName = storedName || 'there';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setAnalysing(true);
      // Simulate document analysis
      setTimeout(() => {
        setAnalysing(false);
        setAnalysis({
          income: {
            status: 'good',
            note: 'Monthly income of $6,500 is clearly documented and exceeds the minimum requirement for the loan range requested.',
          },
          obligations: {
            status: 'warn',
            note: 'Existing obligations of $1,800/month represent 28% of income. Acceptable, but reducing this will improve approval odds.',
          },
          stability: {
            status: 'good',
            note: '6+ months of consistent bank deposits visible. Employment is verifiable via salary credits.',
          },
          overall: 'needs-work',
          overallNote: 'Your documents show a solid base. With a few targeted improvements you will be in the best approval tier. Focus on the orange items below.',
          tips: [
            'Reduce obligations below 25% of income (pay down one credit card) → estimated approval increase: +$10K',
            'Hold 2 months of expenses in savings before applying — lenders see this as a stability signal',
            'Your last 3 months of bank statements show a consistent $500 surplus — highlight this when speaking to lenders',
          ],
        });
      }, 3000);
    }
  };

  const statusColor = (s: string) => s === 'good' ? 'text-green-600 bg-green-50 border-green-200' : s === 'warn' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200';
  const statusIcon = (s: string) => s === 'good' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/results" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Results
          </Link>
          <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full no-print">Free Review</span>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {!analysis ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Free Document Review</h1>
              <p className="text-slate-500 text-sm">Hi {userName}, upload your payslips or bank statement (PDF, PNG or JPG) and we&apos;ll tell you exactly what lenders will see.</p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
              <strong>Limited time:</strong> This review is free while in beta. Normally $5.99.
            </div>

            {!file ? (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-indigo-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-indigo-500" />
                </div>
                <p className="font-semibold text-slate-900 mb-1">Click to upload or drag & drop</p>
                <p className="text-sm text-slate-500">Bank statement or payslip · PDF, PNG, JPG · Max 10MB</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                {analysing ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-4">
                      <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
                    </div>
                    <p className="font-semibold text-slate-900">Analysing your document...</p>
                    <p className="text-sm text-slate-500 mt-1">Extracting income signals, obligations, and stability indicators</p>
                    <div className="mt-4 space-y-2 max-w-xs mx-auto text-left">
                      {['Opening document', 'Extracting transaction data', 'Identifying income patterns', 'Calculating expense ratio', 'Generating lender-ready summary'].map((step, i) => (
                        <div key={step} className="flex items-center gap-2 text-xs text-slate-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">What we extract from your documents:</p>
              <div className="grid grid-cols-2 gap-2">
                {['Monthly income', 'Employer name', 'Account behavior', 'Regular obligations', 'Average balance', 'Income stability'].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Your Document Analysis</h1>
              <p className="text-slate-500 text-sm">Here&apos;s what lenders will see when you apply.</p>
            </div>

            {/* Overall verdict */}
            <div className={`rounded-2xl border p-6 ${
              analysis.overall === 'ready' ? 'bg-green-50 border-green-200' :
              analysis.overall === 'needs-work' ? 'bg-amber-50 border-amber-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {analysis.overall === 'ready' ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-amber-600" />}
                <h3 className="font-bold text-slate-900">
                  {analysis.overall === 'ready' ? 'Ready to Apply!' : analysis.overall === 'needs-work' ? 'Almost There — Targeted Improvements Needed' : 'Needs Work Before Applying'}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{analysis.overallNote}</p>
            </div>

            {/* Signal cards */}
            <div className="space-y-3">
              {[
                { label: 'Income Verification', data: analysis.income },
                { label: 'Expense Ratio', data: analysis.obligations },
                { label: 'Account Stability', data: analysis.stability },
              ].map(({ label, data }) => (
                <div key={label} className={`flex items-center gap-4 rounded-xl border p-4 ${statusColor(data.status)}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${statusColor(data.status)}`}>
                    {statusIcon(data.status)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{label}</div>
                    <div className="text-sm mt-0.5 leading-relaxed">{data.note}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-3">What to Do Next</h3>
              <ul className="space-y-2">
                {analysis.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <Link href="/results" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">
                Back to My Results
              </Link>
              <Link href="/results/boost" className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition">
                <FileText className="w-4 h-4" />
                Get My Boost My Score Action Plan
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}