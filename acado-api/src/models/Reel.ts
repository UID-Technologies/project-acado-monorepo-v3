// src/models/Reel.ts
import { Schema, model } from 'mongoose';

export interface Reel {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  captionUrl?: string; // .srt file
  language: string;
  visibility: 'public' | 'organization' | 'private';
  status: 'draft' | 'active' | 'inactive';
  scheduledPublishAt?: Date;
  views: number;
  likes: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const ReelSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    duration: { type: Number, required: true, min: 0 },
    captionUrl: { type: String },
    language: { type: String, default: 'en' },
    visibility: { type: String, enum: ['public', 'organization', 'private'], default: 'public' },
    status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'draft' },
    scheduledPublishAt: { type: Date },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc: any, ret: any) {
        ret.id = ret._id.toString();
        if (ret.createdBy) {
          ret.createdBy = ret.createdBy.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc: any, ret: any) {
        ret.id = ret._id.toString();
        if (ret.createdBy) {
          ret.createdBy = ret.createdBy.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
ReelSchema.index({ status: 1, visibility: 1 });
ReelSchema.index({ category: 1 });
ReelSchema.index({ tags: 1 });
ReelSchema.index({ createdAt: -1 });
ReelSchema.index({ createdBy: 1 });
ReelSchema.index({ scheduledPublishAt: 1 });

export default model<Reel>('Reel', ReelSchema);

