// src/services/category.service.ts
import Category from '../models/Category.js';
import Field from '../models/Field.js';
import { Types } from 'mongoose';

export async function listCategories(includeCount = false, search?: string) {
  const q: any = {};
  if (search) q.name = { $regex: search, $options: 'i' };
  const docs = await Category.find(q).sort({ order: 1, name: 1 });
  
  // Convert to JSON to apply transformation
  const categories = docs.map(doc => doc.toJSON());

  if (!includeCount) return categories;

  const counts = await Field.aggregate([
    { $group: { _id: '$categoryId', count: { $sum: 1 } } }
  ]);
  const countMap = new Map(counts.map(c => [String(c._id), c.count]));
  return categories.map(c => ({ ...c, fieldCount: countMap.get(String(c.id)) ?? 0 }));
}

export async function getCategoryById(categoryId: string) {
  const cat = await Category.findById(categoryId);
  if (!cat) throw new Error('CATEGORY_NOT_FOUND');
  return cat.toJSON();
}

export async function createCategory(payload: {name:string;icon:string;description?:string;order?:number;isCustom?:boolean}, createdBy?: Types.ObjectId) {
  const cat = await Category.create({ ...payload, createdBy });
  return cat.toJSON();
}

export async function updateCategory(categoryId: string, payload: any) {
  const updated = await Category.findByIdAndUpdate(categoryId, payload, { new: true, runValidators: true });
  if (!updated) throw new Error('CATEGORY_NOT_FOUND');
  return updated.toJSON();
}

export async function addSubcategory(categoryId: string, data: {name: string; description?: string; order?: number}) {
  const cat = await Category.findById(categoryId);
  if (!cat) throw new Error('CATEGORY_NOT_FOUND');
  const newSubcat = { 
    _id: new Types.ObjectId(), 
    name: data.name,
    description: data.description,
    order: data.order || (cat.subcategories.length + 1)
  };
  cat.subcategories.push(newSubcat as any);
  await cat.save();
  const saved = await Category.findById(categoryId);
  if (!saved) throw new Error('CATEGORY_NOT_FOUND');
  const savedJson = saved.toJSON();
  return savedJson.subcategories[savedJson.subcategories.length - 1];
}

export async function updateSubcategory(categoryId: string, subId: string, data: {name?: string; description?: string; order?: number}) {
  const cat = await Category.findById(categoryId);
  if (!cat) throw new Error('CATEGORY_NOT_FOUND');
  const subcat: any = (cat.subcategories as any).find((s: any) => String(s._id) === subId);
  if (!subcat) throw new Error('SUBCATEGORY_NOT_FOUND');
  
  if (data.name !== undefined) subcat.name = data.name;
  if (data.description !== undefined) subcat.description = data.description;
  if (data.order !== undefined) subcat.order = data.order;
  
  await cat.save();
  const saved = await Category.findById(categoryId);
  if (!saved) throw new Error('CATEGORY_NOT_FOUND');
  const savedJson = saved.toJSON();
  return savedJson.subcategories.find(s => s.id === subId);
}

export async function deleteSubcategory(categoryId: string, subId: string) {
  const cat = await Category.findById(categoryId);
  if (!cat) throw new Error('CATEGORY_NOT_FOUND');
  const before = cat.subcategories.length;
  (cat.subcategories as any) = (cat.subcategories as any).filter((s: any) => String(s._id) !== subId);
  if (cat.subcategories.length === before) throw new Error('SUBCATEGORY_NOT_FOUND');
  await cat.save();
  // Also unset subcategoryId on fields pointing to it
  await Field.updateMany({ categoryId, subcategoryId: subId }, { $unset: { subcategoryId: 1 } });
}

export async function deleteCategory(categoryId: string, cascade = false) {
  const cat = await Category.findByIdAndDelete(categoryId);
  if (!cat) throw new Error('CATEGORY_NOT_FOUND');
  const catId = (cat as any).id || cat._id.toString();
  if (cascade) await Field.deleteMany({ categoryId: catId });
  else await Field.updateMany({ categoryId: catId }, { $unset: { categoryId: 1, subcategoryId: 1 } });
}
