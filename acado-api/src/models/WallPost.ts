// src/models/WallPost.ts
import { Schema, model } from 'mongoose';

export interface WallPost {
  id: string;
  description: string;
  media?: string;
  mediaType?: 'image' | 'video';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const WallPostSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    media: { type: String },
    mediaType: { type: String, enum: ['image', 'video'] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
WallPostSchema.index({ createdBy: 1 });
WallPostSchema.index({ createdAt: -1 });

export default model<WallPost>('WallPost', WallPostSchema);

