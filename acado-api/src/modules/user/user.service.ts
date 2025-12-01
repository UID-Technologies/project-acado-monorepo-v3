// src/modules/user/user.service.ts
import { Types, FilterQuery } from 'mongoose';
import { UserRepository } from './user.repo.js';
import { NotFoundError, ValidationError, ConflictError } from '../../core/http/ApiError.js';
import {
  ListUsersParams,
  CreateUserInput,
  UpdateUserInput,
} from '../../services/user.service.js';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async listUsers(params: ListUsersParams = {}) {
    // Use existing service for complex logic
    const { listUsers: listUsersService } = await import('../../services/user.service.js');
    return listUsersService(params);
  }

  async getUserById(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Invalid user ID');
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Remove password from response
    const userJson = user.toJSON();
    delete (userJson as any).password;
    return userJson;
  }

  async createUser(data: CreateUserInput) {
    const { createUser: createUserService } = await import('../../services/user.service.js');
    return createUserService(data);
  }

  async updateUser(userId: string, data: UpdateUserInput) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Invalid user ID');
    }

    const { updateUser: updateUserService } = await import('../../services/user.service.js');
    return updateUserService(userId, data);
  }

  async deleteUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Invalid user ID');
    }

    const { deleteUser: deleteUserService } = await import('../../services/user.service.js');
    return deleteUserService(userId);
  }

  async bulkCreateUsers(users: CreateUserInput[]) {
    if (!Array.isArray(users) || users.length === 0) {
      throw new ValidationError('Users array is required and must not be empty');
    }

    const { bulkCreateUsers: bulkCreateUsersService } = await import('../../services/user.service.js');
    return bulkCreateUsersService(users);
  }
}

