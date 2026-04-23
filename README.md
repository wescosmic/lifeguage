# Lifeguage

**AI-powered dual-entry loan prequalification for Trinidad & Tobago**

Lifeguage helps users discover their borrowing potential through two channels: a WhatsApp chatbot and an 8-step web wizard. Both feed a shared scoring engine that delivers a real pre-qualification score, matched loan products, and a curated network of local TT lenders — banks and credit unions — with direct WhatsApp links to start an actual loan conversation.

---

## 🎯 What It Does

- **8-Step Web Wizard** — Profile → Income → Expenses → Financial Behaviour → Borrowing History → Loan Purpose → Adaptive Questions (collateral, co-applicant, urgency) → Document Upload → Instant results
- **Scoring Engine** — Deterministic algorithm using income stability, expense ratio, employment type, saving habit, and borrowing history to produce a 0–100 pre-qualification score
- **6 Loan Products** — Home, Car, Education, Vacation, Business, Personal — each with a match score, rate range, approval odds, and top tips
- **Local TT Provider Network** — Real Trinidad & Tobago lenders (First Citizens, Republic Bank, JMMB, Sagicor, credit unions, and more) with rates, phone, website, and WhatsApp deep-link pre-filled with the user's score
- **Upsell: Boost My Score** — Personalised action plan + 6 TT side hustle business ideas to grow income (free)
- **Upsell: Pre-Approval Letter** — Printable PDF certificate with score, loan range, and product matches ($9.99)
- **Upsell: Free Document Review** — Simulated OCR analysis of payslip or bank statement (limited time offer)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database | MongoDB (Mongoose) |
| WhatsApp | Twilio WhatsApp Business API |
| Animation | Framer Motion |
| Scoring | Custom deterministic engine |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or MongoDB Atlas)
- Twilio account with WhatsApp Business sandbox

### Installation

```bash
git clone https://github.com/wescosmic/lifeguage.git
cd lifeguage
npm install
cp .env.local.example .env.local
# Fill in your MONGODB_URI, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
```

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/lifeguage
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or start the WhatsApp flow at `https://wa.me/14155238886`.

---

## 📂 Project Structure

```
lifeguage/
├── public/
│   └── logos/              # SVG logos for TT institutions
├── src/
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   ├── wizard/
│   │   │   └── page.tsx    # 8-step wizard
│   │   ├── results/
│   │   │   ├── page.tsx    # Results with product cards + upsells
│   │   │   ├── BoostScorePage.tsx  # Action plan + business ideas
│   │   │   ├── preapproval/
│   │   │   │   └── page.tsx         # Printable pre-approval letter
│   │   │   └── review/
│   │   │       └── page.tsx         # Free document review
│   │   └── api/
│   │       ├── score/
│   │       │   └── route.ts        # POST /api/score
│   │       └── whatsapp/
│   │           └── route.ts        # Twilio webhook
├── lib/
│   ├── mongodb.ts          # Mongoose singleton
│   ├── models.ts           # User, Session, PrequalificationResult schemas
│   └── scoring-engine.ts  # Core scoring algorithm + loan product builder
├── .env.local
└── README.md
```

---

## 🔌 API Endpoints

### `POST /api/score`

**Request:**
```json
{
  "income_stability": 0.7,
  "income_amount": 6500,
  "expense_ratio": 0.35,
  "saving_habit": 0.6,
  "employment_type": "salaried",
  "borrowing_history": "good",
  "loan_purpose": "home",
  "dependents": 1,
  "has_existing_loans": false,
  "financial_behaviour_score": 0.65
}
```

**Response:**
```json
{
  "overall_score": 72,
  "loan_range": { "min": 75000, "max": 150000 },
  "confidence": "High",
  "risk_summary": "Strong prequalification profile. Stable financial indicators.",
  "suggestions": ["Maintain current financial habits..."],
  "products": [
    {
      "id": "home", "name": "Home Loan", "icon": "🏠",
      "match_score": 92,
      "estimated_range": { "min": 80000, "max": 180000 },
      "rate_indicator": "6.5–9.5%",
      "approval_chances": "High",
      "mini_summary": "Strong equity potential and long-tenure financing.",
      "top_tips": ["Maintain 6 months of payments in savings", "Reduce other credit before applying"]
    }
  ],
  "behavioural_profile": {
    "label": "Financial Guardian",
    "tag": "Excellent",
    "description": "You demonstrate strong financial discipline..."
  }
}
```

### `POST /api/whatsapp`

Twilio webhook. Returns TwiML XML responses for the state machine flow.

---

## 🏦 TT Provider Network

Lifeguage includes a curated network of Trinidad & Tobago lenders across all loan types:

**Banks:** First Citizens Bank, Republic Bank, JMMB, Scotiabank TT, Caribbean Union Bank, Caribbean Development Bank

**Credit Unions:** People's Credit Union, Sagicor Credit Union, UtoStar CU, Teachers' CU, Police CU

**Government:** GATE Programme, Trinidad & Tobago Mortgage Finance

Each provider has a local SVG logo, real rate ranges, phone, website, and a pre-filled WhatsApp message including the user's score.

---

## 💰 Revenue Model

- **Lead Referral Fees** — Financial institutions pay per qualified lead that clicks through to WhatsApp. Estimated $5–$25 per lead.
- **Loan Origination Commission** — % of each loan originated through the platform (Phase 2).
- **SaaS White-Label** — Credit unions and smaller lenders pay a monthly fee for the wizard as their own portal (Phase 2).
- **Upsells** — Pre-Approval Letter $9.99, Document Review (free beta, paid Phase 2).
- **Market Intelligence** — Aggregated anonymised loan profile data sold quarterly to lenders.

---

## ⚠️ Disclaimer

Lifeguage provides indicative pre-qualification estimates only. It is not a lender and does not guarantee loan approval. All results are based on user-provided data and should be verified with the relevant financial institution. Lifeguage accepts no liability for decisions made based on estimates provided by the platform.

---

## 📄 License

MIT