'use client';

import { useState, useReducer } from 'react';
import Link from 'next/link';

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
  // Step 4 - Behavior
  savingHabit: number;
  everBorrowed: boolean;
  loanPurpose: string;
  // Results
  result: {
    loan_range: { min: number; max: number };
    confidence: string;
    risk_summary: string;
    suggestions: string[];
  } | null;
  isLoading: boolean;
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
  | { type: 'SET_EVER_BORROWED'; payload: boolean }
  | { type: 'SET_LOAN_PURPOSE'; payload: string }
  | { type: 'SET_RESULT'; payload: WizardState['result'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' };

const initialState: WizardState = {
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
  everBorrowed: false,
  loanPurpose: '',
  result: null,
  isLoading: false,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
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
    case 'SET_EVER_BORROWED': return { ...state, everBorrowed: action.payload };
    case 'SET_LOAN_PURPOSE': return { ...state, loanPurpose: action.payload };
    case 'SET_RESULT': return { ...state, result: action.payload };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}

function mapAgeToStability(age: string): number {
  switch (age) {
    case '18-25': return 0.4;
    case '26-35': return 0.6;
    case '36-50': return 0.8;
    case '51-65': return 0.9;
    case '65+': return 0.7;
    default: return 0.5;
  }
}

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const totalSteps = 5;

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return state.name.trim() !== '' && state.ageRange !== '' && state.employmentType !== '';
      case 2: return true; // Income has defaults
      case 3: return true; // Expenses has defaults
      case 4: return state.loanPurpose !== '';
      case 5: return false; // Results step
      default: return false;
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit to API
      dispatch({ type: 'SET_LOADING', payload: true });

      const incomeStability = mapAgeToStability(state.ageRange);
      const totalIncome = state.monthlyIncome + (state.hasAdditionalIncome ? state.additionalIncomeAmount : 0);
      const expenseRatio = state.monthlyObligations / totalIncome;
      const savingHabitNormalized = state.savingHabit / 5;

      // Map employment type
      const employmentTypeMap: Record<string, 'salaried' | 'self-employed' | 'freelance' | 'informal'> = {
        'Salaried': 'salaried',
        'Self-employed': 'self-employed',
        'Freelance': 'freelance',
        'Informal': 'informal',
      };

      // Map borrowing history
      const borrowingHistory = state.everBorrowed ? 'limited' : 'no-history';

      try {
        const response = await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            income_stability: incomeStability,
            income_amount: totalIncome,
            expense_ratio: Math.min(expenseRatio, 1),
            saving_habit: savingHabitNormalized,
            employment_type: employmentTypeMap[state.employmentType] || 'salaried',
            borrowing_history: borrowingHistory,
          }),
        });

        const result = await response.json();
        dispatch({ type: 'SET_RESULT', payload: result });
      } catch (error) {
        console.error('Score API error:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStartOver = () => {
    dispatch({ type: 'RESET' });
    setStep(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <div className="font-bold text-slate-900">Lifeguage Wizard</div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Progress Bar */}
      {step <= 4 && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Step {step} of {totalSteps - 1}</span>
              <span className="text-sm text-slate-500">{Math.round((step / (totalSteps - 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step 1 - Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Tell us about yourself</h2>
              <p className="text-slate-600">We&apos;ll start with some basic information.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.name}
                onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3.5 border-2 border-slate-300 rounded-xl text-slate-900 text-base font-medium placeholder-slate-400 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Age Range <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {['18-25', '26-35', '36-50', '51-65', '65+'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_AGE_RANGE', payload: age })}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition ${
                      state.ageRange === age
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Salaried', 'Self-employed', 'Freelance', 'Informal'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_EMPLOYMENT_TYPE', payload: type })}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition ${
                      state.employmentType === type
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Income */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Income Details</h2>
              <p className="text-slate-600">Help us understand your earning capacity.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Monthly Income: <span className="text-indigo-600 font-bold">{formatCurrency(state.monthlyIncome)}</span>
              </label>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={state.monthlyIncome}
                onChange={(e) => dispatch({ type: 'SET_MONTHLY_INCOME', payload: Number(e.target.value) })}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-600 font-medium mt-1">
                <span>$1K</span>
                <span>$20K</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Income Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {['Monthly', 'Bi-weekly', 'Weekly'].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_INCOME_FREQUENCY', payload: freq })}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition ${
                      state.incomeFrequency === freq
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Do you have additional income sources? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_HAS_ADDITIONAL_INCOME', payload: true })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition ${
                    state.hasAdditionalIncome
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_HAS_ADDITIONAL_INCOME', payload: false })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition ${
                    !state.hasAdditionalIncome
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {state.hasAdditionalIncome && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Monthly Income: <span className="text-indigo-600 font-bold">{formatCurrency(state.additionalIncomeAmount)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={state.additionalIncomeAmount}
                  onChange={(e) => dispatch({ type: 'SET_ADDITIONAL_INCOME_AMOUNT', payload: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3 - Expenses */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Monthly Obligations</h2>
              <p className="text-slate-600">Help us understand your expense commitments.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Monthly Obligations: <span className="text-indigo-600 font-bold">{formatCurrency(state.monthlyObligations)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={state.monthlyObligations}
                onChange={(e) => dispatch({ type: 'SET_MONTHLY_OBLIGATIONS', payload: Number(e.target.value) })}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-600 font-medium mt-1">
                <span>$0</span>
                <span>$10K</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Number of Dependents <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_DEPENDENTS_COUNT', payload: count })}
                    className={`py-3 px-2 rounded-xl border-2 font-medium transition ${
                      state.dependentsCount === count
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Do you have major loan payments existing? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_HAS_EXISTING_LOAN_PAYMENTS', payload: true })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition ${
                    state.hasExistingLoanPayments
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_HAS_EXISTING_LOAN_PAYMENTS', payload: false })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition ${
                    !state.hasExistingLoanPayments
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 - Behavior */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Financial Behavior</h2>
              <p className="text-slate-600">Tell us about your financial habits and goals.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Saving Habit: <span className="text-indigo-600 font-bold">{state.savingHabit}/5</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_SAVING_HABIT', payload: rating })}
                    className={`py-4 rounded-xl border-2 font-bold text-lg transition ${
                      state.savingHabit === rating
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-600 font-medium mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Have you ever borrowed before? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_EVER_BORROWED', payload: true })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition ${
                    state.everBorrowed
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_EVER_BORROWED', payload: false })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition ${
                    !state.everBorrowed
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                What is the loan for? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Home', 'Education', 'Business', 'Emergency', 'Other'].map((purpose) => (
                  <button
                    key={purpose}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_LOAN_PURPOSE', payload: purpose })}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition ${
                      state.loanPurpose === purpose
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {purpose}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5 - Results */}
        {step === 5 && (
          <div className="space-y-6">
            {state.isLoading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-600">Calculating your prequalification...</p>
              </div>
            ) : state.result ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Prequalification Results</h2>
                  <p className="text-slate-600">
                    Hi {state.name}, based on your profile, here&apos;s what we found:
                  </p>
                </div>

                {/* Loan Range Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-8 text-white mb-6">
                  <div className="text-indigo-200 text-sm font-medium mb-1">Estimated Loan Range</div>
                  <div className="text-4xl font-bold mb-2">
                    {formatCurrency(state.result.loan_range.min)} - {formatCurrency(state.result.loan_range.max)}
                  </div>
                  <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm mt-2">
                    <span>Confidence:</span>
                    <span className="font-bold">{state.result.confidence}</span>
                  </div>
                </div>

                {/* Risk Summary */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
                  <h3 className="font-bold text-slate-900 mb-2">Risk Summary</h3>
                  <p className="text-slate-600">{state.result.risk_summary}</p>
                </div>

                {/* Suggestions */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
                  <h3 className="font-bold text-slate-900 mb-4">Suggestions to Improve</h3>
                  <ul className="space-y-3">
                    {state.result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-slate-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="flex-1 py-3 px-6 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
                  >
                    Start Over
                  </button>
                  <a
                    href="https://wa.me/14155238886"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-6 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition text-center"
                  >
                    Get WhatsApp Advice 🤖
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">Unable to calculate results. Please try again.</p>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="mt-4 py-2 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 5 && (
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 px-6 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 py-3 px-6 font-semibold rounded-xl transition ${
                canProceed()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Get Results' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}