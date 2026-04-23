import { NextRequest, NextResponse } from 'next/server';
import { calculateScore, ScoringInputs } from '@/lib/scoring-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'income_stability',
      'income_amount',
      'expense_ratio',
      'saving_habit',
      'employment_type',
      'borrowing_history',
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate ranges
    const { income_stability, income_amount, expense_ratio, saving_habit } = body;

    if (
      typeof income_stability !== 'number' ||
      income_stability < 0 ||
      income_stability > 1
    ) {
      return NextResponse.json(
        { error: 'income_stability must be a number between 0 and 1' },
        { status: 400 }
      );
    }

    if (typeof income_amount !== 'number' || income_amount < 0) {
      return NextResponse.json(
        { error: 'income_amount must be a positive number' },
        { status: 400 }
      );
    }

    if (
      typeof expense_ratio !== 'number' ||
      expense_ratio < 0 ||
      expense_ratio > 1
    ) {
      return NextResponse.json(
        { error: 'expense_ratio must be a number between 0 and 1' },
        { status: 400 }
      );
    }

    if (typeof saving_habit !== 'number' || saving_habit < 0 || saving_habit > 1) {
      return NextResponse.json(
        { error: 'saving_habit must be a number between 0 and 1' },
        { status: 400 }
      );
    }

    const validEmploymentTypes = ['salaried', 'self-employed', 'freelance', 'informal'];
    if (!validEmploymentTypes.includes(body.employment_type)) {
      return NextResponse.json(
        { error: 'employment_type must be one of: salaried, self-employed, freelance, informal' },
        { status: 400 }
      );
    }

    const validBorrowingHistories = ['excellent', 'good', 'limited', 'no-history'];
    if (!validBorrowingHistories.includes(body.borrowing_history)) {
      return NextResponse.json(
        { error: 'borrowing_history must be one of: excellent, good, limited, no-history' },
        { status: 400 }
      );
    }

    const inputs: ScoringInputs = {
      income_stability,
      income_amount,
      expense_ratio,
      saving_habit,
      employment_type: body.employment_type,
      borrowing_history: body.borrowing_history,
    };

    const result = calculateScore(inputs);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Score API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}