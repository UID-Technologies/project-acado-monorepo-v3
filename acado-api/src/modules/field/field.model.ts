// src/modules/field/field.model.ts
// Re-export from models to avoid duplicate model registration
import { Document } from 'mongoose';
import FieldModel, { Field, FieldType, SelectOption } from '../../models/Field.js';

export type { Field, FieldType, SelectOption };
export type FieldDocument = Document & Field;
export default FieldModel;

