// src/modules/auth/auth.service.ts
import { Response } from 'express';
import { Types } from 'mongoose';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none' | boolean;
  maxAge?: number;
  path?: string;
  domain?: string;
}
import User, { UserDocument, UserRole } from '../../models/User.js';
import Organization from '../../models/Organization.js';
import University from '../../models/University.js';
import Course from '../../models/Course.js';
import PasswordReset from '../../models/PasswordReset.js';
import { loadEnv } from '../../config/env.js';
import { ApiError, NotFoundError, UnauthorizedError, ValidationError } from '../../core/http/ApiError.js';
import { hashPassword, comparePassword } from '../../core/utils/crypto.js';
import { generateRandomToken } from '../../core/utils/crypto.js';
// Note: email service will be migrated later
// For now, import from legacy location
import { sendTemplatedEmail } from '../../services/email.service.js';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  UpdateProfileDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './auth.dto.js';

const {
  NODE_ENV,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = loadEnv();

const accessTokenSecret: Secret = JWT_ACCESS_SECRET;
const refreshTokenSecret: Secret = JWT_REFRESH_SECRET;

const REFRESH_COOKIE_NAME = 'refreshToken';

const parseTimespanToMs = (value: string): number => {
  const match = /^(\d+)([smhd])$/i.exec(String(value).trim());
  if (!match) return 0;
  const [, amountRaw, unitRaw] = match;
  const amount = Number(amountRaw);
  const unit = unitRaw.toLowerCase();
  const unitToMs: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * (unitToMs[unit] ?? 0);
};

const refreshTokenMaxAgeMs =
  parseTimespanToMs(REFRESH_TOKEN_EXPIRES_IN) || 7 * 24 * 60 * 60 * 1000;

const isProduction = NODE_ENV === 'production';

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: refreshTokenMaxAgeMs,
  path: '/',
};

interface AccessTokenPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string | null;
  organizationName?: string | null;
  universityIds?: string[];
  courseIds?: string[];
}

function buildAccessTokenPayload(user: UserDocument): AccessTokenPayload {
  return {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId ? user.organizationId.toString() : null,
    organizationName: user.organizationName ?? null,
    universityIds: Array.isArray(user.universityIds)
      ? user.universityIds.map((id) => id.toString())
      : [],
    courseIds: Array.isArray(user.courseIds)
      ? user.courseIds.map((id) => id.toString())
      : [],
  };
}

function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRES_IN as any };
  return jwt.sign(payload, accessTokenSecret, options);
}

function signRefreshToken(user: UserDocument): string {
  const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRES_IN as any };
  return jwt.sign({ sub: user.id, tokenVersion: user.tokenVersion }, refreshTokenSecret, options);
}

async function issueSession(res: Response, user: UserDocument) {
  user.tokenVersion += 1;
  await user.save();

  const accessToken = signAccessToken(buildAccessTokenPayload(user));
  const refreshToken = signRefreshToken(user);

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshTokenCookieOptions);

  return {
    accessToken,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    user: user.toJSON(),
  };
}

const validateObjectId = (value: unknown, field: string): Types.ObjectId => {
  if (typeof value !== 'string' || !Types.ObjectId.isValid(value)) {
    throw new ValidationError(`Invalid ${field}`);
  }
  return new Types.ObjectId(value);
};

