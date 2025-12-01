// src/models/Application.ts
import { Schema, model, Types } from 'mongoose';

export interface Application {
  id: string;
  userId: string; // Reference to User
  universityId?: string; // Reference to University
  courseId?: string; // Reference to Course
  formId: string; // Reference to Form
  formData: Record<string, any>; // All submitted field values
  status: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn' | 'waitlisted';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  attachments?: {
    fieldName: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
  }[];
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    completionTime?: number; // Time taken to complete in seconds
  };
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AttachmentSchema = new Schema({
  fieldName: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const MetadataSchema = new Schema({
  ipAddress: { type: String },
  userAgent: { type: String },
  completionTime: { type: Number }
}, { _id: false });

const ApplicationSchema = new Schema({
  userId: { type: String, required: true, index: true },
  universityId: { type: String, index: true },
  courseId: { type: String, index: true },
  formId: { type: String, required: true, index: true },
  formData: { type: Schema.Types.Mixed, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn', 'waitlisted'],
    default: 'draft',
    index: true
  },
  submittedAt: { type: Date },
  reviewedAt: { type: Date },
  reviewedBy: { type: String },
  reviewNotes: { type: String },
  attachments: { type: [AttachmentSchema], default: [] },
  metadata: { type: MetadataSchema },
  createdBy: { type: String }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(_doc: any, ret: any) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(_doc: any, ret: any) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
ApplicationSchema.index({ userId: 1, status: 1 });
ApplicationSchema.index({ universityId: 1, courseId: 1 });
ApplicationSchema.index({ formId: 1, status: 1 });
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ submittedAt: -1 });

export default model<Application>('Application', ApplicationSchema);

