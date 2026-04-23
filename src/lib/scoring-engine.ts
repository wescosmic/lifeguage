export type EmploymentType = 'salaried' | 'self-employed' | 'freelance' | 'informal';
export type BorrowingHistory = 'excellent' | 'good' | 'limited' | 'no-history';
export type LoanPurposeType = 'home' | 'car' | 'education' | 'business' | 'vacation' | 'other';
export type Confidence = 'High' | 'Medium' | 'Experimental';

export interface ScoringInputs {
  income_stability: number; // 0-1
  income_amount: number;
  expense_ratio: number; // 0-1
  saving_habit: number; // 0-1
  employment_type: EmploymentType;
  borrowing_history: BorrowingHistory;
  loan_purpose?: LoanPurposeType;
  dependents?: number;
  has_existing_loans?: boolean;
  financial_behaviour_score?: number; // 0-1
  stability_signals?: string[]; // e.g. ['same_job_2y', 'multiple_income', 'buffer_fund']
}

export interface LoanRange {
  min: number;
  max: number;
}

export type LoanTypeId = 'home' | 'car' | 'education' | 'vacation' | 'business' | 'personal';

export interface LoanProduct {
  id: LoanTypeId;
  name: string;
  icon: string;
  description: string;
  match_score: number; // 0-100
  estimated_range: LoanRange;
  rate_indicator: string;
  approval_chances: 'High' | 'Medium' | 'Low';
  mini_summary: string;
  top_tips: string[];
}

export interface ScoringResult {
  overall_score: number; // 0-100
  loan_range: LoanRange;
  confidence: Confidence;
  risk_summary: string;
  suggestions: string[];
  products: LoanProduct[];
  behavioural_profile: {
    label: string;
    tag: string;
    description: string;
  };
}

function getEmploymentMultiplier(type: EmploymentType): number {
  switch (type) {
    case 'salaried': return 1.2;
    case 'self-employed': return 1.0;
    case 'freelance': return 0.8;
    case 'informal': return 0.55;
  }
}

function getBorrowingMultiplier(history: BorrowingHistory): number {
  switch (history) {
    case 'excellent': return 1.2;
    case 'good': return 1.0;
    case 'limited': return 0.75;
    case 'no-history': return 0.6;
  }
}

function getPurposeBoost(purpose: LoanPurposeType, productId: LoanTypeId): number {
  if (purpose === productId) return 1.4;
  // Cross-affinity: home seekers might also qualify for renovation/car
  if (purpose === 'home' && (productId === 'car' || productId === 'personal')) return 0.9;
  if (purpose === 'car' && productId === 'personal') return 0.85;
  if (purpose === 'education' && productId === 'personal') return 0.8;
  if (purpose === 'vacation' && productId === 'personal') return 0.75;
  return 0.7;
}

function getDependentsPenalty(dependents: number): number {
  return Math.max(0.6, 1 - (dependents * 0.06));
}

function getExistingLoanPenalty(hasExisting: boolean): number {
  return hasExisting ? 0.75 : 1.0;
}

function mapScoreToLoanRange(score: number): LoanRange {
  if (score <= 0.15) return { min: 5000, max: 15000 };
  if (score <= 0.28) return { min: 15000, max: 35000 };
  if (score <= 0.42) return { min: 35000, max: 75000 };
  if (score <= 0.58) return { min: 75000, max: 150000 };
  if (score <= 0.75) return { min: 150000, max: 300000 };
  return { min: 300000, max: 500000 };
}

function getConfidence(score: number, variance: number): Confidence {
  if (variance > 0.3) return 'Experimental';
  if (variance > 0.15) return 'Medium';
  return 'High';
}

function getBehaviouralProfile(score: number): ScoringResult['behavioural_profile'] {
  if (score >= 0.7) return {
    label: 'Financial Guardian',
    tag: 'Excellent',
    description: 'You demonstrate strong financial discipline with consistent saving, low expense ratios, and stable income management.',
  };
  if (score >= 0.5) return {
    label: 'Growth Planner',
    tag: 'Good',
    description: 'You maintain healthy financial habits with room to optimize. Your profile suggests responsible money management.',
  };
  if (score >= 0.3) return {
    label: 'Building Foundation',
    tag: 'Developing',
    description: 'Your financial profile is building momentum. Focus on stability and reducing expense ratios to unlock better loan terms.',
  };
  return {
    label: 'Early Builder',
    tag: 'Foundational',
    description: 'You\'re at the start of your financial journey. Small steps now — consistent income and savings discipline — will compound into major eligibility gains.',
  };
}

