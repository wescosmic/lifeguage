import { NextRequest, NextResponse } from 'next/server';
import { calculateScore, ScoringInputs, LoanPurposeType } from '@/lib/scoring-engine';

const VALID_EMPLOYMENT = ['salaried', 'self-employed', 'freelance', 'informal'];
const VALID_BORROWING = ['excellent', 'good', 'limited', 'no-history'];
const VALID_PURPOSES: LoanPurposeType[] = ['home', 'car', 'education', 'vacation', 'business', 'other'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { income_stability, income_amount, expense_ratio, saving_habit, employment_type, borrowing_history } = body;

    // Required core fields
    if ([income_stability, income_amount, expense_ratio, saving_habit].some(v => v === undefined)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Clamp and validate
    const clampedInputs: ScoringInputs = {
      income_stability: Math.max(0, Math.min(1, Number(income_stability))),
      income_amount: Math.max(0, Number(income_amount)),
      expense_ratio: Math.max(0, Math.min(1, Number(expense_ratio))),
      saving_habit: Math.max(0, Math.min(1, Number(saving_habit))),
      employment_type: VALID_EMPLOYMENT.includes(body.employment_type) ? body.employment_type : 'salaried',
      borrowing_history: VALID_BORROWING.includes(body.borrowing_history) ? body.borrowing_history : 'no-history',
      loan_purpose: VALID_PURPOSES.includes(body.loan_purpose) ? body.loan_purpose : undefined,
      dependents: Number(body.dependents) || 0,
      has_existing_loans: Boolean(body.has_existing_loans),
      financial_behaviour_score: body.financial_behaviour_score !== undefined ? Math.max(0, Math.min(1, Number(body.financial_behaviour_score))) : 0.5,
    };

    const result = calculateScore(clampedInputs);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Score API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}