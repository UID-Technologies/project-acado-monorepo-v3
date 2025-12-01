// src/models/LearningOutcome.ts
import { Schema, model, Model, Document, Types } from 'mongoose';

export interface ILearningOutcome {
  name: string;
  shortName: string;
  code?: string;
  parentId?: Types.ObjectId | null;
  description?: string;
  keywords?: string;
  isActive: boolean;
}

export type LearningOutcomeDocument = Document<unknown, {}, ILearningOutcome> & ILearningOutcome;
export type LearningOutcomeModel = Model<ILearningOutcome>;

const LearningOutcomeSchema = new Schema<ILearningOutcome, LearningOutcomeModel>(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'LearningOutcome', default: null },
    description: { type: String, trim: true },
    keywords: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const obj: any = ret;
        obj.id = obj._id?.toString();
        obj.parentId = obj.parentId ? obj.parentId.toString() : null;
        delete obj._id;
        delete obj.__v;
        return obj;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        const obj: any = ret;
        obj.id = obj._id?.toString();
        obj.parentId = obj.parentId ? obj.parentId.toString() : null;
        delete obj._id;
        delete obj.__v;
        return obj;
      },
    },
  }
);

LearningOutcomeSchema.index({ name: 1 }, { unique: false });
LearningOutcomeSchema.index({ parentId: 1 });
LearningOutcomeSchema.index({ isActive: 1 });

export default model<ILearningOutcome, LearningOutcomeModel>('LearningOutcome', LearningOutcomeSchema);


