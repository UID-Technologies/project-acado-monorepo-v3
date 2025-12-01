import { FilterQuery, Types } from 'mongoose';
import User, { IUser, UserDocument, UserRole } from '../models/User.js';
import University from '../models/University.js';
import Organization from '../models/Organization.js';
import ApiError from '../utils/ApiError.js';

export interface ListUsersParams {
  search?: string;
  userType?: 'Learner' | 'Faculty' | 'Staff' | 'Admin';
  status?: 'active' | 'inactive';
  organizationId?: string;
  organizationName?: string;
  universityId?: string;
  universityName?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  username: string;
  userType?: 'Learner' | 'Faculty' | 'Staff' | 'Admin';
  role?: UserRole;
  organizationId?: string | null;
  organizationName?: string;
  universityId?: string | null;
  universityName?: string;
  mobileNo?: string;
  studentIdStaffId?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  status?: 'active' | 'inactive';
}

export interface UpdateUserInput extends Partial<CreateUserInput> {}

const ALLOWED_ROLES: UserRole[] = ['superadmin', 'admin', 'learner'];

const sanitizeRole = (role?: UserRole): UserRole => {
  if (role && ALLOWED_ROLES.includes(role)) {
    return role;
  }
  return 'learner';
};

const buildQuery = (params: ListUsersParams = {}): FilterQuery<IUser> => {
  const query: FilterQuery<IUser> = {};

  if (params.search) {
    const regex = new RegExp(params.search.trim(), 'i');
    query.$or = [
      { name: regex },
      { email: regex },
      { username: regex },
      { organizationName: regex },
    ];
  }

  if (params.userType) {
    query.userType = params.userType;
  }

  if (params.status) {
    query.isActive = params.status === 'active';
  }

  if (params.organizationId) {
    if (Types.ObjectId.isValid(params.organizationId)) {
      query.organizationId = new Types.ObjectId(params.organizationId);
    } else {
      query.organizationId = params.organizationId;
    }
  }

  if (params.organizationName) {
    query.organizationName = params.organizationName;
  }

  if (params.universityId) {
    if (Types.ObjectId.isValid(params.universityId)) {
      query.universityIds = new Types.ObjectId(params.universityId);
    } else {
      query.universityIds = params.universityId;
    }
  }

  if (params.universityName) {
    const universityRegex = new RegExp(params.universityName.trim(), 'i');
    query.$or = [
      ...(Array.isArray(query.$or) ? query.$or : []),
      { organizationName: universityRegex },
    ];
  }

  return query;
};

const resolveOrganization = async (
  organizationId?: string | null,
  organizationName?: string,
): Promise<{ organizationId: Types.ObjectId | null; organizationName?: string }> => {
  if (organizationId) {
    if (!Types.ObjectId.isValid(organizationId)) {
      throw new ApiError(400, 'Invalid organization identifier');
    }

    const [organization, university] = await Promise.all([
      Organization.findById(organizationId, { name: 1 }),
      University.findById(organizationId, { name: 1 })
    ]);

    if (organization) {
      return {
        organizationId: organization._id as Types.ObjectId,
        organizationName: organization.name,
      };
    }

    if (university) {
      return {
        organizationId: university._id as Types.ObjectId,
        organizationName: university.name,
      };
    }

    throw new ApiError(400, 'Organization not found');
  }

  return {
    organizationId: null,
    organizationName: organizationName?.trim() || undefined,
  };
};

const resolveAffiliation = async ({
  organizationId,
  organizationName,
  universityId,
  universityName,
}: {
  organizationId?: string | null;
  organizationName?: string;
  universityId?: string | null;
  universityName?: string;
}): Promise<{
  organizationId: Types.ObjectId | null;
  organizationName?: string;
  universityIds: Types.ObjectId[];
}> => {
  let resolvedOrganizationId = organizationId ?? undefined;
  let resolvedOrganizationName = organizationName?.trim();
  let resolvedUniversityIds: Types.ObjectId[] = [];

  if (universityId && typeof universityId === 'string' && universityId.trim().length > 0) {
    if (!Types.ObjectId.isValid(universityId)) {
      throw new ApiError(400, 'Invalid university identifier');
    }

    const university = await University.findById(universityId, {
      name: 1,
      organizationId: 1,
      organizationName: 1,
    });

    if (!university) {
      throw new ApiError(400, 'University not found');
    }

    resolvedUniversityIds = [university._id as Types.ObjectId];

    const universityOrganizationName =
      (university as unknown as { organizationName?: string | null }).organizationName ?? undefined;

    if (university.organizationId) {
      resolvedOrganizationId = university.organizationId.toString();
      if (!resolvedOrganizationName) {
        resolvedOrganizationName = universityOrganizationName ?? university.name;
      }
    } else {
      // Fallback: treat university itself as the organization reference
      resolvedOrganizationId = university._id.toString();
      if (!resolvedOrganizationName) {
        resolvedOrganizationName = university.name || universityName?.trim();
      }
    }
  } else if (universityName && !resolvedOrganizationName) {
    resolvedOrganizationName = universityName.trim();
  }

  const orgInfo = await resolveOrganization(
    resolvedOrganizationId,
    resolvedOrganizationName,
  );

  return {
    organizationId: orgInfo.organizationId,
    organizationName: orgInfo.organizationName,
    universityIds: resolvedUniversityIds,
  };
};

