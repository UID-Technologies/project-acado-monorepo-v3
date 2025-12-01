// src/services/organization.service.ts
import { randomBytes } from 'crypto';
import mongoose, { Types } from 'mongoose';
import OrganizationModel, { type Organization as OrganizationEntity } from '../models/Organization.js';
import User, { type UserDocument } from '../models/User.js';
import ApiError from '../utils/ApiError.js';

import type { CreateOrganizationInput } from '../schemas/organization.schema.js';

const generateTempPassword = (length = 12) => {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
  const buffer = randomBytes(length);
  let password = '';
  for (let i = 0; i < length; i += 1) {
    password += charset[buffer[i] % charset.length];
  }
  return password;
};

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeEmails = (emails: string[] = []) =>
  Array.from(new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean)));

const compactRecord = <T extends Record<string, unknown>>(record: T) => {
  const entries = Object.entries(record).filter(
    ([, value]) => value !== undefined && value !== null && value !== ''
  );
  return Object.fromEntries(entries) as Partial<T>;
};

const normalizeContact = (contact?: { name?: string; email?: string; phone?: string }) => {
  if (!contact) return undefined;
  const normalized = compactRecord({
    name: contact.name?.trim(),
    email: contact.email?.trim().toLowerCase(),
    phone: contact.phone?.trim()
  });
  return Object.keys(normalized).length > 0 ? normalized : undefined;
};

type UpdateOrganizationInfoInput = {
  name?: string;
  shortName?: string;
  type?: OrganizationEntity['type'];
  description?: string;
  website?: string;
};

type UpdateOrganizationContactsInput = {
  primary?: { name?: string; email?: string; phone?: string };
  secondary?: { name?: string; email?: string; phone?: string };
};

export const listOrganizations = async () => {
  const organizations = await OrganizationModel.find().sort({ createdAt: -1 });
  return organizations.map((org) => org.toJSON());
};

export const listOrganizationsPublic = async () => {
  const organizations = await OrganizationModel.find({ suspended: { $ne: true } })
    .sort({ name: 1 })
    .select({ name: 1, shortName: 1, type: 1 })
    .lean()
    .exec();

  return organizations.map((org) => {
    const entity = org as unknown as { _id: Types.ObjectId; name: string; shortName?: string; type: OrganizationEntity['type'] };
    return {
      id: entity._id.toString(),
      name: entity.name,
      shortName: entity.shortName ?? undefined,
      type: entity.type,
    };
  });
};

export const getOrganizationById = async (organizationId: string) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new ApiError(400, 'Invalid organization identifier');
  }

  const organization = await OrganizationModel.findById(organizationId);
  if (!organization) {
    throw new ApiError(404, 'Organization not found');
  }

  const adminUser = await User.findOne({
    organizationId: organization._id,
    role: 'admin',
  })
    .select({ name: 1, email: 1, mobileNo: 1 })
    .lean<{ _id: Types.ObjectId; name: string; email: string; mobileNo?: string | null }>();

  return {
    organization: organization.toJSON(),
    primaryAdmin: adminUser
      ? {
          id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email,
          phone: adminUser.mobileNo ?? undefined,
        }
      : undefined,
  };
};

export const addOrganizationAdmin = async (
  organizationId: string,
  payload: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    sendWelcomeEmail?: boolean;
  }
) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new ApiError(400, 'Invalid organization identifier');
  }

  const organization = await OrganizationModel.findById(organizationId);
  if (!organization) {
    throw new ApiError(404, 'Organization not found');
  }

  const normalizedEmail = payload.email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, 'An account already exists with this email');
  }

  const password =
    payload.password && payload.password.trim().length >= 8
      ? payload.password.trim()
      : generateTempPassword();

  const adminUser = await User.create({
    email: normalizedEmail,
    password,
    name: payload.name.trim(),
    username: normalizedEmail,
    userType: 'Admin',
    organizationId: organization._id,
    organizationName: organization.name,
    mobileNo: payload.phone?.trim(),
    role: 'admin',
    isActive: true,
  });

  return {
    admin: adminUser.toJSON(),
    temporaryCredentials:
      payload.password && payload.password.trim().length >= 8
        ? undefined
        : {
            email: normalizedEmail,
            password,
          },
    sendWelcomeEmail: payload.sendWelcomeEmail ?? true,
  };
};