function buildLoanProducts(
  score: number,
  purpose: LoanPurposeType | undefined,
  income: number,
  expense_ratio: number,
  employment: EmploymentType,
  saving: number,
  borrowing: BorrowingHistory
): LoanProduct[] {
  const products: LoanProduct[] = [];
  const ranges = {
    home: { min: Math.round(income * 2.5), max: Math.round(income * 5) },
    car: { min: Math.round(income * 0.8), max: Math.round(income * 2) },
    education: { min: Math.round(income * 0.5), max: Math.round(income * 1.5) },
    vacation: { min: Math.round(income * 0.2), max: Math.round(income * 0.6) },
    business: { min: Math.round(income * 1), max: Math.round(income * 3) },
    personal: { min: Math.round(income * 0.5), max: Math.round(income * 1.2) },
  };

  const configs: { id: LoanTypeId; name: string; icon: string; description: string; purpose_key: string }[] = [
    { id: 'home', name: 'Home Loan', icon: '🏠', description: 'Purchase, build, or renovate your home', purpose_key: 'home' },
    { id: 'car', name: 'Car Loan', icon: '🚗', description: 'New or pre-owned vehicle financing', purpose_key: 'car' },
    { id: 'education', name: 'Education Loan', icon: '🎓', description: 'Tuition, books, and academic expenses', purpose_key: 'education' },
    { id: 'vacation', name: 'Travel Loan', icon: '✈️', description: 'Holiday and travel financing', purpose_key: 'vacation' },
    { id: 'business', name: 'Business Loan', icon: '💼', description: 'Startup, expansion, or working capital', purpose_key: 'business' },
    { id: 'personal', name: 'Personal Loan', icon: '💳', description: 'Flexible personal financing', purpose_key: 'other' },
  ];

  configs.forEach(({ id, name, icon, description }) => {
    const purposeBoost = purpose ? getPurposeBoost(purpose, id) : 1.0;
    const matchScore = Math.round(Math.min(Math.max(score * purposeBoost * 85, 25), 98));
    const empMultiplier = getEmploymentMultiplier(employment);
    const borrowMultiplier = getBorrowingMultiplier(borrowing);
    const variance = Math.abs(empMultiplier - 1) * 0.2 + Math.abs(borrowMultiplier - 1) * 0.15;
    const chances: LoanProduct['approval_chances'] =
      variance < 0.1 && score > 0.4 ? 'High' :
      variance < 0.25 && score > 0.25 ? 'Medium' : 'Low';
    const rangeBoost = Math.max(ranges[id].min, Math.round(score * ranges[id].min * 0.5));
    const rangeMax = Math.max(ranges[id].max, Math.round(score * ranges[id].max * 0.7));

    const tips: Record<LoanTypeId, string[]> = {
      home: ['Maintain 6 months of loan payments in savings', 'Reduce other credit obligations before applying'],
      car: ['Larger down payment reduces interest significantly', 'Consider certified pre-owned for better rates'],
      education: ['Explore government education grants first', 'Deferred repayment options ease immediate burden'],
      vacation: ['Travel rewards cards can offset costs', 'Off-season booking reduces total loan needed'],
      business: ['Detailed business plan strengthens application', 'Separate business and personal finances early'],
      personal: ['Consolidate high-interest debt first', 'Avoid layering multiple personal loans'],
    };

    const miniSummaries: Record<LoanTypeId, string> = {
      home: 'Strong equity potential and long-tenure financing.',
      car: 'Asset-backed with manageable monthly obligations.',
      education: 'High ROI with income-contingent repayment options.',
      vacation: 'Short-tenure, experience-driven investment.',
      business: 'Revenue-generating asset with growth potential.',
      personal: 'Flexible use, no collateral required.',
    };

    products.push({
      id,
      name,
      icon,
      description,
      match_score: matchScore,
      estimated_range: { min: rangeBoost, max: rangeMax },
      rate_indicator: id === 'home' ? '6.5–9.5%' : id === 'car' ? '7–11%' : id === 'education' ? '5–8%' : id === 'business' ? '10–16%' : '8–14%',
      approval_chances: chances,
      mini_summary: miniSummaries[id],
      top_tips: tips[id],
    });
  });

  // Sort by match score descending
  products.sort((a, b) => b.match_score - a.match_score);
  return products;
}

