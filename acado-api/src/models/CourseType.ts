// src/models/CourseType.ts
import { Schema, model, Model, Document } from 'mongoose';

export interface ICourseType {
  name: string;
  shortName: string;
  description?: string;
  keywords?: string;
  isActive: boolean;
}

export type CourseTypeDocument = Document<unknown, {}, ICourseType> & ICourseType;
export type CourseTypeModel = Model<ICourseType>;

const CourseTypeSchema = new Schema<ICourseType, CourseTypeModel>(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
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
        delete obj._id;
        delete obj.__v;
        return obj;
      },
    },
  }
);

CourseTypeSchema.index({ name: 1 }, { unique: false });
CourseTypeSchema.index({ isActive: 1 });

export default model<ICourseType, CourseTypeModel>('CourseType', CourseTypeSchema);


