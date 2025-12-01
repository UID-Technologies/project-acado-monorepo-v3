// src/models/Category.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  order?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // e.g., "User" | "Folder" etc. (lucide names)
  description?: string;
  order?: number;
  isCustom?: boolean; // UI uses this to show delete menu
  subcategories: Subcategory[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubcategoryDoc extends Document {
  name: string;
  description?: string;
  order?: number;
}

const SubcategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  order: { type: Number }
}, { 
  _id: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for subcategory id
SubcategorySchema.virtual('id').get(function(this: any) {
  return this._id.toHexString();
});

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, required: true, trim: true },
  description: { type: String },
  order: { type: Number, default: 1 },
  isCustom: { type: Boolean, default: true },
  subcategories: { type: [SubcategorySchema], default: [] },
  createdBy: { type: String }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(_doc: any, ret: any) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      // Add categoryId to each subcategory
      if (ret.subcategories && Array.isArray(ret.subcategories)) {
        ret.subcategories = ret.subcategories.map((sub: any) => ({
          id: sub.id || sub._id?.toString(),
          categoryId: ret.id,
          name: sub.name,
          description: sub.description,
          order: sub.order
        }));
      }
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(_doc: any, ret: any) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default model<Category>('Category', CategorySchema);
