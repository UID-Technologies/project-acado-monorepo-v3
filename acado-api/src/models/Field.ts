// src/models/Field.ts
import { Schema, model, Types } from 'mongoose';

export type FieldType =
  | 'text' | 'email' | 'tel' | 'number' | 'date'
  | 'select' | 'multiselect' | 'textarea' | 'file' | 'checkbox' | 'radio' | 'country' | 'url';

export interface SelectOption {
  value: string;
  label: string;
}

export interface Field {
  id: string;
  name: string;           // machine name ("firstName")
  label: string;          // display label ("First Name")
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  isCustom?: boolean;
  categoryId: string;      // ref Category
  subcategoryId?: string;  // _id of embedded subcategory in Category
  options?: SelectOption[];     // for select/checkbox
  order?: number;
  validation?: any[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const FieldSchema = new Schema({
  name: { type: String, required: true, trim: true, index: true },
  label: { type: String, required: true, trim: true },
  type: { type: String, required: true },
  placeholder: { type: String },
  description: { type: String },
  required: { type: Boolean, default: false },
  isCustom: { type: Boolean, default: true },
  options: { type: Schema.Types.Mixed, default: [] },
  order: { type: Number, default: 1 },
  validation: { type: [Schema.Types.Mixed], default: [] },
  categoryId: { type: String, required: true, index: true },
  subcategoryId: { type: String },
  createdBy: { type: String }
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

// Remove the compound unique index since we're now using string IDs
FieldSchema.index({ name: 1, categoryId: 1 });

export default model<Field>('Field', FieldSchema);
