// src/models/PasswordReset.ts
import { Schema, model, Model, Document, Types } from 'mongoose';

export interface IPasswordReset {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  usedAt?: Date;
}

export type PasswordResetDocument = Document<unknown, {}, IPasswordReset> & IPasswordReset;
export type PasswordResetModel = Model<IPasswordReset>;

const PasswordResetSchema = new Schema<IPasswordReset, PasswordResetModel>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // Auto-delete expired documents
    },
    used: {
      type: Boolean,
      default: false,
      index: true,
    },
    usedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding valid tokens
PasswordResetSchema.index({ email: 1, token: 1, used: 1, expiresAt: 1 });

const PasswordReset = model<IPasswordReset, PasswordResetModel>('PasswordReset', PasswordResetSchema);

export default PasswordReset;

