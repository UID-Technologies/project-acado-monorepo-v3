// src/models/Course.ts
import { Schema, model, Types } from 'mongoose';

export interface CourseCampaign {
  modeOfDelivery?: string;
  aboutCourse?: string;
  whatWillYouGet?: string;
  brochure?: string;
  eligibility?: string;
  fieldOfStudy?: string;
  duration?: string;
  noOfPeopleRated?: string;
  rating?: string;
  department?: string;
  tuitionFee?: string;
  credits?: string;
  maximumSeats?: string;
  availableSeats?: string;
  preRequisites?: string;
  classSlots?: string;
  language?: string;
  scholarship?: string;
  howToApply?: string;
  courseStructure?: string;
  learningOutcome?: string;
  partners?: string;
  collaboration?: string;
  careerOpportunities?: string;
  courseUSP?: string;
}

export interface Course {
  id: string;
  universityId: string;
  universityName?: string;
  name: string;
  shortName: string;
  courseCode?: string;
  type?: 'degree' | 'exchange' | 'pathway' | 'diploma' | 'certification';
  typeId?: string;
  level?: 'undergraduate' | 'postgraduate' | 'doctoral';
  levelId?: string;
  categoryId?: string;
  duration?: string;
  description?: string;
  keywords?: string;
  thumbnail?: string;
  bannerImage?: string;
  videoUrl?: string;
  requirements?: string;
  fee?: number;
  currency?: string;
  startDate?: Date;
  endDate?: Date;
  applicationDeadline?: Date;
  applicationFormId?: string;
  learningOutcomeIds?: string[];
  isActive: boolean;
  campaign?: CourseCampaign;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CourseCampaignSchema = new Schema(
  {
    modeOfDelivery: { type: String },
    aboutCourse: { type: String },
    whatWillYouGet: { type: String },
    brochure: { type: String },
    eligibility: { type: String },
    fieldOfStudy: { type: String },
    duration: { type: String },
    noOfPeopleRated: { type: String },
    rating: { type: String },
    department: { type: String },
    tuitionFee: { type: String },
    credits: { type: String },
    maximumSeats: { type: String },
    availableSeats: { type: String },
    preRequisites: { type: String },
    classSlots: { type: String },
    language: { type: String },
    scholarship: { type: String },
    howToApply: { type: String },
    courseStructure: { type: String },
    learningOutcome: { type: String },
    partners: { type: String },
    collaboration: { type: String },
    careerOpportunities: { type: String },
    courseUSP: { type: String },
  },
  { _id: false }
);

const CourseSchema = new Schema(
  {
    universityId: { type: Schema.Types.ObjectId, ref: 'University', required: true },
    name: { type: String, required: true, trim: true },
    universityName: { type: String },
    shortName: { type: String, required: true, trim: true },
    courseCode: { type: String, trim: true },
    type: {
      type: String,
      enum: ['degree', 'exchange', 'pathway', 'diploma', 'certification'],
    },
    typeId: { type: Schema.Types.ObjectId, ref: 'CourseType' },
    level: {
      type: String,
      enum: ['undergraduate', 'postgraduate', 'doctoral'],
    },
    levelId: { type: Schema.Types.ObjectId, ref: 'CourseLevel' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'CourseCategory' },
    duration: { type: String, trim: true },
    description: { type: String },
    keywords: { type: String, trim: true },
    thumbnail: { type: String },
    bannerImage: { type: String },
    videoUrl: { type: String },
    requirements: { type: String },
    fee: { type: Number },
    currency: { type: String, default: 'USD' },
    startDate: { type: Date },
    endDate: { type: Date },
    applicationDeadline: { type: Date },
    applicationFormId: { type: Schema.Types.ObjectId, ref: 'Form' },
    learningOutcomeIds: [{ type: Schema.Types.ObjectId, ref: 'LearningOutcome' }],
    isActive: { type: Boolean, default: true },
    campaign: { type: CourseCampaignSchema },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc: any, ret: any) {
        ret.id = ret._id.toString();
        ret.universityId = ret.universityId?.toString();
        if (ret.applicationFormId) {
          ret.applicationFormId = ret.applicationFormId.toString();
        }
        if (ret.categoryId) {
          ret.categoryId = ret.categoryId.toString();
        }
        if (ret.typeId) {
          ret.typeId = ret.typeId.toString();
        }
        if (ret.levelId) {
          ret.levelId = ret.levelId.toString();
        }
        if (Array.isArray(ret.learningOutcomeIds)) {
          ret.learningOutcomeIds = ret.learningOutcomeIds.map((id: Types.ObjectId | string) =>
            id?.toString()
          );
        }
        if (ret.createdBy) {
          ret.createdBy = ret.createdBy.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc: any, ret: any) {
        ret.id = ret._id.toString();
        ret.universityId = ret.universityId?.toString();
        if (ret.applicationFormId) {
          ret.applicationFormId = ret.applicationFormId.toString();
        }
        if (ret.categoryId) {
          ret.categoryId = ret.categoryId.toString();
        }
        if (ret.typeId) {
          ret.typeId = ret.typeId.toString();
        }
        if (ret.levelId) {
          ret.levelId = ret.levelId.toString();
        }
        if (Array.isArray(ret.learningOutcomeIds)) {
          ret.learningOutcomeIds = ret.learningOutcomeIds.map((id: Types.ObjectId | string) =>
            id?.toString()
          );
        }
        if (ret.createdBy) {
          ret.createdBy = ret.createdBy.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
CourseSchema.index({ universityId: 1 });
CourseSchema.index({ type: 1 });
CourseSchema.index({ level: 1 });
CourseSchema.index({ isActive: 1 });
CourseSchema.index({ categoryId: 1 });
CourseSchema.index({ typeId: 1 });
CourseSchema.index({ levelId: 1 });

export default model<Course>('Course', CourseSchema);

