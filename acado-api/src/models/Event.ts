// src/models/Event.ts
import { Schema, model, Types } from 'mongoose';

export type EventMode = "online" | "offline" | "hybrid";
export type EventStatus = "draft" | "active" | "completed" | "cancelled";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type SubscriptionType = "free" | "paid";
export type StageType = "assessment" | "submission" | "video" | "notes" | "live_session";
export type StageStatus = "draft" | "ready";
export type EligibilityType = "everyone" | "students" | "professionals" | "custom";
export type RegistrationApproval = "auto" | "manual";

export interface EventStage {
  id: string;
  type: StageType;
  title: string;
  description?: string;
  order: number;
  status: StageStatus;
  resourceId?: string;
  duration?: number; // in minutes
  points?: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  // Basic Details
  logo?: string;
  title: string;
  categoryTags: string[];
  conductedBy: string;
  functionalDomain: string;
  jobRole: string;
  skills: string[];
  difficultyLevel: DifficultyLevel;
  subscriptionType: SubscriptionType;
  isPopular: boolean;
  
  // Description Blocks
  description: string;
  whatsInItForYou?: string;
  instructions?: string;
  faq?: string;
  
  // Schedule & Mode
  registrationStartDate: Date;
  registrationEndDate: Date;
  eventDate: Date;
  eventTime: string;
  mode: EventMode;
  venue?: string;
  
  // Other Details
  expertId?: string;
  expertName?: string;
  additionalInfo?: string;
  
  // Eligibility
  eligibility: {
    type: EligibilityType;
    colleges?: string[];
    organizations?: string[];
    genderRestriction?: "all" | "male" | "female" | "other";
  };
  
  // Registration Settings
  registrationSettings: {
    approval: RegistrationApproval;
    maxSeats?: number;
    enableWaitlist: boolean;
    cutoffLogic?: string;
    eventFee?: number;
  };
  
  // Stages
  stages: EventStage[];
  
  // Status & Metadata
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  createdBy: string;
  
  // Analytics
  registrations?: number;
  views?: number;
  completions?: number;
}

const EventStageSchema = new Schema(
  {
    type: { type: String, enum: ['assessment', 'submission', 'video', 'notes', 'live_session'], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    order: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'ready'], default: 'draft' },
    resourceId: { type: String },
    duration: { type: Number },
    points: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: true, timestamps: true }
);

const EligibilitySchema = new Schema(
  {
    type: { type: String, enum: ['everyone', 'students', 'professionals', 'custom'], required: true },
    colleges: [{ type: String }],
    organizations: [{ type: String }],
    genderRestriction: { type: String, enum: ['all', 'male', 'female', 'other'], default: 'all' },
  },
  { _id: false }
);

const RegistrationSettingsSchema = new Schema(
  {
    approval: { type: String, enum: ['auto', 'manual'], required: true },
    maxSeats: { type: Number },
    enableWaitlist: { type: Boolean, default: false },
    cutoffLogic: { type: String },
    eventFee: { type: Number },
  },
  { _id: false }
);

const EventSchema = new Schema(
  {
    logo: { type: String },
    title: { type: String, required: true, trim: true },
    categoryTags: [{ type: String }],
    conductedBy: { type: String, required: true, trim: true },
    functionalDomain: { type: String, required: true, trim: true },
    jobRole: { type: String, required: true, trim: true },
    skills: [{ type: String }],
    difficultyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    subscriptionType: { type: String, enum: ['free', 'paid'], required: true },
    isPopular: { type: Boolean, default: false },
    
    description: { type: String, required: true },
    whatsInItForYou: { type: String },
    instructions: { type: String },
    faq: { type: String },
    
    registrationStartDate: { type: Date, required: true },
    registrationEndDate: { type: Date, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    mode: { type: String, enum: ['online', 'offline', 'hybrid'], required: true },
    venue: { type: String },
    
    expertId: { type: String },
    expertName: { type: String },
    additionalInfo: { type: String },
    
    eligibility: { type: EligibilitySchema, required: true },
    registrationSettings: { type: RegistrationSettingsSchema, required: true },
    stages: [EventStageSchema],
    
    status: { type: String, enum: ['draft', 'active', 'completed', 'cancelled'], default: 'draft' },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    registrations: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
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
EventSchema.index({ status: 1 });
EventSchema.index({ mode: 1 });
EventSchema.index({ eventDate: 1 });
EventSchema.index({ registrationStartDate: 1 });
EventSchema.index({ registrationEndDate: 1 });
EventSchema.index({ createdBy: 1 });
EventSchema.index({ categoryTags: 1 });
EventSchema.index({ isPopular: 1, status: 1 });

export default model<Event>('Event', EventSchema);

