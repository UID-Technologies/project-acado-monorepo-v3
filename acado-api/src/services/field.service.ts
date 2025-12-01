// src/services/field.service.ts
import Field from '../models/Field.js';
import Category from '../models/Category.js';

export async function searchFields(params: {
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const { search, categoryId, subcategoryId, page = 1, limit = 100, sort } = params;

  const q: any = {};
  if (search) q.$or = [
    { label: { $regex: search, $options: 'i' } },
    { name: { $regex: search, $options: 'i' } }
  ];
  if (categoryId) q.categoryId = categoryId;
  if (subcategoryId) q.subcategoryId = subcategoryId;

  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    Field.find(q).sort(sort || { order: 1, createdAt: -1 }).skip(skip).limit(limit),
    Field.countDocuments(q)
  ]);

  // Convert to JSON to apply transformation
  const items = docs.map(doc => doc.toJSON());

  return { items, page, limit, total, pages: Math.ceil(total / limit) };
}

export async function getFieldById(fieldId: string) {
  const field = await Field.findById(fieldId);
  if (!field) throw new Error('FIELD_NOT_FOUND');
  return field.toJSON();
}

export async function createField(payload: any) {
  // Validate category exists by looking up with string ID
  const cat = await Category.findById(payload.categoryId);
  if (!cat) throw new Error('CATEGORY_NOT_FOUND');

  // if subcategory provided, assert it exists inside category
  if (payload.subcategoryId) {
    const catDoc = cat.toJSON();
    const ok = catDoc.subcategories.some((s: any) => s.id === payload.subcategoryId);
    if (!ok) throw new Error('SUBCATEGORY_NOT_FOUND');
  }

  const field = await Field.create(payload);
  return field.toJSON();
}

export async function updateField(fieldId: string, payload: any) {
  const updated = await Field.findByIdAndUpdate(fieldId, payload, { new: true, runValidators: true });
  if (!updated) throw new Error('FIELD_NOT_FOUND');
  return updated.toJSON();
}

export async function deleteField(fieldId: string) {
  const deleted = await Field.findByIdAndDelete(fieldId);
  if (!deleted) throw new Error('FIELD_NOT_FOUND');
  return deleted;
}
