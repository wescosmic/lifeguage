'use client';

import { useState, useReducer, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface WizardState {
  // Step 1 - Profile
  name: string;
  ageRange: string;
  employmentType: string;
  // Step 2 - Income
  monthlyIncome: number;
  incomeFrequency: string;
  hasAdditionalIncome: boolean;
  additionalIncomeAmount: number;
  // Step 3 - Expenses
  monthlyObligations: number;
  dependentsCount: number;
  hasExistingLoanPayments: boolean;
  // Step 4 - Behaviour
  savingHabit: number;
  billPaymentConsistency: number;
  financialBufferMonths: number;
  // Step 5 - Borrowing
  everBorrowed: boolean;
  borrowingHistory: string;
  // Step 6 - Loan Purpose (adaptive)
  loanPurpose: string;
  // Step 7 - Loan Details (adaptive based on purpose)
  collateralAvailable: boolean;
  coApplicantAvailable: boolean;
  urgencyLevel: string;
  // Step 8 - Documents
  hasDocuments: boolean;
  uploadedDocType: string;
}

type WizardAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_AGE_RANGE'; payload: string }
  | { type: 'SET_EMPLOYMENT_TYPE'; payload: string }
  | { type: 'SET_MONTHLY_INCOME'; payload: number }
  | { type: 'SET_INCOME_FREQUENCY'; payload: string }
  | { type: 'SET_HAS_ADDITIONAL_INCOME'; payload: boolean }
  | { type: 'SET_ADDITIONAL_INCOME_AMOUNT'; payload: number }
  | { type: 'SET_MONTHLY_OBLIGATIONS'; payload: number }
  | { type: 'SET_DEPENDENTS_COUNT'; payload: number }
  | { type: 'SET_HAS_EXISTING_LOAN_PAYMENTS'; payload: boolean }
  | { type: 'SET_SAVING_HABIT'; payload: number }
  | { type: 'SET_BILL_PAYMENT_CONSISTENCY'; payload: number }
  | { type: 'SET_FINANCIAL_BUFFER_MONTHS'; payload: number }
  | { type: 'SET_EVER_BORROWED'; payload: boolean }
  | { type: 'SET_BORROWING_HISTORY'; payload: string }
  | { type: 'SET_LOAN_PURPOSE'; payload: string }
  | { type: 'SET_COLLATERAL_AVAILABLE'; payload: boolean }
  | { type: 'SET_CO_APPLICANT_AVAILABLE'; payload: boolean }
  | { type: 'SET_URGENCY_LEVEL'; payload: string }
  | { type: 'SET_HAS_DOCUMENTS'; payload: boolean }
  | { type: 'SET_UPLOADED_DOC_TYPE'; payload: string }
  | { type: 'SET_RESULT'; payload: WizardResult }
  | { type: 'RESET' };

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

const initialState: WizardState & { result: WizardResult | null; isLoading: boolean } = {
  name: '',
  ageRange: '',
  employmentType: '',
  monthlyIncome: 5000,
  incomeFrequency: 'Monthly',
  hasAdditionalIncome: false,
  additionalIncomeAmount: 0,
  monthlyObligations: 1000,
  dependentsCount: 0,
  hasExistingLoanPayments: false,
  savingHabit: 3,
  billPaymentConsistency: 3,
  financialBufferMonths: 0,
  everBorrowed: false,
  borrowingHistory: '',
  loanPurpose: '',
  collateralAvailable: false,
  coApplicantAvailable: false,
  urgencyLevel: '',
  hasDocuments: false,
  uploadedDocType: '',
  result: null,
  isLoading: false,
};

function wizardReducer(state: WizardState & { result: WizardResult | null; isLoading: boolean }, action: WizardAction) {
  switch (action.type) {
    case 'SET_NAME': return { ...state, name: action.payload };
    case 'SET_AGE_RANGE': return { ...state, ageRange: action.payload };
    case 'SET_EMPLOYMENT_TYPE': return { ...state, employmentType: action.payload };
    case 'SET_MONTHLY_INCOME': return { ...state, monthlyIncome: action.payload };
    case 'SET_INCOME_FREQUENCY': return { ...state, incomeFrequency: action.payload };
    case 'SET_HAS_ADDITIONAL_INCOME': return { ...state, hasAdditionalIncome: action.payload };
    case 'SET_ADDITIONAL_INCOME_AMOUNT': return { ...state, additionalIncomeAmount: action.payload };
    case 'SET_MONTHLY_OBLIGATIONS': return { ...state, monthlyObligations: action.payload };
    case 'SET_DEPENDENTS_COUNT': return { ...state, dependentsCount: action.payload };
    case 'SET_HAS_EXISTING_LOAN_PAYMENTS': return { ...state, hasExistingLoanPayments: action.payload };
    case 'SET_SAVING_HABIT': return { ...state, savingHabit: action.payload };
    case 'SET_BILL_PAYMENT_CONSISTENCY': return { ...state, billPaymentConsistency: action.payload };
    case 'SET_FINANCIAL_BUFFER_MONTHS': return { ...state, financialBufferMonths: action.payload };
    case 'SET_EVER_BORROWED': return { ...state, everBorrowed: action.payload };
    case 'SET_BORROWING_HISTORY': return { ...state, borrowingHistory: action.payload };
    case 'SET_LOAN_PURPOSE': return { ...state, loanPurpose: action.payload };
    case 'SET_COLLATERAL_AVAILABLE': return { ...state, collateralAvailable: action.payload };
    case 'SET_CO_APPLICANT_AVAILABLE': return { ...state, coApplicantAvailable: action.payload };
    case 'SET_URGENCY_LEVEL': return { ...state, urgencyLevel: action.payload };
    case 'SET_HAS_DOCUMENTS': return { ...state, hasDocuments: action.payload };
    case 'SET_UPLOADED_DOC_TYPE': return { ...state, uploadedDocType: action.payload };
    case 'SET_RESULT': return { ...state, result: action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}

function mapAgeToStability(age: string): number {
  switch (age) {
    case '18-25': return 0.4; case '26-35': return 0.6; case '36-50': return 0.8; case '51-65': return 0.9; case '65+': return 0.7;
    default: return 0.5;
  }
}

function mapEmploymentType(type: string): 'salaried' | 'self-employed' | 'freelance' | 'informal' {
  const map: Record<string, 'salaried' | 'self-employed' | 'freelance' | 'informal'> = {
    'Salaried': 'salaried', 'Self-employed': 'self-employed', 'Freelance': 'freelance', 'Informal': 'informal',
  };
  return map[type] ?? 'salaried';
}

function mapBorrowingHistory(everBorrowed: boolean, history: string): 'excellent' | 'good' | 'limited' | 'no-history' {
  if (!everBorrowed) return 'no-history';
  switch (history) {
    case 'Always paid on time': return 'excellent';
    case 'Sometimes late': return 'good';
    case 'Often late': return 'limited';
    default: return 'limited';
  }
}

const LOAN_PURPOSES = [
  { id: 'home', label: 'Home', icon: '🏠', desc: 'Purchase, build, or renovate', extra: true },
  { id: 'car', label: 'Car', icon: '🚗', desc: 'New or pre-owned vehicle', extra: true },
  { id: 'education', label: 'Education', icon: '🎓', desc: 'Tuition and academic costs', extra: false },
  { id: 'vacation', label: 'Vacation', icon: '✈️', desc: 'Holiday and travel', extra: false },
  { id: 'business', label: 'Business', icon: '💼', desc: 'Startup or grow your business', extra: true },
  { id: 'other', label: 'Personal', icon: '💳', desc: 'Flexible personal financing', extra: false },
];

// Step visibility / eligibility helpers
function needsCollateral(purpose: string): boolean {
  return ['home', 'car', 'business'].includes(purpose);
}

function needsUrgency(purpose: string): boolean {
  return ['home', 'car'].includes(purpose);
}

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [state, dispatch] = useReducer(wizardReducer, initialState as WizardState & { result: WizardResult | null; isLoading: boolean });
  const [assessing, setAssessing] = useState(false);
  const [assessmentProgress, setAssessmentProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const totalSteps = 8;

  // Steps 6b (collateral) and 6c (urgency) are conditional
  // Effective visible steps: 1-5 = Profile+Income+Expenses+Behaviour+Borrowing
  // Step 6 = Loan Purpose
  // Step 6b = Collateral (if applicable) — treated as step 7
  // Step 6c = Urgency (if applicable) — treated as step 7b
  // Step 7 = Documents
  // Final = Results

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return state.name.trim() !== '' && state.ageRange !== '' && state.employmentType !== '';
      case 2: return true;
      case 3: return true;
      case 4: return true; // behaviour has defaults
      case 5: return state.everBorrowed ? state.borrowingHistory !== '' : true;
      case 6: return state.loanPurpose !== '';
      case 7: return !needsCollateral(state.loanPurpose) || true; // collateral has default false
      case 8: return true;
      default: return false;
    }
  };

  const getAdaptiveSteps = (): number => {
    let s = 6;
    if (needsCollateral(state.loanPurpose)) s++;
    if (needsUrgency(state.loanPurpose)) s++;
    s++; // documents
    return s;
  };

  const handleNext = async () => {
    const adaptiveSteps = getAdaptiveSteps();
    if (step < adaptiveSteps) {
      setStep(step + 1);
    } else {
      // Run assessment animation then show results
      setAssessing(true);
      setAssessmentProgress(0);

      const interval = setInterval(() => {
        setAssessmentProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 12 + 3;
        });
      }, 200);

      await new Promise(r => setTimeout(r, 3200));
      clearInterval(interval);
      setAssessmentProgress(100);

      await new Promise(r => setTimeout(r, 400));

      const incomeStability = mapAgeToStability(state.ageRange);
      const totalIncome = state.monthlyIncome + (state.hasAdditionalIncome ? state.additionalIncomeAmount : 0);
      const expenseRatio = Math.min(state.monthlyObligations / totalIncome, 1);
      const savingHabitNormalized = state.savingHabit / 5;
      const behaviourScore = (
        (state.savingHabit / 5) +
        (state.billPaymentConsistency / 5) +
        Math.min(state.financialBufferMonths / 6, 1)
      ) / 3;
      const employmentType = mapEmploymentType(state.employmentType);
      const borrowingHistory = mapBorrowingHistory(state.everBorrowed, state.borrowingHistory);

      const purposeMap: Record<string, string> = {
        'Home': 'home', 'Car': 'car', 'Education': 'education',
        'Vacation': 'vacation', 'Business': 'business', 'Personal': 'other',
      };

      let payload: Record<string, unknown> = {
        income_stability: incomeStability,
        income_amount: totalIncome,
        expense_ratio: expenseRatio,
        saving_habit: savingHabitNormalized,
        employment_type: employmentType,
        borrowing_history: borrowingHistory,
        loan_purpose: purposeMap[state.loanPurpose] ?? 'other',
        dependents: state.dependentsCount,
        has_existing_loans: state.hasExistingLoanPayments,
        financial_behaviour_score: behaviourScore,
      };

      try {
        const response = await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        dispatch({ type: 'SET_RESULT', payload: result });
        sessionStorage.setItem('lifeguage_result', JSON.stringify(result));
        sessionStorage.setItem('lifeguage_name', state.name);
        setAssessing(false);
        router.push('/results');
      } catch {
        setAssessing(false);
        // Fallback: compute locally and redirect to /results
        const result = buildSimResult();
        dispatch({ type: 'SET_RESULT', payload: result });
        sessionStorage.setItem('lifeguage_result', JSON.stringify(result));
        sessionStorage.setItem('lifeguage_name', state.name);
        router.push('/results');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStartOver = () => {
    sessionStorage.removeItem('lifeguage_result');
    sessionStorage.removeItem('lifeguage_name');
    dispatch({ type: 'RESET' } as WizardAction);
    setStep(1);
    setAssessing(false);
    setAssessmentProgress(0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  // Build simulated result for display (matching the new scoring engine shape)
  const buildSimResult = () => {
    const incomeStability = mapAgeToStability(state.ageRange);
    const totalIncome = state.monthlyIncome + (state.hasAdditionalIncome ? state.additionalIncomeAmount : 0);
    const expenseRatio = Math.min(state.monthlyObligations / totalIncome, 1);
    const savingHabitNormalized = state.savingHabit / 5;
    const behaviourScore = (
      (state.savingHabit / 5) + (state.billPaymentConsistency / 5) + Math.min(state.financialBufferMonths / 6, 1)
    ) / 3;
    const employmentType = mapEmploymentType(state.employmentType);
    const borrowingHistory = mapBorrowingHistory(state.everBorrowed, state.borrowingHistory);

    // Simulate the scoring logic locally for demo
    const normalizedIncome = Math.min(Math.max((totalIncome - 1000) / 19000, 0), 1);
    const incomeComponent = normalizedIncome * 0.4;
    const expenseComponent = (1 - expenseRatio) * 0.3;
    const baseScore = incomeComponent + expenseComponent;
    const stabilityMultiplier = 0.5 + (incomeStability * 0.5);
    const employmentMultiplier = { salaried: 1.2, 'self-employed': 1.0, freelance: 0.8, informal: 0.55 }[employmentType] ?? 1;
    const savingMultiplier = 0.5 + (savingHabitNormalized * 0.5);
    const borrowingMultiplier = { excellent: 1.2, good: 1.0, limited: 0.75, 'no-history': 0.6 }[borrowingHistory] ?? 0.6;
    const dependentsPenalty = Math.max(0.6, 1 - (state.dependentsCount * 0.06));
    const existingLoanPenalty = state.hasExistingLoanPayments ? 0.75 : 1.0;
    const behaviourBoost = 0.7 + (behaviourScore * 0.3);
    const finalScore = Math.max(0, Math.min(1,
      baseScore * 0.25 + stabilityMultiplier * 0.15 + employmentMultiplier * 0.15 +
      savingMultiplier * 0.12 + borrowingMultiplier * 0.12 +
      dependentsPenalty * 0.08 + existingLoanPenalty * 0.08 + behaviourBoost * 0.15
    ));
    const confidence = finalScore > 0.6 ? 'High' : finalScore > 0.35 ? 'Medium' : 'Experimental';

    const purposeMap: Record<string, string> = {
      'Home': 'home', 'Car': 'car', 'Education': 'education',
      'Vacation': 'vacation', 'Business': 'business', 'Personal': 'other',
    };
    const loanPurpose = purposeMap[state.loanPurpose] ?? 'other';

    const loanRanges = {
      home: { min: Math.round(totalIncome * 2.5), max: Math.round(totalIncome * 5) },
      car: { min: Math.round(totalIncome * 0.8), max: Math.round(totalIncome * 2) },
      education: { min: Math.round(totalIncome * 0.5), max: Math.round(totalIncome * 1.5) },
      vacation: { min: Math.round(totalIncome * 0.2), max: Math.round(totalIncome * 0.6) },
      business: { min: Math.round(totalIncome * 1), max: Math.round(totalIncome * 3) },
      personal: { min: Math.round(totalIncome * 0.5), max: Math.round(totalIncome * 1.2) },
    };

    const products: LoanProductResult[] = [
      { id: 'home', name: 'Home Loan', icon: '🏠', match_score: 0, estimated_range: loanRanges.home, rate_indicator: '6.5–9.5%', approval_chances: 'High', mini_summary: 'Strong equity potential and long-tenure financing.', top_tips: ['Maintain 6 months of payments in savings', 'Reduce other credit before applying'] },
      { id: 'car', name: 'Car Loan', icon: '🚗', match_score: 0, estimated_range: loanRanges.car, rate_indicator: '7–11%', approval_chances: 'High', mini_summary: 'Asset-backed with manageable monthly obligations.', top_tips: ['Larger down payment reduces interest', 'Consider certified pre-owned'] },
      { id: 'education', name: 'Education Loan', icon: '🎓', match_score: 0, estimated_range: loanRanges.education, rate_indicator: '5–8%', approval_chances: 'Medium', mini_summary: 'High ROI with income-contingent repayment options.', top_tips: ['Explore government grants first', 'Deferred repayment eases burden'] },
      { id: 'vacation', name: 'Travel Loan', icon: '✈️', match_score: 0, estimated_range: loanRanges.vacation, rate_indicator: '8–14%', approval_chances: 'Medium', mini_summary: 'Short-tenure, experience-driven investment.', top_tips: ['Travel rewards cards can offset costs', 'Off-season booking reduces total needed'] },
      { id: 'business', name: 'Business Loan', icon: '💼', match_score: 0, estimated_range: loanRanges.business, rate_indicator: '10–16%', approval_chances: 'Low', mini_summary: 'Revenue-generating asset with growth potential.', top_tips: ['Detailed business plan strengthens application', 'Separate business and personal finances'] },
      { id: 'personal', name: 'Personal Loan', icon: '💳', match_score: 0, estimated_range: loanRanges.personal, rate_indicator: '8–14%', approval_chances: 'Medium', mini_summary: 'Flexible use, no collateral required.', top_tips: ['Consolidate high-interest debt first', 'Avoid layering multiple personal loans'] },
    ];

    const configs = [
      { id: 'home', name: 'Home Loan', icon: '🏠' },
      { id: 'car', name: 'Car Loan', icon: '🚗' },
      { id: 'education', name: 'Education Loan', icon: '🎓' },
      { id: 'vacation', name: 'Travel Loan', icon: '✈️' },
      { id: 'business', name: 'Business Loan', icon: '💼' },
      { id: 'personal', name: 'Personal Loan', icon: '💳' },
    ];

    products.forEach(p => {
      const purposeBoost = loanPurpose === p.id ? 1.4 : 0.7;
      const empBoost = employmentMultiplier;
      const borrowBoost = borrowingMultiplier;
      const matchScore = Math.round(Math.min(Math.max(finalScore * purposeBoost * empBoost * borrowBoost * 75, 25), 98));
      p.match_score = matchScore;
      const variance = Math.abs(empBoost - 1) * 0.2 + Math.abs(borrowBoost - 1) * 0.15;
      p.approval_chances = variance < 0.1 && finalScore > 0.4 ? 'High' : variance < 0.25 && finalScore > 0.25 ? 'Medium' : 'Low';
    });
    products.sort((a, b) => b.match_score - a.match_score);

    const profileLabels = [
      { min: 0.7, label: 'Financial Guardian', tag: 'Excellent', description: 'You demonstrate strong financial discipline with consistent saving, low expense ratios, and stable income management.' },
      { min: 0.5, label: 'Growth Planner', tag: 'Good', description: 'You maintain healthy financial habits with room to optimize. Your profile suggests responsible money management.' },
      { min: 0.3, label: 'Building Foundation', tag: 'Developing', description: 'Your financial profile is building momentum. Focus on stability and reducing expense ratios to unlock better loan terms.' },
      { min: 0, label: 'Early Builder', tag: 'Foundational', description: "You're at the start of your financial journey. Small consistent steps now will compound into major eligibility gains." },
    ];
    const profile = profileLabels.find(p => finalScore >= p.min) ?? profileLabels[profileLabels.length - 1];

    const suggestions: string[] = [];
    if (expenseRatio > 0.6) suggestions.push('Reduce monthly obligations to improve eligibility');
    if (savingHabitNormalized < 0.4) suggestions.push('Build a stronger savings buffer to demonstrate financial discipline');
    if (borrowingHistory === 'no-history') suggestions.push('Start a small credit product to build borrowing history');
    if (finalScore < 0.4) suggestions.push('Focus on stable income and reduced expenses before larger loans');
    if (suggestions.length === 0) suggestions.push('Maintain current financial habits to preserve your prequalification strength');

    const riskFactors: string[] = [];
    if (expenseRatio > 0.7) riskFactors.push('high expense burden');
    if (savingHabitNormalized < 0.3) riskFactors.push('low savings rate');
    if (employmentType === 'informal') riskFactors.push('irregular income from informal employment');
    const risk_summary = finalScore >= 0.65
      ? `Strong prequalification profile.${riskFactors.length ? ' Minor: ' + riskFactors.join(', ') + '.' : ' Stable financial indicators.'}`
      : finalScore >= 0.4
        ? `Moderate prequalification.${riskFactors.length ? ' Address: ' + riskFactors.join(', ') + '.' : ' Some variability in stability.'}`
        : `Experimental prequalification.${riskFactors.length ? ' Risk factors: ' + riskFactors.join(', ') + '.' : ' Profile needs strengthening.'}`;

    return {
      overall_score: Math.round(finalScore * 100),
      loan_range: { min: Math.round(finalScore * 30000) + 5000, max: Math.round(finalScore * 500000) + 15000 },
      confidence,
      risk_summary,
      suggestions,
      products,
      behavioural_profile: profile,
    };
  };

  // Assessment screen
  if (assessing) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 opacity-20" />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-indigo-400"
                style={{ pathLength: assessmentProgress / 100, clipPath: 'inset(0 0 50% 0)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-3xl font-bold text-white"
                  key={Math.round(assessmentProgress)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {Math.min(Math.round(assessmentProgress), 100)}%
                </motion.span>
              </div>
            </div>
            <motion.h2
              className="text-2xl font-bold text-white mb-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Analysing your profile...
            </motion.h2>
            <p className="text-indigo-300 text-sm">Evaluating financial behaviour, income patterns, and loan affinity</p>
          </motion.div>

          <div className="space-y-3">
            {[
              'Cross-referencing income stability',
              'Evaluating expense-to-income ratio',
              'Assessing employment profile',
              'Calculating behavioural signals',
              'Matching loan product affinities',
              'Generating personalised recommendations',
            ].map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.4 }}
                className="flex items-center gap-3 bg-white/5 backdrop-blur rounded-xl px-4 py-3"
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-indigo-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
                <span className="text-slate-300 text-sm">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Results screen — redirect to /results page
  if (step === 999) {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('lifeguage_result')) {
      router.replace('/results');
    }
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-600">Loading results...</p>
        </div>
      </main>
    );
  }

  // --- FORM STEPS ---
  const progressWidth = (step / getAdaptiveSteps()) * 100;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
          </Link>
          <div className="font-bold text-slate-900 text-sm">Lifeguage Wizard</div>
          <div className="w-16" />
        </div>
      </header>

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Step {step} of {getAdaptiveSteps()}</span>
            <span className="text-sm text-slate-500">{Math.round(progressWidth)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-indigo-600 h-2 rounded-full"
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* STEP 1 - Profile */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Tell us about yourself</h2>
                  <p className="text-slate-500 text-sm">We start with the basics — takes 20 seconds.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Your Name <span className="text-red-500">*</span></label>
                  <input type="text" value={state.name} onChange={e => dispatch({ type: 'SET_NAME', payload: e.target.value })} placeholder="e.g. Marcus"
                    className="w-full px-4 py-3.5 border-2 border-slate-300 rounded-xl text-slate-900 text-base font-medium placeholder-slate-400 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Age Range <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-5 gap-2">
                    {['18-25', '26-35', '36-50', '51-65', '65+'].map(age => (
                      <button key={age} type="button" onClick={() => dispatch({ type: 'SET_AGE_RANGE', payload: age })}
                        className={`py-3 rounded-xl border-2 font-medium text-sm transition ${state.ageRange === age ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Employment Type <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Salaried', 'Self-employed', 'Freelance', 'Informal'].map(type => (
                      <button key={type} type="button" onClick={() => dispatch({ type: 'SET_EMPLOYMENT_TYPE', payload: type })}
                        className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition ${state.employmentType === type ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 - Income */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Income Details</h2>
                  <p className="text-slate-500 text-sm">Help us understand your earning capacity.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Monthly Income: <span className="text-indigo-600 font-bold text-base">{formatCurrency(state.monthlyIncome)}</span>
                  </label>
                  <input type="range" min="1000" max="20000" step="500" value={state.monthlyIncome} onChange={e => dispatch({ type: 'SET_MONTHLY_INCOME', payload: Number(e.target.value) })}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  <div className="flex justify-between text-xs text-slate-600 font-medium mt-1"><span>$1K</span><span>$20K</span></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Income Frequency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Monthly', 'Bi-weekly', 'Weekly'].map(freq => (
                      <button key={freq} type="button" onClick={() => dispatch({ type: 'SET_INCOME_FREQUENCY', payload: freq })}
                        className={`py-3 rounded-xl border-2 font-medium text-sm transition ${state.incomeFrequency === freq ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Additional income sources? <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
                      <button key={label} type="button" onClick={() => dispatch({ type: 'SET_HAS_ADDITIONAL_INCOME', payload: val })}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition ${state.hasAdditionalIncome === val ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {state.hasAdditionalIncome && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Additional Income: <span className="text-indigo-600 font-bold">{formatCurrency(state.additionalIncomeAmount)}</span>/mo
                    </label>
                    <input type="range" min="0" max="10000" step="100" value={state.additionalIncomeAmount} onChange={e => dispatch({ type: 'SET_ADDITIONAL_INCOME_AMOUNT', payload: Number(e.target.value) })}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 - Expenses */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Monthly Obligations</h2>
                  <p className="text-slate-500 text-sm">Tell us about your existing financial commitments.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Monthly Obligations: <span className="text-indigo-600 font-bold text-base">{formatCurrency(state.monthlyObligations)}</span>
                  </label>
                  <input type="range" min="0" max="10000" step="100" value={state.monthlyObligations} onChange={e => dispatch({ type: 'SET_MONTHLY_OBLIGATIONS', payload: Number(e.target.value) })}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  <div className="flex justify-between text-xs text-slate-600 font-medium mt-1"><span>$0</span><span>$10K</span></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Number of Dependents <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-6 gap-2">
                    {[0, 1, 2, 3, 4, 5].map(c => (
                      <button key={c} type="button" onClick={() => dispatch({ type: 'SET_DEPENDENTS_COUNT', payload: c })}
                        className={`py-3 rounded-xl border-2 font-semibold text-base transition ${state.dependentsCount === c ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Existing major loan payments? <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
                      <button key={label} type="button" onClick={() => dispatch({ type: 'SET_HAS_EXISTING_LOAN_PAYMENTS', payload: val })}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition ${state.hasExistingLoanPayments === val ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 - Behaviour */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Financial Behaviour</h2>
                  <p className="text-slate-500 text-sm">These questions help us understand your money habits — no right or wrong answers.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Saving Habit: <span className="text-indigo-600 font-bold">{state.savingHabit}/5</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button key={r} type="button" onClick={() => dispatch({ type: 'SET_SAVING_HABIT', payload: r })}
                        className={`py-4 rounded-xl border-2 font-bold text-lg transition ${state.savingHabit === r ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 font-medium mt-1"><span>Poor</span><span>Excellent</span></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Bill Payment Consistency: <span className="text-indigo-600 font-bold">{state.billPaymentConsistency}/5</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button key={r} type="button" onClick={() => dispatch({ type: 'SET_BILL_PAYMENT_CONSISTENCY', payload: r })}
                        className={`py-4 rounded-xl border-2 font-bold text-lg transition ${state.billPaymentConsistency === r ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 font-medium mt-1"><span>Often late</span><span>Always on time</span></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Financial Safety Buffer: <span className="text-indigo-600 font-bold">{state.financialBufferMonths} months</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 3, 6].map(m => (
                      <button key={m} type="button" onClick={() => dispatch({ type: 'SET_FINANCIAL_BUFFER_MONTHS', payload: m })}
                        className={`py-3 rounded-xl border-2 font-medium text-sm transition ${state.financialBufferMonths === m ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {m === 0 ? 'None' : `${m} mo`}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">How many months of expenses do you have saved?</p>
                </div>
              </div>
            )}

            {/* STEP 5 - Borrowing History */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Borrowing History</h2>
                  <p className="text-slate-500 text-sm">Your credit history helps us calibrate loan offers.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Have you borrowed before? <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
                      <button key={label} type="button" onClick={() => dispatch({ type: 'SET_EVER_BORROWED', payload: val })}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition ${state.everBorrowed === val ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {state.everBorrowed && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">How did you manage repayments? <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                      {['Always paid on time', 'Sometimes late', 'Often late'].map(h => (
                        <button key={h} type="button" onClick={() => dispatch({ type: 'SET_BORROWING_HISTORY', payload: h })}
                          className={`w-full py-3 px-4 rounded-xl border-2 font-medium text-sm text-left transition ${state.borrowingHistory === h ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!state.everBorrowed && (
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <p className="text-sm text-indigo-700 font-medium">🆕 No borrowing history</p>
                    <p className="text-xs text-indigo-600 mt-1">Starting fresh can actually be an advantage — some lenders view new borrowers positively!</p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 6 - Loan Purpose */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Loan Purpose</h2>
                  <p className="text-slate-500 text-sm">What are you looking to finance? This shapes your recommendations.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {LOAN_PURPOSES.map(p => (
                    <button key={p.id} type="button" onClick={() => dispatch({ type: 'SET_LOAN_PURPOSE', payload: p.label })}
                      className={`p-4 rounded-xl border-2 text-left transition ${state.loanPurpose === p.label ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                      <span className="text-2xl mb-2 block">{p.icon}</span>
                      <span className={`font-semibold text-sm block ${state.loanPurpose === p.label ? 'text-indigo-700' : 'text-slate-900'}`}>{p.label}</span>
                      <span className="text-xs text-slate-500 mt-1 block">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6b - Collateral (adaptive, only for home/car/business) */}
            {step === 6.5 && needsCollateral(state.loanPurpose) && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Collateral Options</h2>
                  <p className="text-slate-500 text-sm">Do you have assets to secure the loan? This can improve your offer.</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-amber-700 font-medium">💡 Tip for {state.loanPurpose === 'Home' ? 'Home Loans' : state.loanPurpose === 'Car' ? 'Car Loans' : 'Business Loans'}</p>
                  <p className="text-xs text-amber-600 mt-1">
                    {state.loanPurpose === 'Home' ? 'Property collateral can reduce your interest rate by 2-4%.' :
                     state.loanPurpose === 'Car' ? 'Vehicle collateral makes approval nearly guaranteed at better rates.' :
                     'Business assets as collateral significantly boost loan limits.'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Do you have collateral available? <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
                      <button key={label} type="button" onClick={() => dispatch({ type: 'SET_COLLATERAL_AVAILABLE', payload: val })}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition ${state.collateralAvailable === val ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Co-applicant available? <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
                      <button key={label} type="button" onClick={() => dispatch({ type: 'SET_CO_APPLICANT_AVAILABLE', payload: val })}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition ${state.coApplicantAvailable === val ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6c - Urgency (adaptive, only for home/car) */}
            {step === 6.7 && needsUrgency(state.loanPurpose) && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Timeline</h2>
                  <p className="text-slate-500 text-sm">When are you looking to access funds?</p>
                </div>
                <div className="space-y-2">
                  {['Ready to apply now', 'Within 1-3 months', 'Within 3-6 months', 'Exploring options'].map(u => (
                    <button key={u} type="button" onClick={() => dispatch({ type: 'SET_URGENCY_LEVEL', payload: u })}
                      className={`w-full py-3 px-4 rounded-xl border-2 font-medium text-sm text-left transition ${state.urgencyLevel === u ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7 / 8 - Document Upload */}
            {step === 7 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Verify Your Profile</h2>
                  <p className="text-slate-500 text-sm">Upload documents to validate your information and improve accuracy. OCR will extract key data automatically.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Do you have documents to upload? <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {[{ label: 'Yes, upload', val: true }, { label: 'Skip for now', val: false }].map(({ label, val }) => (
                      <button key={label} type="button" onClick={() => dispatch({ type: 'SET_HAS_DOCUMENTS', payload: val })}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition ${state.hasDocuments === val ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {state.hasDocuments && (
                  <div className="space-y-3">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition"
                    >
                      <div className="text-4xl mb-2">📄</div>
                      <p className="font-semibold text-slate-900 text-sm">Click to upload or drag & drop</p>
                      <p className="text-xs text-slate-500 mt-1">Bank statements, payslips, or ID (PDF, PNG, JPG)</p>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) dispatch({ type: 'SET_UPLOADED_DOC_TYPE', payload: file.name });
                    }} />
                    {state.uploadedDocType && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                        <span className="text-green-600">✅</span>
                        <span className="text-sm text-green-700 font-medium">Uploaded: {state.uploadedDocType}</span>
                        <span className="text-xs text-green-600 ml-auto">OCR scanning...</span>
                      </div>
                    )}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-xs text-slate-500 font-medium mb-2">What we extract (no manual entry needed):</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['Monthly income', 'Employer name', 'Account behavior', 'Regular obligations', 'Average balance'].map(item => (
                          <div key={item} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <span className="text-indigo-500">✓</span> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {!state.hasDocuments && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-600">You can still get results — we'll estimate based on your answers. Upload documents later to refine your prequalification.</p>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
          {step > 1 && (
            <button type="button" onClick={handleBack}
              className="flex-1 py-3 px-6 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition">
              Back
            </button>
          )}
          <button type="button" onClick={handleNext} disabled={!canProceed()}
            className={`flex-1 py-3 px-6 font-semibold rounded-xl transition ${canProceed() ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
            {step === getAdaptiveSteps() ? '🧠 Analyse My Profile' : 'Continue'}
          </button>
        </div>
      </div>
    </main>
  );
}