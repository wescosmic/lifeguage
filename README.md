# Lifeguage

**AI-powered dual-entry loan prequalification**

Lifeguage helps users discover their loan eligibility through two seamless channels: a conversational WhatsApp chatbot and an intuitive web-based wizard. Both interfaces feed into a shared AI scoring engine that provides instant, actionable prequalification insights.

## 🎯 Overview

- **WhatsApp Chatbot**: Conversational AI flow via Twilio WhatsApp Business API
- **Web Wizard**: 5-step guided form with visual sliders and real-time results
- **Shared Scoring Engine**: Deterministic algorithm calculating loan ranges, confidence levels, risk summaries, and improvement suggestions

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database | MongoDB (Mongoose ODM) |
| WhatsApp | Twilio WhatsApp Business API |
| Scoring | Custom deterministic engine |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Twilio account with WhatsApp Business sandbox

### Installation

```bash
# Clone and navigate
cd lifeguage

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/lifeguage

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📱 WhatsApp Flow

The chatbot guides users through these states:

```
START → NAME → AGE → EMPLOYMENT → INCOME → ADDITIONAL_INCOME → 
EXPENSES → SAVINGS → LOAN_PURPOSE → RESULT
```

| Step | User Input | Bot Asks |
|------|-----------|----------|
| START | (any) | Name |
| NAME | Alice | Age range buttons |
| AGE | 26-35 | Employment type buttons |
| EMPLOYMENT | Salaried | Monthly income buttons |
| INCOME | $5-10K | Additional income (Yes/No) |
| ADDITIONAL | No | Expense level buttons |
| EXPENSES | Medium | Saving habit (1-5) |
| SAVINGS | 4 | Previously borrowed? |
| LOAN_PURPOSE | Yes | Loan purpose buttons |
| RESULT | — | Shows loan range, confidence, summary |

Results include:
- Estimated loan range ($5K - $500K)
- Confidence level (High/Medium/Experimental)
- Risk summary
- Personalized suggestions

## 🌐 Web Wizard

5-step progressive form:

1. **Profile**: Name, age range, employment type
2. **Income**: Monthly income slider ($1K-$20K), frequency, additional sources
3. **Expenses**: Monthly obligations slider ($0-$10K), dependents, existing loans
4. **Behavior**: Saving habit (1-5), borrowing history, loan purpose
5. **Results**: Loan range, confidence, risk summary, suggestions

Features:
- Visual progress bar
- Range sliders with live value display
- Step validation before advancing
- API call to `/api/score` for results

## 🔌 API Endpoints

### POST `/api/score`

Calculate prequalification score.

**Request:**
```json
{
  "income_stability": 0.7,
  "income_amount": 7500,
  "expense_ratio": 0.4,
  "saving_habit": 0.6,
  "employment_type": "salaried",
  "borrowing_history": "good"
}
```

**Response:**
```json
{
  "loan_range": { "min": 75000, "max": 150000 },
  "confidence": "High",
  "risk_summary": "Strong prequalification profile...",
  "suggestions": ["Maintain current financial habits..."]
}
```

### POST `/api/whatsapp`

Twilio webhook for WhatsApp messages. Returns TwiML XML responses.

### GET `/api/whatsapp`

Health check endpoint.

## 📁 Project Structure

```
lifeguage/
├── lib/
│   ├── mongodb.ts         # Mongoose connection singleton
│   ├── models.ts          # User, Session, PrequalificationResult schemas
│   └── scoring-engine.ts  # Core scoring algorithm
├── src/app/
│   ├── page.tsx           # Landing page with dual CTA
│   ├── wizard/
│   │   └── page.tsx       # 5-step wizard form
│   └── api/
│       ├── score/
│       │   └── route.ts  # Scoring API endpoint
│       └── whatsapp/
│           └── route.ts  # Twilio webhook
├── .env.local             # Environment variables
└── README.md
```

## 🔒 Data Models

### User
- `phone`: Unique identifier for WhatsApp
- `name`: User's name
- `created_at`: Timestamp

### Session
- `user_id`: Reference to User
- `channel`: "whatsapp" | "web"
- `step`: Current conversation/wizard step
- `data`: JSON object with collected inputs
- `created_at`: Timestamp

### PrequalificationResult
- `session_id`: Reference to Session
- `inputs`: Scoring inputs used
- `outputs`: Generated results
- `created_at`: Timestamp

## 🎨 Design

- Mobile-first responsive design
- Clean, professional aesthetic
- Trust signals in footer (secure data, no credit impact, instant results)
- Two prominent entry points on landing page

## 📄 License

MIT