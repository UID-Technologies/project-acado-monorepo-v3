// src/models/CourseCategory.ts
import { Schema, model, Model, Document, Types } from 'mongoose';

export interface ICourseCategory {
  name: string;
  shortName: string;
  code?: string;
  parentId?: Types.ObjectId | null;
  description?: string;
  keywords?: string;
  isActive: boolean;
}

export type CourseCategoryDocument = Document<unknown, {}, ICourseCategory> & ICourseCategory;
export type CourseCategoryModel = Model<ICourseCategory>;

const CourseCategorySchema = new Schema<ICourseCategory, CourseCategoryModel>(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'CourseCategory', default: null },
    description: { type: String, trim: true },
    keywords: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const obj: any = ret;
        obj.id = obj._id?.toString();
        obj.parentId = obj.parentId ? obj.parentId.toString() : null;
        delete obj._id;
        delete obj.__v;
        return obj;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        const obj: any = ret;
        obj.id = obj._id?.toString();
        obj.parentId = obj.parentId ? obj.parentId.toString() : null;
        delete obj._id;
        delete obj.__v;
        return obj;
      },
    },
  }
);

CourseCategorySchema.index({ name: 1 }, { unique: false });
CourseCategorySchema.index({ parentId: 1 });
CourseCategorySchema.index({ isActive: 1 });

export default model<ICourseCategory, CourseCategoryModel>('CourseCategory', CourseCategorySchema);


