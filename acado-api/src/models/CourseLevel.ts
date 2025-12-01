// src/models/CourseLevel.ts
import { Schema, model, Model, Document } from 'mongoose';

export interface ICourseLevel {
  name: string;
  shortName: string;
  description?: string;
  keywords?: string;
  isActive: boolean;
}

export type CourseLevelDocument = Document<unknown, {}, ICourseLevel> & ICourseLevel;
export type CourseLevelModel = Model<ICourseLevel>;

const CourseLevelSchema = new Schema<ICourseLevel, CourseLevelModel>(
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

CourseLevelSchema.index({ name: 1 }, { unique: false });
CourseLevelSchema.index({ isActive: 1 });

export default model<ICourseLevel, CourseLevelModel>('CourseLevel', CourseLevelSchema);