const applyCommonUpdates = async (user: UserDocument, payload: UpdateUserInput) => {
  if (payload.name !== undefined) user.name = payload.name;
  if (payload.email !== undefined) user.email = payload.email;
  if (payload.username !== undefined) user.username = payload.username.toLowerCase();
  if (payload.userType) user.userType = payload.userType;
  if (payload.role) user.role = sanitizeRole(payload.role);
  if (payload.mobileNo !== undefined) user.mobileNo = payload.mobileNo;
  if (payload.studentIdStaffId !== undefined) user.studentIdStaffId = payload.studentIdStaffId;
  if (payload.address !== undefined) user.address = payload.address;
  if (payload.country !== undefined) user.country = payload.country;
  if (payload.state !== undefined) user.state = payload.state;
  if (payload.city !== undefined) user.city = payload.city;
  if (payload.pinCode !== undefined) user.pinCode = payload.pinCode;
  if (payload.gender) user.gender = payload.gender;

  if (payload.dateOfBirth !== undefined) {
    user.dateOfBirth = payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined;
  }

  if (payload.status) {
    user.isActive = payload.status === 'active';
  }

  if (payload.organizationId !== undefined || payload.organizationName !== undefined) {
    const affiliation = await resolveAffiliation({
      organizationId: payload.organizationId ?? undefined,
      organizationName: payload.organizationName,
      universityId: payload.universityId,
      universityName: payload.universityName,
    });
    user.organizationId = affiliation.organizationId ?? undefined;
    user.organizationName = affiliation.organizationName;
    if (payload.universityId !== undefined) {
      user.universityIds = affiliation.universityIds;
    }
  } else if (payload.universityId !== undefined || payload.universityName !== undefined) {
    const affiliation = await resolveAffiliation({
      universityId: payload.universityId,
      universityName: payload.universityName,
      organizationId: user.organizationId?.toString(),
      organizationName: user.organizationName,
    });
    user.organizationId = affiliation.organizationId ?? undefined;
    user.organizationName = affiliation.organizationName;
    user.universityIds = affiliation.universityIds;
  }
};

export const listUsers = async (params: ListUsersParams = {}) => {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const limit = Number(params.pageSize) > 0 ? Number(params.pageSize) : 25;
  const skip = (page - 1) * limit;

  const query = buildQuery(params);

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  return {
    data: users.map((user) => user.toJSON()),
    pagination: {
      page,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user.toJSON();
};

export const createUser = async (payload: CreateUserInput) => {
  const { organizationId, organizationName, universityId, universityName } = payload;

  const uniqueEmail = await User.findOne({ email: payload.email });
  if (uniqueEmail) {
    throw new ApiError(400, 'Email already in use');
  }

  const uniqueUsername = await User.findOne({ username: payload.username.toLowerCase() });
  if (uniqueUsername) {
    throw new ApiError(400, 'Username already in use');
  }

  const affiliation = await resolveAffiliation({
    organizationId,
    organizationName,
    universityId,
    universityName,
  });

  const user = await User.create({
    email: payload.email,
    password: payload.password,
    name: payload.name,
    username: payload.username.toLowerCase(),
    userType: payload.userType || 'Learner',
    organizationId: affiliation.organizationId,
    organizationName: affiliation.organizationName,
    universityIds: affiliation.universityIds,
    mobileNo: payload.mobileNo,
    studentIdStaffId: payload.studentIdStaffId,
    address: payload.address,
    country: payload.country,
    state: payload.state,
    city: payload.city,
    pinCode: payload.pinCode,
    dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
    gender: payload.gender,
    isActive: payload.status ? payload.status === 'active' : true,
    role: sanitizeRole(payload.role),
  });

  return user.toJSON();
};

export const updateUser = async (id: string, payload: UpdateUserInput) => {
  const user = await User.findById(id).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (payload.email && payload.email !== user.email) {
    const existing = await User.findOne({ email: payload.email, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(400, 'Email already in use');
    }
  }

  if (payload.username && payload.username.toLowerCase() !== user.username) {
    const existing = await User.findOne({ username: payload.username.toLowerCase(), _id: { $ne: id } });
    if (existing) {
      throw new ApiError(400, 'Username already in use');
    }
  }

  await applyCommonUpdates(user, payload);

  if (payload.password) {
    user.password = payload.password;
  }

  await user.save();
  return user.toJSON();
};

export const deleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isActive = false;
  await user.save();
};

export const bulkCreateUsers = async (users: CreateUserInput[]) => {
  if (!Array.isArray(users) || users.length === 0) {
    throw new ApiError(400, 'Users payload must be a non-empty array');
  }

  const createdUsers: IUser[] = [];

  for (const payload of users) {
    const user = await createUser(payload);
    createdUsers.push(user as unknown as IUser);
  }

  return createdUsers;
};