export const updateOrganizationInfo = async (
  organizationId: string,
  payload: UpdateOrganizationInfoInput
) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new ApiError(400, 'Invalid organization identifier');
  }

  const setPayload: Record<string, unknown> = {};
  const unsetPayload: Record<string, ''> = {};

  if (payload.name !== undefined) {
    const trimmedName = payload.name.trim();
    if (!trimmedName) {
      throw new ApiError(400, 'Organization name cannot be empty.');
    }
    setPayload.name = trimmedName;
  }

  if (payload.type !== undefined) {
    setPayload.type = payload.type;
  }

  if (payload.description !== undefined) {
    const trimmedDescription = payload.description.trim();
    if (trimmedDescription) {
      setPayload.description = trimmedDescription;
    } else {
      unsetPayload.description = '';
    }
  }

  if (payload.website !== undefined) {
    const trimmedWebsite = payload.website.trim();
    if (trimmedWebsite) {
      setPayload.website = trimmedWebsite;
    } else {
      unsetPayload.website = '';
    }
  }

  if (payload.shortName !== undefined) {
    const trimmedShortName = payload.shortName.trim();
    if (trimmedShortName) {
      setPayload.shortName = toSlug(trimmedShortName);
    } else {
      unsetPayload.shortName = '';
    }
  }

  if (Object.keys(setPayload).length === 0 && Object.keys(unsetPayload).length === 0) {
    throw new ApiError(400, 'No changes provided for update.');
  }

  const updateOps: Record<string, unknown> = {};
  if (Object.keys(setPayload).length > 0) {
    updateOps.$set = setPayload;
  }
  if (Object.keys(unsetPayload).length > 0) {
    updateOps.$unset = unsetPayload;
  }

  const organization = await OrganizationModel.findByIdAndUpdate(organizationId, updateOps, {
    new: true,
    runValidators: true
  });

  if (!organization) {
    throw new ApiError(404, 'Organization not found');
  }

  return organization.toJSON();
};

export const updateOrganizationContacts = async (
  organizationId: string,
  payload: UpdateOrganizationContactsInput
) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new ApiError(400, 'Invalid organization identifier');
  }

  const setPayload: Record<string, unknown> = {};
  const unsetPayload: Record<string, ''> = {};
  let hasChanges = false;

  if (payload.primary !== undefined) {
    hasChanges = true;
    const normalizedPrimary = normalizeContact(payload.primary);
    if (normalizedPrimary) {
      setPayload['contacts.primary'] = normalizedPrimary;
    } else {
      unsetPayload['contacts.primary'] = '';
    }
  }

  if (payload.secondary !== undefined) {
    hasChanges = true;
    const normalizedSecondary = normalizeContact(payload.secondary);
    if (normalizedSecondary) {
      setPayload['contacts.secondary'] = normalizedSecondary;
    } else {
      unsetPayload['contacts.secondary'] = '';
    }
  }

  if (!hasChanges) {
    throw new ApiError(400, 'No contact changes provided for update.');
  }

  const updateOps: Record<string, unknown> = {};
  if (Object.keys(setPayload).length > 0) {
    updateOps.$set = setPayload;
  }
  if (Object.keys(unsetPayload).length > 0) {
    updateOps.$unset = unsetPayload;
  }

  const organization = await OrganizationModel.findByIdAndUpdate(organizationId, updateOps, {
    new: true,
    runValidators: true
  });

  if (!organization) {
    throw new ApiError(404, 'Organization not found');
  }

  return organization.toJSON();
};

