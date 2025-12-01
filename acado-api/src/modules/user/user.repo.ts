// src/modules/user/user.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import User, { UserDocument } from '../../models/User.js';
import { Types, FilterQuery } from 'mongoose';

export class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super(User as any);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email: email.toLowerCase().trim() } as any);
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.findOne({ username: username.toLowerCase().trim() } as any);
  }

  async findByOrganization(organizationId: string): Promise<UserDocument[]> {
    return this.find({ organizationId: new Types.ObjectId(organizationId) } as any);
  }

  async findByUniversity(universityId: string): Promise<UserDocument[]> {
    return this.find({ universityIds: new Types.ObjectId(universityId) } as any);
  }

  async findActive(): Promise<UserDocument[]> {
    return this.find({ isActive: true } as any);
  }

  async searchUsers(query: FilterQuery<any>): Promise<UserDocument[]> {
    return this.find(query);
  }

  async countUsers(query: FilterQuery<any>): Promise<number> {
    return this.count(query);
  }
}

