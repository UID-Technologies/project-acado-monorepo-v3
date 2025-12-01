// src/models/CommunityPost.ts
import { Schema, model, Types } from 'mongoose';

export type ContentType = 'images' | 'notes' | 'videos';

export interface CommunityCategory {
  id: string;
  name: string;
  color?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityPost {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  categoryId: string;
  thumbnail?: string;
  media?: string;
  isPinned: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  translations?: {
    [language: string]: {
      title: string;
      description: string;
    };
  };
}

const CommunityCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    color: { type: String },
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
  }
);

const CommunityPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    contentType: { type: String, enum: ['images', 'notes', 'videos'], required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'CommunityCategory', required: true },
    thumbnail: { type: String },
    media: { type: String },
    isPinned: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    translations: {
      type: Map,
      of: {
        title: String,
        description: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc: any, ret: any) {
        ret.id = ret._id.toString();
        ret.categoryId = ret.categoryId?.toString();
        if (ret.createdBy) {
          ret.createdBy = ret.createdBy.toString();
        }
        if (ret.translations && ret.translations instanceof Map) {
          ret.translations = Object.fromEntries(ret.translations);
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
        ret.categoryId = ret.categoryId?.toString();
        if (ret.createdBy) {
          ret.createdBy = ret.createdBy.toString();
        }
        if (ret.translations && ret.translations instanceof Map) {
          ret.translations = Object.fromEntries(ret.translations);
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
CommunityCategorySchema.index({ name: 1 });
CommunityPostSchema.index({ categoryId: 1 });
CommunityPostSchema.index({ isPinned: -1, createdAt: -1 });
CommunityPostSchema.index({ contentType: 1 });
CommunityPostSchema.index({ createdBy: 1 });

export const CommunityCategoryModel = model<CommunityCategory>('CommunityCategory', CommunityCategorySchema);
export default model<CommunityPost>('CommunityPost', CommunityPostSchema);

