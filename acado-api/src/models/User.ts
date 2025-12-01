// src/models/User.ts
import { Schema, model, Model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'superadmin' | 'admin' | 'learner';

export interface IUser {
  email: string;
  password: string;
  name: string;
  username: string;
  userType: 'Learner' | 'Faculty' | 'Staff' | 'Admin';
  mobileNo?: string;
  studentIdStaffId?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  dateOfBirth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  role: UserRole;
  isActive: boolean;
  organizationId?: Types.ObjectId | null;
  organizationName?: string;
  universityIds?: Types.ObjectId[];
  courseIds?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  tokenVersion: number;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = Document<unknown, {}, IUser> & IUser & IUserMethods;
export type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  userType: {
    type: String,
    enum: ['Learner', 'Faculty', 'Staff', 'Admin'],
    default: 'Learner',
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    default: null,
  },
  organizationName: {
    type: String,
    trim: true,
  },
  mobileNo: {
    type: String,
    trim: true,
  },
  studentIdStaffId: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  pinCode: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'learner'],
    default: 'learner',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  universityIds: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'University',
    }],
    default: [],
  },
  courseIds: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Course',
    }],
    default: [],
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (_doc: any, ret: any) {
      ret.id = ret._id.toString();
      if (ret.organizationId) {
        ret.organizationId = ret.organizationId.toString();
      }
      if (Array.isArray(ret.universityIds)) {
        ret.universityIds = ret.universityIds.map((id: Types.ObjectId | string) => id?.toString());
      }
      if (Array.isArray(ret.courseIds)) {
        ret.courseIds = ret.courseIds.map((id: Types.ObjectId | string) => id?.toString());
      }
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: function (_doc: any, ret: any) {
      ret.id = ret._id.toString();
      if (ret.organizationId) {
        ret.organizationId = ret.organizationId.toString();
      }
      if (Array.isArray(ret.universityIds)) {
        ret.universityIds = ret.universityIds.map((id: Types.ObjectId | string) => id?.toString());
      }
      if (Array.isArray(ret.courseIds)) {
        ret.courseIds = ret.courseIds.map((id: Types.ObjectId | string) => id?.toString());
      }
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  },
});

UserSchema.index({ name: 1, email: 1, username: 1 });
UserSchema.index({ userType: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ organizationId: 1 });
UserSchema.index({ role: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser, UserModel>('User', UserSchema);

