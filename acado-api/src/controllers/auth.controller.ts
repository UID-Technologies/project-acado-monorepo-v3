// src/controllers/auth.controller.ts
import { Request, Response, NextFunction, CookieOptions } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import User, { UserDocument, UserRole } from '../models/User.js';
import Organization from '../models/Organization.js';
import University from '../models/University.js';
import Course from '../models/Course.js';
import PasswordReset from '../models/PasswordReset.js';
import { loadEnv } from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import crypto from 'crypto';
import { sendTemplatedEmail } from '../services/email.service.js';

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
  secure: true, // required whenever SameSite=None
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

function signAccessToken(payload: AccessTokenPayload) {
  const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRES_IN as any };
  return jwt.sign(payload, accessTokenSecret, options);
}

function signRefreshToken(user: UserDocument) {
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

const validateObjectId = (value: unknown, field: string) => {
  if (typeof value !== 'string' || !Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `Invalid ${field}`);
  }
  return new Types.ObjectId(value);
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      password,
      name,
      username,
      organizationId: organizationIdRaw,
      universityId: universityIdRaw,
      courseIds: courseIdsRaw = [],
    } = req.body;

    if (!email || !password || !name || !organizationIdRaw || !universityIdRaw) {
      throw new ApiError(400, 'Email, password, name, organizationId and universityId are required');
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedUsername = (username || normalizedEmail).trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ApiError(400, 'User already exists with this email');
    }

    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      throw new ApiError(400, 'Username already exists');
    }

    const organizationId = validateObjectId(organizationIdRaw, 'organizationId');
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      throw new ApiError(400, 'Organization not found');
    }

    const universityId = validateObjectId(universityIdRaw, 'universityId');
    const university = await University.findOne({ _id: universityId, organizationId });
    if (!university) {
      throw new ApiError(400, 'University not found for organization');
    }

    let courseObjectIds: Types.ObjectId[] = [];
    if (Array.isArray(courseIdsRaw) && courseIdsRaw.length > 0) {
      const parsedIds = courseIdsRaw
        .filter((value: unknown): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean);

      if (parsedIds.length === 0) {
        throw new ApiError(400, 'Invalid course identifiers');
      }

      const invalidIds = parsedIds.filter((id) => !Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        throw new ApiError(400, 'Invalid course identifiers');
      }

      courseObjectIds = parsedIds.map((id) => new Types.ObjectId(id));

      const courses = await Course.find({
        _id: { $in: courseObjectIds },
        universityId,
      });

      if (courses.length !== courseObjectIds.length) {
        throw new ApiError(400, 'One or more courses do not belong to the selected university');
      }

      const missingForms = courses.filter((course) => !course.applicationFormId);
      if (missingForms.length > 0) {
        throw new ApiError(400, 'Selected courses must have an application form associated');
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

    const session = await issueSession(res, user);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password') as UserDocument | null;
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Account is deactivated');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const session = await issueSession(res, user);
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...refreshTokenCookieOptions,
      maxAge: 0,
    });

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, refreshTokenSecret) as { sub: string };
        if (decoded?.sub && Types.ObjectId.isValid(decoded.sub)) {
          await User.findByIdAndUpdate(decoded.sub, { $inc: { tokenVersion: 1 } });
        }
      } catch {
        // ignore invalid token errors on logout
      }
    } else if ((req as any).user?.sub && Types.ObjectId.isValid((req as any).user.sub)) {
      await User.findByIdAndUpdate((req as any).user.sub, { $inc: { tokenVersion: 1 } });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub || (req as any).user?.id;
    if (!userId) {
      throw new ApiError(401, 'UNAUTHORIZED');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub || (req as any).user?.id;
    if (!userId) {
      throw new ApiError(401, 'UNAUTHORIZED');
    }

    const { name, email } = req.body;
    const updatePayload: Record<string, unknown> = {};
    if (typeof name === 'string') updatePayload.name = name.trim();
    if (typeof email === 'string') updatePayload.email = email.trim().toLowerCase();

    const user = await User.findByIdAndUpdate(
      userId,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.sub || (req as any).user?.id;
    if (!userId) {
      throw new ApiError(401, 'UNAUTHORIZED');
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'Current and new password are required');
    }

    const user = await User.findById(userId).select('+password') as UserDocument | null;
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    const session = await issueSession(res, user);
    res.json({
      message: 'Password updated successfully',
      ...session,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.[REFRESH_COOKIE_NAME] ||
      req.body?.refreshToken ||
      req.headers['x-refresh-token'];

    if (typeof token !== 'string') {
      throw new ApiError(401, 'UNAUTHORIZED');
    }

    let decoded: { sub: string; tokenVersion: number };
    try {
      decoded = jwt.verify(token, refreshTokenSecret) as { sub: string; tokenVersion: number };
    } catch {
      throw new ApiError(401, 'UNAUTHORIZED');
    }

    if (!decoded?.sub || !Types.ObjectId.isValid(decoded.sub)) {
      throw new ApiError(401, 'UNAUTHORIZED');
    }

    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'UNAUTHORIZED');
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
      throw new ApiError(401, 'UNAUTHORIZED');
    }

    const session = await issueSession(res, user);
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      throw new ApiError(400, 'Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user && user.isActive) {
      // Generate secure random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Set expiration to 1 hour from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Invalidate any existing reset tokens for this email
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

        console.log('✅ Password reset email sent to:', normalizedEmail);
      } catch (emailError) {
        console.error('❌ Failed to send password reset email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Always return success (security best practice)
    res.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      throw new ApiError(400, 'Token, email, and password are required');
    }

    if (typeof password !== 'string' || password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      email: normalizedEmail,
      token,
      used: false,
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (!resetRecord) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail }).select('+password') as UserDocument | null;
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (!user.isActive) {
      throw new ApiError(400, 'Account is deactivated');
    }

    // Update password
    user.password = password;
    await user.save();

    // Mark token as used
    resetRecord.used = true;
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    // Invalidate all other reset tokens for this email
    await PasswordReset.updateMany(
      { email: normalizedEmail, used: false, _id: { $ne: resetRecord._id } },
      { used: true, usedAt: new Date() }
    );

    console.log('✅ Password reset successful for:', normalizedEmail);

    res.json({
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

