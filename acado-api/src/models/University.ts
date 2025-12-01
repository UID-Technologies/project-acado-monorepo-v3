// src/models/University.ts
import { Schema, model } from 'mongoose';

export interface Campus {
  name: string;
  location?: string;
  specializations: string[];
  facilities?: string[];
}

export interface EducationField {
  name: string;
  description?: string;
  programs: string[];
  degrees: string[];
}

export interface WhyReason {
  title: string;
  description: string;
  icon?: string;
}

export interface Ranking {
  organization: string;
  rank: number;
  year: number;
  category?: string;
}

export interface Accreditation {
  name: string;
  organization: string;
  validUntil?: Date;
}

export interface ApplicationDeadline {
  program: string;
  deadline: Date;
  term: 'Fall' | 'Spring' | 'Summer' | 'Winter';
  year: number;
}

export interface University {
  id: string;
  name: string;
  shortName?: string;
  institutionType: 'University' | 'COE' | 'Industry' | 'School';
  organizationId?: string | null;
  organizationName?: string | null;
  organizationLevel?: 'parent' | 'child' | 'branch';
  parentInstitutionId?: string | null;
  status?: 'Active' | 'Suspended';
  tagline?: string;
  foundedYear?: number;
  rating?: string;
  rank?: string;
  contact: {
    primaryEmail?: string;
    mobileNo?: string;
    website?: string;
  };
  address?: string;
  location: {
    city?: string;
    state?: string;
    country: string;
    campuses: Campus[];
  };
  branding: {
    logoUrl?: string;
    coverImageUrl?: string;
    templateImageUrl?: string;
    brochureUrl?: string;
  };
  about: {
    description?: string;
    mission?: string;
    values: string[];
    highlights: string[];
  };
  factsAndFigures: {
    totalStudents: number;
    internationalStudents: number;
    staffMembers: number;
    alumniCount: number;
    internationalPartnerships: number;
    partnerCountries: number;
    graduateEmployability: number;
    annualGraduates: number;
    researchBudget?: number;
  };
  community: {
    description?: string;
    studentCount: number;
    facultyCount: number;
    alumniInCountries: number;
    activeProjects: number;
  };
  fieldsOfEducation: EducationField[];
  socialResponsibility: {
    description?: string;
    commitments: string[];
    initiatives: string[];
  };
  rankings: Ranking[];
  accreditations: Accreditation[];
  admissionInfo?: {
    applicationDeadlines: ApplicationDeadline[];
    requirements: string[];
    process: string[];
    internationalRequirements?: string[];
  };
  whyChooseUs?: {
    reasons: WhyReason[];
  };
  whyThisUniversity?: string;
  admission?: string;
  placements?: string;
  faq?: string;
  testimonials: string[];
  tags: {
    isVerified: boolean;
  };
  isActive: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CampusSchema = new Schema<Campus>({
  name: { type: String, required: true },
  location: { type: String, default: '' },
  specializations: { type: [String], default: [] },
  facilities: { type: [String], default: [] }
}, { _id: false });

const EducationFieldSchema = new Schema<EducationField>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  programs: { type: [String], default: [] },
  degrees: { type: [String], default: [] }
}, { _id: false });

const WhyReasonSchema = new Schema<WhyReason>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String }
}, { _id: false });

const RankingSchema = new Schema<Ranking>({
  organization: { type: String, required: true },
  rank: { type: Number, required: true },
  year: { type: Number, required: true },
  category: { type: String }
}, { _id: false });

const AccreditationSchema = new Schema<Accreditation>({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  validUntil: { type: Date }
}, { _id: false });

const ApplicationDeadlineSchema = new Schema<ApplicationDeadline>({
  program: { type: String, required: true },
  deadline: { type: Date, required: true },
  term: { type: String, enum: ['Fall', 'Spring', 'Summer', 'Winter'], required: true },
  year: { type: Number, required: true }
}, { _id: false });