export class AuthService {
  async register(data: RegisterDto, res: Response) {
    const {
      email,
      password,
      name,
      username,
      organizationId: organizationIdRaw,
      universityId: universityIdRaw,
      courseIds: courseIdsRaw = [],
    } = data;

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedUsername = (username || normalizedEmail).trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ApiError(409, 'User already exists with this email', 'USER_EXISTS');
    }

    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      throw new ApiError(409, 'Username already exists', 'USERNAME_EXISTS');
    }

    const organizationId = validateObjectId(organizationIdRaw, 'organizationId');
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    const universityId = validateObjectId(universityIdRaw, 'universityId');
    const university = await University.findOne({ _id: universityId, organizationId });
    if (!university) {
      throw new NotFoundError('University not found for organization');
    }

    let courseObjectIds: Types.ObjectId[] = [];
    if (Array.isArray(courseIdsRaw) && courseIdsRaw.length > 0) {
      const parsedIds = courseIdsRaw
        .filter((value: unknown): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean);

      if (parsedIds.length === 0) {
        throw new ValidationError('Invalid course identifiers');
      }

      const invalidIds = parsedIds.filter((id) => !Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        throw new ValidationError('Invalid course identifiers');
      }

      courseObjectIds = parsedIds.map((id) => new Types.ObjectId(id));

      const courses = await Course.find({
        _id: { $in: courseObjectIds },
        universityId,
      });

      if (courses.length !== courseObjectIds.length) {
        throw new ValidationError('One or more courses do not belong to the selected university');
      }

      const missingForms = courses.filter((course) => !course.applicationFormId);
      if (missingForms.length > 0) {
        throw new ValidationError('Selected courses must have an application form associated');
      }
    }

    const user = await User.create({
      email: normalizedEmail,
      password,
      name,
      username: normalizedUsername,
      userType: 'Learner',
      role: 'learner',
      organizationId,
      organizationName: organization.name,
      universityIds: [universityId],
      courseIds: courseObjectIds,
      isActive: true,
    });

    return await issueSession(res, user);
  }

  async login(data: LoginDto, res: Response) {
    const { email, password } = data;

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password') as UserDocument | null;
    
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return await issueSession(res, user);
  }

  async logout(refreshToken: string | undefined, userId?: string) {
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, refreshTokenSecret) as { sub: string };
        if (decoded?.sub && Types.ObjectId.isValid(decoded.sub)) {
          await User.findByIdAndUpdate(decoded.sub, { $inc: { tokenVersion: 1 } });
        }
      } catch {
        // ignore invalid token errors on logout
      }
    } else if (userId && Types.ObjectId.isValid(userId)) {
      await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
    }
  }

  async getProfile(userId: string): Promise<UserDocument> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<UserDocument> {
    const { name, email } = data;
    const updatePayload: Record<string, unknown> = {};
    
    if (typeof name === 'string') updatePayload.name = name.trim();
    if (typeof email === 'string') {
      const normalizedEmail = email.trim().toLowerCase();
      // Check if email is already taken
      const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } });
      if (existingUser) {
        throw new ApiError(409, 'Email already in use', 'EMAIL_EXISTS');
      }
      updatePayload.email = normalizedEmail;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async changePassword(userId: string, data: ChangePasswordDto, res: Response) {
    const { currentPassword, newPassword } = data;

    const user = await User.findById(userId).select('+password') as UserDocument | null;
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return await issueSession(res, user);
  }

  async refreshToken(token: string, res: Response) {
    let decoded: { sub: string; tokenVersion: number };
    try {
      decoded = jwt.verify(token, refreshTokenSecret) as { sub: string; tokenVersion: number };
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (!decoded?.sub || !Types.ObjectId.isValid(decoded.sub)) {
      throw new UnauthorizedError('Invalid token payload');
    }

    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedError('Token version mismatch');
    }

    return await issueSession(res, user);
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const { email } = data;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Always return success to prevent email enumeration
    if (user && user.isActive) {
      const resetToken = generateRandomToken(32);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Invalidate any existing reset tokens
      await PasswordReset.updateMany(
        { email: normalizedEmail, used: false },
        { used: true, usedAt: new Date() }
      );

      // Create new reset token
      await PasswordReset.create({
        email: normalizedEmail,
        token: resetToken,
        expiresAt,
        used: false,
      });

      // Generate reset link
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

      // Send reset password email
      try {
        await sendTemplatedEmail({
          template: 'forgot_password',
          to: normalizedEmail,
          data: {
            recipientName: user.name,
            resetLink,
            expiresInMinutes: 60,
          },
        });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return {
      message: 'If an account exists with this email, a password reset link has been sent.',
    };
  }

  async resetPassword(data: ResetPasswordDto) {
    const { token, email, password } = data;
    const normalizedEmail = email.trim().toLowerCase();

    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      email: normalizedEmail,
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail }).select('+password') as UserDocument | null;
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.isActive) {
      throw new ApiError(400, 'Account is deactivated', 'ACCOUNT_DEACTIVATED');
    }

    // Update password
    user.password = password;
    await user.save();

    // Mark token as used
    resetRecord.used = true;
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    // Invalidate all other reset tokens
    await PasswordReset.updateMany(
      { email: normalizedEmail, used: false, _id: { $ne: resetRecord._id } },
      { used: true, usedAt: new Date() }
    );

    return {
      message: 'Password has been reset successfully. You can now login with your new password.',
    };
  }
}

