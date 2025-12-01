// src/modules/category/category.model.ts
// Re-export from models to avoid duplicate model registration
import { Document } from 'mongoose';
import CategoryModel, { Category, Subcategory } from '../../models/Category.js';

export type { Category, Subcategory };
export type CategoryDocument = Document & Category;
export default CategoryModel;

