import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User, Session } from '@/lib/models';
import { calculateScore } from '@/lib/scoring-engine';

type WhatsAppState =
  | 'START'
  | 'NAME'
  | 'AGE'
  | 'EMPLOYMENT'
  | 'INCOME'
  | 'ADDITIONAL_INCOME'
  | 'EXPENSES'
  | 'SAVINGS'
  | 'LOAN_PURPOSE'
  | 'RESULT';

function xmlResponse(message: string): NextResponse {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${message}</Message>
</Response>`;
  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  });
}

function quickReplyButtons(labels: string[]): string {
  return labels.join(', ');
}

async function getOrCreateUser(phone: string): Promise<InstanceType<typeof User>> {
  let user = await User.findOne({ phone });
  if (!user) {
    user = new User({ phone, name: '' });
    await user.save();
  }
  return user;
}

async function getOrCreateSession(userId: string, channel: 'whatsapp' | 'web'): Promise<InstanceType<typeof Session>> {
  let session = await Session.findOne({ user_id: userId, channel }).sort({ created_at: -1 });
  if (!session || session.step === 'RESULT') {
    session = new Session({
      user_id: userId,
      channel,
      step: 'START',
      data: {},
    });
    await session.save();
  }
  return session;
}

async function updateSession(session: InstanceType<typeof Session>, step: WhatsAppState, data: Record<string, unknown>): Promise<void> {
  session.step = step;
  session.data = { ...session.data, ...data };
  await session.save();
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

function mapIncomeToNumber(income: string): number {
  switch (income) {
    case 'Under $2K': return 1500;
    case '$2-5K': return 3500;
    case '$5-10K': return 7500;
    case '$10K+': return 15000;
    default: return 3000;
  }
}

function mapExpensesToNumber(expenses: string): number {
  switch (expenses) {
    case 'Low': return 0.2;
    case 'Medium': return 0.5;
    case 'High': return 0.75;
    case 'Very High': return 0.9;
    default: return 0.5;
  }
}

export async function GET(): Promise<NextResponse> {
  return xmlResponse('Lifeguage WhatsApp endpoint is active. Send a message to start!');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;

    if (!from) {
      return xmlResponse('Error: Could not identify sender.');
    }

    await connectDB();

    const user = await getOrCreateUser(from.replace('whatsapp:', ''));
    const session = await getOrCreateSession(user._id.toString(), 'whatsapp');

    const incomingMessage = (body || '').trim();
    const currentStep = session.step as WhatsAppState;

    // Handle state machine transitions
    switch (currentStep) {
      case 'START':
        await updateSession(session, 'NAME', {});
        return xmlResponse(
          `Welcome to Lifeguage! 🏦\n\n` +
          `I'm your AI loan prequalification assistant. I'll help you discover your loan eligibility in minutes.\n\n` +
          `Let's get started — what's your name?`
        );

      case 'NAME': {
        const name = incomingMessage;
        await updateSession(session, 'AGE', { name });
        const ageOptions = ['18-25', '26-35', '36-50', '51-65', '65+'];
        return xmlResponse(
          `Great to meet you, ${name}! 👋\n\n` +
          `What age range do you fall into?\n\n` +
          `Quick reply: ${quickReplyButtons(ageOptions)}`
        );
      }

      case 'AGE': {
        const ageValid = ['18-25', '26-35', '36-50', '51-65', '65+'].includes(incomingMessage);
        if (!ageValid) {
          return xmlResponse(`Please select one of the options: ${quickReplyButtons(['18-25', '26-35', '36-50', '51-65', '65+'])}`);
        }
        const incomeStability = mapAgeToStability(incomingMessage);
        await updateSession(session, 'EMPLOYMENT', { age: incomingMessage, income_stability: incomeStability });
        const employmentOptions = ['Salaried', 'Self-employed', 'Freelance', 'Informal'];
        return xmlResponse(
          `Got it! 📅\n\n` +
          `What's your employment type?\n\n` +
          `Quick reply: ${quickReplyButtons(employmentOptions)}`
        );
      }

      case 'EMPLOYMENT': {
        const employmentTypes = ['salaried', 'self-employed', 'freelance', 'informal'];
        const employmentNormalized = incomingMessage.toLowerCase().replace('-', ' ');
        const matchedEmployment = employmentTypes.find(e => e === employmentNormalized || e === incomingMessage.toLowerCase());
        if (!matchedEmployment) {
          return xmlResponse(`Please select one of the options: ${quickReplyButtons(['Salaried', 'Self-employed', 'Freelance', 'Informal'])}`);
        }
        await updateSession(session, 'INCOME', { employment_type: matchedEmployment });
        const incomeButtons = ['Under $2K', '$2-5K', '$5-10K', '$10K+'];
        return xmlResponse(
          `Noted! 💼\n\n` +
          `What's your monthly income range?\n\n` +
          `Quick reply: ${quickReplyButtons(incomeButtons)}`
        );
      }

      case 'INCOME': {
        const incomeOptionsList = ['Under $2K', '$2-5K', '$5-10K', '$10K+'];
        if (!incomeOptionsList.includes(incomingMessage)) {
          return xmlResponse(`Please select one of the options: ${quickReplyButtons(incomeOptionsList)}`);
        }
        const incomeAmount = mapIncomeToNumber(incomingMessage);
        await updateSession(session, 'ADDITIONAL_INCOME', { income_amount: incomeAmount });
        return xmlResponse(
          `Thanks! 💰\n\n` +
          `Do you have any additional income sources? (e.g., rental income, investments, part-time work)\n\n` +
          `Reply: Yes or No`
        );
      }

      case 'ADDITIONAL_INCOME': {
        const hasAdditionalIncome = incomingMessage.toLowerCase().startsWith('y');
        if (hasAdditionalIncome) {
          await updateSession(session, 'ADDITIONAL_INCOME', { has_additional_income: true });
          return xmlResponse(
            `Great! What's the approximate monthly amount from additional sources?\n\n` +
            `Reply with a number (e.g., 500, 1200)`
          );
        } else {
          await updateSession(session, 'EXPENSES', { has_additional_income: false, additional_income_amount: 0 });
          const expenseButtons = ['Low', 'Medium', 'High', 'Very High'];
          return xmlResponse(
            `Understood. 🧾\n\n` +
            `How would you describe your monthly obligations (rent, utilities, existing loan payments)?\n\n` +
            `Quick reply: ${quickReplyButtons(expenseButtons)}`
          );
        }
      }

      case 'EXPENSES': {
        const expenseOptionsList = ['Low', 'Medium', 'High', 'Very High'];
        if (!expenseOptionsList.includes(incomingMessage)) {
          return xmlResponse(`Please select one of the options: ${quickReplyButtons(expenseOptionsList)}`);
        }
        const expenseRatio = mapExpensesToNumber(incomingMessage);
        await updateSession(session, 'SAVINGS', { expense_ratio: expenseRatio });
        return xmlResponse(
          `Got it! 📊\n\n` +
          `On a scale of 1-5, how would you rate your saving habit?\n\n` +
          `1 = Almost no savings, 5 = Excellent savings discipline\n\n` +
          `Reply with a number 1-5`
        );
      }

      case 'SAVINGS': {
        const savingNum = parseInt(incomingMessage);
        if (isNaN(savingNum) || savingNum < 1 || savingNum > 5) {
          return xmlResponse(`Please reply with a number between 1 and 5`);
        }
        const savingHabit = savingNum / 5;
        await updateSession(session, 'LOAN_PURPOSE', { saving_habit: savingHabit });
        return xmlResponse(
          `Thanks for sharing! 💡\n\n` +
          `Have you previously borrowed (loans, credit cards, etc.)?\n\n` +
          `Reply: Yes or No`
        );
      }

      case 'LOAN_PURPOSE': {
        if (!session.data.borrowing_history) {
          const hasBorrowing = incomingMessage.toLowerCase().startsWith('y');
          const borrowingHistory = hasBorrowing ? 'limited' : 'no-history';
          await updateSession(session, 'LOAN_PURPOSE', { borrowing_history: borrowingHistory });
          const purposeButtons = ['Home', 'Education', 'Business', 'Emergency', 'Other'];
          return xmlResponse(
            `Thanks! 🏖️\n\n` +
            `What's the loan for?\n\n` +
            `Quick reply: ${quickReplyButtons(purposeButtons)}`
          );
        }

        // Loan purpose selection
        const purposes = ['home', 'education', 'business', 'emergency', 'other'];
        const matchedPurpose = purposes.find(p => incomingMessage.toLowerCase().includes(p));
        if (!matchedPurpose) {
          return xmlResponse(`Please select one of the options: ${quickReplyButtons(['Home', 'Education', 'Business', 'Emergency', 'Other'])}`);
        }

        await updateSession(session, 'RESULT', { loan_purpose: matchedPurpose });

        const data = session.data as {
          income_stability?: number;
          income_amount?: number;
          expense_ratio?: number;
          saving_habit?: number;
          employment_type?: string;
          borrowing_history?: string;
        };

        const result = calculateScore({
          income_stability: data.income_stability ?? 0.5,
          income_amount: data.income_amount ?? 3000,
          expense_ratio: data.expense_ratio ?? 0.5,
          saving_habit: data.saving_habit ?? 0.5,
          employment_type: (data.employment_type as 'salaried' | 'self-employed' | 'freelance' | 'informal') ?? 'salaried',
          borrowing_history: (data.borrowing_history as 'excellent' | 'good' | 'limited' | 'no-history') ?? 'no-history',
        });

        const suggestionsText = result.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n');

        return xmlResponse(
          `🎉 **Your Prequalification Results**\n\n` +
          `Loan Range: $${result.loan_range.min.toLocaleString()} - $${result.loan_range.max.toLocaleString()}\n` +
          `Confidence: ${result.confidence}\n\n` +
          `📋 Summary: ${result.risk_summary}\n\n` +
          `💡 Suggestions:\n${suggestionsText}\n\n` +
          `Would you like to explore these options further? Reply "Start Over" to begin again or "Web" to use our web wizard.`
        );
      }

      case 'RESULT':
        if (incomingMessage.toLowerCase().includes('start')) {
          await updateSession(session, 'START', {});
          return xmlResponse(
            `Let's start fresh! 🏦\n\n` +
            `I'm your AI loan prequalification assistant. What's your name?`
          );
        } else {
          return xmlResponse(
            `Your results are above! To start a new prequalification, reply "Start Over".`
          );
        }

      default: {
        await updateSession(session, 'START', {});
        return xmlResponse('Something went wrong. Let\'s start over — what\'s your name?');
      }
    }
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return xmlResponse('An error occurred. Please try again later.');
  }
}