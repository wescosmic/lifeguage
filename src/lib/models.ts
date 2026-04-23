import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  name: string;
  created_at: Date;
}

const UserSchema = new Schema<IUser>({
  phone: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
});

export interface ISession extends Document {
  user_id: mongoose.Types.ObjectId;
  channel: 'whatsapp' | 'web';
  step: string;
  data: Record<string, unknown>;
  created_at: Date;
}

const SessionSchema = new Schema<ISession>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: String, enum: ['whatsapp', 'web'], required: true },
  step: { type: String, default: 'START' },
  data: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now },
});

export interface IPrequalificationResult extends Document {
  session_id: mongoose.Types.ObjectId;
  inputs: {
    income_stability: number;
    income_amount: number;
    expense_ratio: number;
    saving_habit: number;
    employment_type: string;
    borrowing_history: string;
  };
  outputs: {
    loan_range: { min: number; max: number };
    confidence: string;
    risk_summary: string;
    suggestions: string[];
  };
  created_at: Date;
}

const PrequalificationResultSchema = new Schema<IPrequalificationResult>({
  session_id: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  inputs: {
    income_stability: Number,
    income_amount: Number,
    expense_ratio: Number,
    saving_habit: Number,
    employment_type: String,
    borrowing_history: String,
  },
  outputs: {
    loan_range: {
      min: Number,
      max: Number,
    },
    confidence: String,
    risk_summary: String,
    suggestions: [String],
  },
  created_at: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
export const PrequalificationResult = mongoose.models.PrequalificationResult || mongoose.model<IPrequalificationResult>('PrequalificationResult', PrequalificationResultSchema);