// src/models/Organization.ts
import { Schema, model, type Document, type Model } from 'mongoose';

export type OrganizationType = 'University' | 'Corporate' | 'Non-Profit';
export type OnboardingStage = 'Profile Created' | 'Documents Submitted' | 'Approved' | 'Live';
export type SupportChannel = 'email' | 'slack' | 'whatsapp';

export interface OrganizationContact {
  name?: string;
  email?: string;
  phone?: string;
}

export interface OrganizationLocation {
  country?: string;
  state?: string;
  city?: string;
}

export interface OrganizationCommunications {
  onboardingEmails: string[];
  weeklyUpdates: boolean;
}

export interface OrganizationSupport {
  successManager?: string;
  supportChannel?: SupportChannel;
  supportNotes?: string;
}

export interface Organization {
  id: string;
  name: string;
  shortName?: string;
  type: OrganizationType;
  onboardingStage: OnboardingStage;
  description?: string;
  contacts?: {
    primary?: OrganizationContact;
    secondary?: OrganizationContact;
  };
  location?: OrganizationLocation;
  website?: string;
  logoUrl?: string;
  communications?: OrganizationCommunications;
  support?: OrganizationSupport;
  suspended: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrganizationDocument = Document<unknown, any, Organization> & Organization;
export type OrganizationModel = Model<OrganizationDocument>;

const ContactSchema = new Schema<OrganizationContact>(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true }
  },
  { _id: false }
);

const LocationSchema = new Schema<OrganizationLocation>(
  {
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true }
  },
  { _id: false }
);

const CommunicationsSchema = new Schema<OrganizationCommunications>(
  {
    onboardingEmails: { type: [String], default: [] },
    weeklyUpdates: { type: Boolean, default: true }
  },
  { _id: false }
);

const SupportSchema = new Schema<OrganizationSupport>(
  {
    successManager: { type: String, trim: true },
    supportChannel: { type: String, enum: ['email', 'slack', 'whatsapp'] },
    supportNotes: { type: String }
  },
  { _id: false }
);

const OrganizationSchema = new Schema<OrganizationDocument, OrganizationModel>(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true, unique: true, sparse: true },
    type: {
      type: String,
      enum: ['University', 'Corporate', 'Non-Profit'],
      default: 'University'
    },
    onboardingStage: {
      type: String,
      enum: ['Profile Created', 'Documents Submitted', 'Approved', 'Live'],
      default: 'Profile Created'
    },
    description: { type: String },
    contacts: {
      primary: { type: ContactSchema, default: undefined },
      secondary: { type: ContactSchema, default: undefined }
    },
    location: { type: LocationSchema, default: undefined },
    website: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    communications: { type: CommunicationsSchema, default: undefined },
    support: { type: SupportSchema, default: undefined },
    suspended: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

OrganizationSchema.index({ name: 1 }, { unique: true });
OrganizationSchema.index({ shortName: 1 }, { unique: true, sparse: true });
OrganizationSchema.index({ type: 1 });
OrganizationSchema.index({ suspended: 1 });

export default model<OrganizationDocument, OrganizationModel>('Organization', OrganizationSchema);