export const createOrganization = async (input: CreateOrganizationInput) => {
  const { admin, ...orgPayload } = input;

  let normalizedAdminEmail: string | undefined;
  if (admin) {
    normalizedAdminEmail = admin.email.trim().toLowerCase();
    const existingAdmin = await User.findOne({ email: normalizedAdminEmail });
    if (existingAdmin) {
      throw new ApiError(400, 'Administrator email is already in use');
    }
  }

  const normalizedName = orgPayload.name.trim();
  const normalizedShortName = orgPayload.shortName
    ? toSlug(orgPayload.shortName)
    : toSlug(normalizedName);

  const location = orgPayload.location
    ? compactRecord({
        country: orgPayload.location.country?.trim(),
        state: orgPayload.location.state?.trim(),
        city: orgPayload.location.city?.trim()
      })
    : undefined;

  const primaryContact = normalizeContact(orgPayload.contacts?.primary);
  const secondaryContact = normalizeContact(orgPayload.contacts?.secondary);

  const contacts =
    primaryContact || secondaryContact
      ? {
          primary: primaryContact,
          secondary: secondaryContact
        }
      : undefined;

  const communications = orgPayload.communications
    ? {
        onboardingEmails: normalizeEmails(orgPayload.communications.onboardingEmails),
        weeklyUpdates: orgPayload.communications.weeklyUpdates ?? true
      }
    : undefined;

  const support = orgPayload.support
    ? compactRecord({
        successManager: orgPayload.support.successManager?.trim(),
        supportChannel: orgPayload.support.supportChannel,
        supportNotes: orgPayload.support.supportNotes?.trim()
      })
    : undefined;

  const session = await mongoose.startSession();
  const client: any =
    typeof mongoose.connection.getClient === 'function'
      ? mongoose.connection.getClient()
      : (mongoose.connection as any).client;
  const topology: any = client?.topology;
  const supportsTransactions =
    typeof topology?.hasSessionSupport === 'function'
      ? topology.hasSessionSupport()
      : Boolean(client?.options?.replicaSet);

  try {
    if (supportsTransactions) {
      session.startTransaction();
    }

    const organization = await new OrganizationModel({
        name: normalizedName,
        shortName: normalizedShortName || undefined,
        type: orgPayload.type,
        onboardingStage: orgPayload.onboardingStage ?? 'Profile Created',
        description: orgPayload.description,
        contacts,
        location,
        website: orgPayload.website?.trim(),
        logoUrl: orgPayload.logoUrl?.trim(),
        communications,
        support,
        suspended: orgPayload.suspended ?? false
      }).save(supportsTransactions ? { session } : undefined);

    let adminUser: UserDocument | null = null;
    let adminCredentials:
      | { email: string; password: string }
      | undefined;

    if (admin && normalizedAdminEmail) {
      const providedPassword = admin.password?.trim();
      const adminPassword =
        providedPassword && providedPassword.length >= 8
          ? providedPassword
          : generateTempPassword();

      adminUser = await new User({
          email: normalizedAdminEmail,
          password: adminPassword,
          name: admin.name.trim(),
          username: normalizedAdminEmail,
      userType: 'Admin',
          organizationId: organization._id,
          organizationName: organization.name,
          mobileNo: admin.phone?.trim(),
          role: 'admin',
          isActive: true
        }).save(supportsTransactions ? { session } : undefined);

      adminCredentials = providedPassword
        ? undefined
        : {
            email: normalizedAdminEmail,
            password: adminPassword
          };
    }

    if (supportsTransactions) {
      await session.commitTransaction();
    }

    return {
      organization: organization.toJSON(),
      admin: adminUser ? adminUser.toJSON() : undefined,
      adminCredentials
    };
  } catch (error: any) {
    if (supportsTransactions && session.inTransaction()) {
      await session.abortTransaction();
    }

    if (error?.code === 11000) {
      throw new ApiError(409, 'Organization already exists with the same name or short name');
    }

    throw error;
  } finally {
    session.endSession();
  }
};

export const updateOrganizationSuspension = async (organizationId: string, suspended: boolean) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new ApiError(400, 'Invalid organization identifier');
  }

  const organization = await OrganizationModel.findByIdAndUpdate(
    organizationId,
    { suspended },
    { new: true }
  );

  if (!organization) {
    throw new ApiError(404, 'Organization not found');
  }

  return organization.toJSON();
};

export const updateOrganizationLocation = async (
  organizationId: string,
  location: { city?: string; state?: string; country?: string }
) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new ApiError(400, 'Invalid organization identifier');
  }

  const normalizedLocation = compactRecord({
    city: location.city?.trim(),
    state: location.state?.trim(),
    country: location.country?.trim(),
  });

  const updatePayload =
    Object.keys(normalizedLocation).length > 0 ? { location: normalizedLocation } : { location: undefined };

  const organization = await OrganizationModel.findByIdAndUpdate(
    organizationId,
    updatePayload,
    { new: true }
  );

  if (!organization) {
    throw new ApiError(404, 'Organization not found');
  }

  return organization.toJSON();
};

export const updateOrganizationOnboardingStage = async (
  organizationId: string,
  onboardingStage: 'Profile Created' | 'Documents Submitted' | 'Approved' | 'Live'
) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new ApiError(400, 'Invalid organization identifier');
  }

  const organization = await OrganizationModel.findByIdAndUpdate(
    organizationId,
    { onboardingStage },
    { new: true }
  );

  if (!organization) {
    throw new ApiError(404, 'Organization not found');
  }

  return organization.toJSON();
};


