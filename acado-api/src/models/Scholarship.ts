// src/models/Scholarship.ts
import { Schema, model, Types } from 'mongoose';

export type ScholarshipType = "merit" | "need_based" | "partial" | "full" | "fellowship" | "travel_grant";
export type ScholarshipStatus = "draft" | "active" | "inactive" | "completed" | "cancelled";
export type StudyLevel = "undergraduate" | "postgraduate" | "phd" | "short_course" | "any";
export type ApplicationMode = "online" | "offline";
export type StageType = "screening" | "assessment" | "interview" | "assignment";
export type ApplicantStatus = "applied" | "shortlisted" | "interviewed" | "selected" | "rejected";

export interface ScholarshipFormField {
  id: string;
  fieldType: "text" | "textarea" | "email" | "phone" | "file" | "url" | "dropdown";
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface ScholarshipStage {
  id: string;
  type: StageType;
  title: string;
  description?: string;
  order: number;
  deadline?: Date;
  weightage: number; // percentage
  autoScore: boolean;
  reviewers: string[]; // user IDs
  passScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Applicant {
  id: string;
  scholarshipId: string;
  userId: string;
  userName: string;
  userEmail: string;
  data: Record<string, any>; // form data
  attachments: {
    fieldId: string;
    fileName: string;
    fileUrl: string;
  }[];
  status: ApplicantStatus;
  score?: number;
  compositeScore?: number;
  stageScores?: Record<string, number>; // stageId -> score
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scholarship {
  id: string;
  
  // Basic Details
  categoryTags: string[];
  title: string;
  providerId: string;
  providerName: string;
  type: ScholarshipType;
  amount: number;
  currency: string;
  numberOfAwards: number;
  duration: string;
  studyLevel: StudyLevel;
  fieldsOfStudy: string[];
  
  // Dates
  applicationDeadline: Date;
  startDate?: Date;
  endDate?: Date;
  
  // Mode & Media
  mode: ApplicationMode;
  bannerUrl?: string;
  thumbnailUrl?: string;
  
  // Description
  shortDescription: string;
  description: string;
  
  // Application Form
  formFields: ScholarshipFormField[];
  applicationTemplateUrl?: string;
  
  // Selection Stages
  stages: ScholarshipStage[];
  
  // Evaluation
  evaluationRules?: {
    passScore: number;
    tieBreakRules?: string;
    seatAllocationLogic?: string;
  };
  
  // Status & Visibility
  status: ScholarshipStatus;
  visibility: "public" | "organization" | "private";
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  
  // Analytics
  views?: number;
  applications?: number;
  shortlisted?: number;
  awarded?: number;
}

const ScholarshipFormFieldSchema = new Schema(
  {
    fieldType: { type: String, enum: ['text', 'textarea', 'email', 'phone', 'file', 'url', 'dropdown'], required: true },
    label: { type: String, required: true, trim: true },
    required: { type: Boolean, default: false },
    placeholder: { type: String },
    options: [{ type: String }],
  },
  { _id: true }
);

const ScholarshipStageSchema = new Schema(
  {
    type: { type: String, enum: ['screening', 'assessment', 'interview', 'assignment'], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    order: { type: Number, required: true },
    deadline: { type: Date },
    weightage: { type: Number, required: true, min: 0, max: 100 },
    autoScore: { type: Boolean, default: false },
    reviewers: [{ type: String }],
    passScore: { type: Number },
  },
  { _id: true, timestamps: true }
);

const EvaluationRulesSchema = new Schema(
  {
    passScore: { type: Number, required: true },
    tieBreakRules: { type: String },
    seatAllocationLogic: { type: String },
  },
  { _id: false }
);

const ScholarshipSchema = new Schema(
  {
    categoryTags: [{ type: String }],
    title: { type: String, required: true, trim: true },
    providerId: { type: String, required: true },
    providerName: { type: String, required: true, trim: true },
    type: { type: String, enum: ['merit', 'need_based', 'partial', 'full', 'fellowship', 'travel_grant'], required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    numberOfAwards: { type: Number, required: true, min: 1 },
    duration: { type: String, required: true },
    studyLevel: { type: String, enum: ['undergraduate', 'postgraduate', 'phd', 'short_course', 'any'], required: true },
    fieldsOfStudy: [{ type: String }],
    
    applicationDeadline: { type: Date, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    
    mode: { type: String, enum: ['online', 'offline'], required: true },
    bannerUrl: { type: String },
    thumbnailUrl: { type: String },
    
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    
    formFields: [ScholarshipFormFieldSchema],
    applicationTemplateUrl: { type: String },
    
    stages: [ScholarshipStageSchema],
    
    evaluationRules: { type: EvaluationRulesSchema },
    
    status: { type: String, enum: ['draft', 'active', 'inactive', 'completed', 'cancelled'], default: 'draft' },
    visibility: { type: String, enum: ['public', 'organization', 'private'], default: 'public' },
    
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date },
    
    views: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    shortlisted: { type: Number, default: 0 },
    awarded: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc: any, ret: any) {
        ret.id = ret._id.toString();
        if (ret.createdBy) {
          ret.createdBy = ret.createdBy.toString();
        }
        if (ret.formFields && Array.isArray(ret.formFields)) {
          ret.formFields = ret.formFields.map((field: any) => ({
            ...field,
            id: field._id?.toString() || field.id,
          }));
        }
        if (ret.stages && Array.isArray(ret.stages)) {
          ret.stages = ret.stages.map((stage: any) => ({
            ...stage,
            id: stage._id?.toString() || stage.id,
            createdAt: stage.createdAt,
            updatedAt: stage.updatedAt,
          }));
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
        if (ret.createdBy) {
          ret.createdBy = ret.createdBy.toString();
        }
        if (ret.formFields && Array.isArray(ret.formFields)) {
          ret.formFields = ret.formFields.map((field: any) => ({
            ...field,
            id: field._id?.toString() || field.id,
          }));
        }
        if (ret.stages && Array.isArray(ret.stages)) {
          ret.stages = ret.stages.map((stage: any) => ({
            ...stage,
            id: stage._id?.toString() || stage.id,
            createdAt: stage.createdAt,
            updatedAt: stage.updatedAt,
          }));
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
ScholarshipSchema.index({ status: 1, visibility: 1 });
ScholarshipSchema.index({ type: 1 });
ScholarshipSchema.index({ studyLevel: 1 });
ScholarshipSchema.index({ applicationDeadline: 1 });
ScholarshipSchema.index({ createdBy: 1 });
ScholarshipSchema.index({ categoryTags: 1 });
ScholarshipSchema.index({ providerId: 1 });

export default model<Scholarship>('Scholarship', ScholarshipSchema);

