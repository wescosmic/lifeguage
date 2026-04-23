export type EmploymentType = 'salaried' | 'self-employed' | 'freelance' | 'informal';
export type BorrowingHistory = 'excellent' | 'good' | 'limited' | 'no-history';
export type Confidence = 'High' | 'Medium' | 'Experimental';

export interface ScoringInputs {
  income_stability: number; // 0-1
  income_amount: number;
  expense_ratio: number; // 0-1
  saving_habit: number; // 0-1
  employment_type: EmploymentType;
  borrowing_history: BorrowingHistory;
}

export interface LoanRange {
  min: number;
  max: number;
}

export interface ScoringResult {
  loan_range: LoanRange;
  confidence: Confidence;
  risk_summary: string;
  suggestions: string[];
}

function getEmploymentMultiplier(type: EmploymentType): number {
  switch (type) {
    case 'salaried': return 1.2;
    case 'self-employed': return 1.0;
    case 'freelance': return 0.8;
    case 'informal': return 0.6;
  }
}

function getBorrowingMultiplier(history: BorrowingHistory): number {
  switch (history) {
    case 'excellent': return 1.2;
    case 'good': return 1.0;
    case 'limited': return 0.8;
    case 'no-history': return 0.7;
  }
}

function mapScoreToLoanRange(score: number): LoanRange {
  // Score ranges from 0 to ~1.0 (theoretical max)
  // Map to $5K - $500K
  if (score <= 0.2) return { min: 5000, max: 15000 };
  if (score <= 0.35) return { min: 15000, max: 35000 };
  if (score <= 0.5) return { min: 35000, max: 75000 };
  if (score <= 0.65) return { min: 75000, max: 150000 };
  if (score <= 0.8) return { min: 150000, max: 300000 };
  return { min: 300000, max: 500000 };
}

function getConfidence(score: number, variance: number): Confidence {
  if (variance > 0.3) return 'Experimental';
  if (variance > 0.15) return 'Medium';
  return 'High';
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

  if (expenseRatio > 0.6) {
    suggestions.push('Consider reducing monthly obligations to improve loan eligibility');
  }
  if (savingHabit < 0.4) {
    suggestions.push('Build a stronger savings buffer to demonstrate financial discipline');
  }
  if (borrowingHistory === 'no-history') {
    suggestions.push('Consider starting with a small credit product to build borrowing history');
  }
  if (borrowingHistory === 'limited') {
    suggestions.push('Review past credit accounts and address any outstanding issues');
  }
  if (score < 0.4) {
    suggestions.push('Focus on stable income and reduced expenses before applying for larger loans');
  }
  if (score >= 0.5 && suggestions.length === 0) {
    suggestions.push('Maintain current financial habits to preserve prequalification strength');
  }

  // Ensure at least one suggestion
  if (suggestions.length === 0) {
    suggestions.push('Continue building a stable financial profile for best loan outcomes');
  }

  return suggestions;
}

export function calculateScore(inputs: ScoringInputs): ScoringResult {
  const {
    income_stability,
    income_amount,
    expense_ratio,
    saving_habit,
    employment_type,
    borrowing_history,
  } = inputs;

  // Normalize income_amount to a 0-1 scale (assuming $1K-$20K range)
  // Income at $20K+ gets 1.0, at $1K gets ~0
  const normalizedIncome = Math.min(Math.max((income_amount - 1000) / 19000, 0), 1);

  // Base score from income and expense ratio
  // Higher income = higher base. Lower expense ratio = better
  const incomeComponent = normalizedIncome * 0.4;
  const expenseComponent = (1 - expense_ratio) * 0.3;
  const baseScore = incomeComponent + expenseComponent;

  // Apply multipliers
  const stabilityMultiplier = 0.5 + (income_stability * 0.5); // 0.5 to 1.0
  const employmentMultiplier = getEmploymentMultiplier(employment_type);
  const savingMultiplier = 0.5 + (saving_habit * 0.5); // 0.5 to 1.0
  const borrowingMultiplier = getBorrowingMultiplier(borrowing_history);

  // Calculate final score
  const weightedSum =
    baseScore * 0.3 +
    stabilityMultiplier * 0.2 +
    employmentMultiplier * 0.2 +
    savingMultiplier * 0.15 +
    borrowingMultiplier * 0.15;

  // Clamp to 0-1 range
  const finalScore = Math.max(0, Math.min(1, weightedSum));

  // Calculate variance for confidence
  const variance = Math.abs(employmentMultiplier - 1) * 0.2 +
                  Math.abs(borrowingMultiplier - 1) * 0.15 +
                  Math.abs(expense_ratio - 0.5) * 0.1;

  const confidence = getConfidence(finalScore, variance);
  const loanRange = mapScoreToLoanRange(finalScore);
  const riskSummary = generateRiskSummary(finalScore, employment_type, expense_ratio, saving_habit);
  const suggestions = generateSuggestions(finalScore, expense_ratio, saving_habit, borrowing_history);

  return {
    loan_range: loanRange,
    confidence,
    risk_summary: riskSummary,
    suggestions,
  };
}