// src/models/Form.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
  value?: any;
  message?: string;
}

export interface ConfiguredField {
  fieldId: string; // Reference to master field
  name: string;
  label: string;
  customLabel?: string;
  type: string;
  placeholder?: string;
  required: boolean;
  isVisible: boolean;
  isRequired: boolean;
  categoryId: string;
  subcategoryId?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
  description?: string;
  order: number;
}

export interface CustomCategoryName {
  name: string;
  subcategories?: Record<string, string>;
}

export interface Form {
  id: string;
  name: string;
  title: string;
  description?: string;
  organizationId?: string;
  organizationName?: string;
  universityId?: string;
  universityName?: string;
  courseIds?: string[];
  courseNames?: string[]; // Array of course names corresponding to courseIds
  fields: ConfiguredField[];
  customCategoryNames?: Record<string, CustomCategoryName>;
  status: 'draft' | 'published' | 'archived';
  isLaunched: boolean;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SelectOptionSchema = new Schema({
  value: { type: String, required: true },
  label: { type: String, required: true }
}, { _id: false });

const ValidationRuleSchema = new Schema({
  type: { type: String, enum: ['required', 'minLength', 'maxLength', 'pattern', 'min', 'max', 'email', 'url', 'custom'], required: true },
  value: { type: Schema.Types.Mixed },
  message: { type: String }
}, { _id: false });

const ConfiguredFieldSchema = new Schema({
  fieldId: { type: String }, // Optional reference to master field
  name: { type: String, required: true },
  label: { type: String, required: true },
  customLabel: { type: String },
  type: { type: String, required: true },
  placeholder: { type: String },
  required: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  isRequired: { type: Boolean, default: false },
  categoryId: { type: String, required: true },
  subcategoryId: { type: String },
  options: { type: [SelectOptionSchema], default: [] },
  validation: { type: [ValidationRuleSchema], default: [] },
  description: { type: String },
  order: { type: Number, default: 0 }
}, { _id: false });

const CustomCategoryNameSchema = new Schema({
  name: { type: String, required: true },
  subcategories: { type: Map, of: String }
}, { _id: false });

const FormSchema = new Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  organizationId: { type: String },
  organizationName: { type: String, trim: true },
  universityId: { type: String },
  universityName: { type: String, trim: true },
  courseIds: { type: [String], default: [] },
  courseNames: { type: [String], default: [] }, // Array of course names corresponding to courseIds
  fields: { type: [ConfiguredFieldSchema], default: [] },
  customCategoryNames: { type: Map, of: CustomCategoryNameSchema },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  isLaunched: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  createdBy: { type: String, required: false }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(_doc: any, ret: any) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
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

// Indexes for better query performance
FormSchema.index({ name: 1 });
FormSchema.index({ status: 1 });
FormSchema.index({ organizationId: 1 });
FormSchema.index({ universityId: 1 });
FormSchema.index({ isActive: 1 });
FormSchema.index({ createdBy: 1 });

export default model<Form>('Form', FormSchema);