const UniversitySchema = new Schema({
  name: { type: String, required: true, trim: true },
  shortName: { type: String, trim: true },
  institutionType: { type: String, enum: ['University', 'COE', 'Industry', 'School'], required: true },
  organizationLevel: { type: String, enum: ['parent', 'child', 'branch'], default: 'parent' },
  parentInstitutionId: { type: Schema.Types.ObjectId, ref: 'University', default: null },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
  organizationName: { type: String, trim: true },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  tagline: { type: String },
  foundedYear: { type: Number },
  rating: { type: String },
  rank: { type: String },
  contact: {
    primaryEmail: { type: String, lowercase: true, trim: true },
    mobileNo: { type: String },
    website: { type: String }
  },
  address: { type: String },
  location: {
    city: { type: String },
    state: { type: String },
    country: { type: String, required: true },
    campuses: { type: [CampusSchema], default: [] }
  },
  branding: {
    logoUrl: { type: String },
    coverImageUrl: { type: String },
    templateImageUrl: { type: String },
    brochureUrl: { type: String }
  },
  about: {
    description: { type: String, default: '' },
    mission: { type: String, default: '' },
    values: { type: [String], default: [] },
    highlights: { type: [String], default: [] }
  },
  factsAndFigures: {
    totalStudents: { type: Number, default: 0 },
    internationalStudents: { type: Number, default: 0 },
    staffMembers: { type: Number, default: 0 },
    alumniCount: { type: Number, default: 0 },
    internationalPartnerships: { type: Number, default: 0 },
    partnerCountries: { type: Number, default: 0 },
    graduateEmployability: { type: Number, default: 0 },
    annualGraduates: { type: Number, default: 0 },
    researchBudget: { type: Number }
  },
  community: {
    description: { type: String, default: '' },
    studentCount: { type: Number, default: 0 },
    facultyCount: { type: Number, default: 0 },
    alumniInCountries: { type: Number, default: 0 },
    activeProjects: { type: Number, default: 0 }
  },
  fieldsOfEducation: { type: [EducationFieldSchema], default: [] },
  socialResponsibility: {
    description: { type: String, default: '' },
    commitments: { type: [String], default: [] },
    initiatives: { type: [String], default: [] }
  },
  rankings: { type: [RankingSchema], default: [] },
  accreditations: { type: [AccreditationSchema], default: [] },
  admissionInfo: {
    applicationDeadlines: { type: [ApplicationDeadlineSchema], default: [] },
    requirements: { type: [String], default: [] },
    process: { type: [String], default: [] },
    internationalRequirements: { type: [String], default: [] }
  },
  whyChooseUs: {
    reasons: { type: [WhyReasonSchema], default: [] }
  },
  whyThisUniversity: { type: String },
  admission: { type: String },
  placements: { type: String },
  faq: { type: String },
  testimonials: { type: [String], default: [] },
  tags: {
    isVerified: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (_doc: any, ret: any) {
      ret.id = ret._id.toString();
      if (ret.organizationId) {
        ret.organizationId = ret.organizationId.toString();
      }
      if (ret.parentInstitutionId) {
        ret.parentInstitutionId = ret.parentInstitutionId.toString();
      }
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function (_doc: any, ret: any) {
      ret.id = ret._id.toString();
      if (ret.organizationId) {
        ret.organizationId = ret.organizationId.toString();
      }
      if (ret.parentInstitutionId) {
        ret.parentInstitutionId = ret.parentInstitutionId.toString();
      }
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

UniversitySchema.index({ name: 1 });
UniversitySchema.index({ institutionType: 1 });
UniversitySchema.index({ 'location.country': 1 });
UniversitySchema.index({ isActive: 1 });
UniversitySchema.index({ organizationLevel: 1 });
UniversitySchema.index({ parentInstitutionId: 1 });
UniversitySchema.index({ organizationId: 1 });

export default model<University>('University', UniversitySchema);