export function calculateScore(inputs: ScoringInputs): ScoringResult {
  const {
    income_stability = 0.5,
    income_amount = 3000,
    expense_ratio = 0.4,
    saving_habit = 0.5,
    employment_type = 'salaried',
    borrowing_history = 'no-history',
    loan_purpose,
    dependents = 0,
    has_existing_loans = false,
    financial_behaviour_score = 0.5,
  } = inputs;

  const normalizedIncome = Math.min(Math.max((income_amount - 1000) / 19000, 0), 1);
  const incomeComponent = normalizedIncome * 0.4;
  const expenseComponent = (1 - expense_ratio) * 0.3;
  const baseScore = incomeComponent + expenseComponent;

  const stabilityMultiplier = 0.5 + (income_stability * 0.5);
  const employmentMultiplier = getEmploymentMultiplier(employment_type);
  const savingMultiplier = 0.5 + (saving_habit * 0.5);
  const borrowingMultiplier = getBorrowingMultiplier(borrowing_history);
  const dependentsPenalty = getDependentsPenalty(dependents);
  const existingLoanPenalty = getExistingLoanPenalty(has_existing_loans);
  const behaviourBoost = 0.7 + (financial_behaviour_score * 0.3);

  const weightedSum =
    baseScore * 0.25 +
    stabilityMultiplier * 0.15 +
    employmentMultiplier * 0.15 +
    savingMultiplier * 0.12 +
    borrowingMultiplier * 0.12 +
    dependentsPenalty * 0.08 +
    existingLoanPenalty * 0.08 +
    behaviourBoost * 0.15;

  const finalScore = Math.max(0, Math.min(1, weightedSum));

  const variance =
    Math.abs(employmentMultiplier - 1) * 0.2 +
    Math.abs(borrowingMultiplier - 1) * 0.15 +
    Math.abs(expense_ratio - 0.5) * 0.1;

  const confidence = getConfidence(finalScore, variance);
  const loanRange = mapScoreToLoanRange(finalScore);
  const behavioural_profile = getBehaviouralProfile(finalScore);

  const riskSummary = generateRiskSummary(finalScore, employment_type, expense_ratio, saving_habit);
  const suggestions = generateSuggestions(finalScore, expense_ratio, saving_habit, borrowing_history);
  const products = buildLoanProducts(finalScore, loan_purpose, income_amount, expense_ratio, employment_type, saving_habit, borrowing_history);

  return {
    overall_score: Math.round(finalScore * 100),
    loan_range: loanRange,
    confidence,
    risk_summary: riskSummary,
    suggestions,
    products,
    behavioural_profile,
  };
}

function generateRiskSummary(
  score: number,
  employmentType: EmploymentType,
  expenseRatio: number,
  savingHabit: number
): string {
  const riskFactors: string[] = [];

  if (expenseRatio > 0.7) riskFactors.push('high expense burden');
  if (savingHabit < 0.3) riskFactors.push('low savings rate');
  if (employmentType === 'informal') riskFactors.push('irregular income from informal employment');
  if (employmentType === 'freelance') riskFactors.push('variable income from freelance work');

  if (score >= 0.65) {
    return `Strong prequalification profile. ${riskFactors.length > 0 ? 'Minor considerations: ' + riskFactors.join(', ') + '.' : 'Stable financial indicators.'}`;
  } else if (score >= 0.4) {
    return `Moderate prequalification. ${riskFactors.length > 0 ? 'Key factors to address: ' + riskFactors.join(', ') + '.' : 'Some variability in financial stability.'}`;
  } else {
    return `Experimental prequalification. ${riskFactors.length > 0 ? 'Risk factors: ' + riskFactors.join(', ') + '.' : 'Profile needs strengthening before major loan consideration.'}`;
  }
}

function generateSuggestions(
  score: number,
  expenseRatio: number,
  savingHabit: number,
  borrowingHistory: BorrowingHistory
): string[] {
  const suggestions: string[] = [];

  if (expenseRatio > 0.6) suggestions.push('Consider reducing monthly obligations to improve loan eligibility');
  if (savingHabit < 0.4) suggestions.push('Build a stronger savings buffer to demonstrate financial discipline');
  if (borrowingHistory === 'no-history') suggestions.push('Consider starting with a small credit product to build borrowing history');
  if (borrowingHistory === 'limited') suggestions.push('Review past credit accounts and address any outstanding issues');
  if (score < 0.4) suggestions.push('Focus on stable income and reduced expenses before applying for larger loans');
  if (score >= 0.5 && suggestions.length === 0) suggestions.push('Maintain current financial habits to preserve prequalification strength');

  if (suggestions.length === 0) suggestions.push('Continue building a stable financial profile for best loan outcomes');
  return suggestions;
}