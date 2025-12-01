// src/modules/wallPost/wallPost.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import WallPost from '../../models/WallPost.js';
import { Types, Document } from 'mongoose';
import { WallPost as IWallPost } from '../../models/WallPost.js';

export type WallPostDocument = Document<unknown, {}, IWallPost> & IWallPost;

export class WallPostRepository extends BaseRepository<WallPostDocument> {
  constructor() {
    super(WallPost as any);
  }

  async findByCreator(createdBy: string): Promise<WallPostDocument[]> {
    return this.find({ createdBy: new Types.ObjectId(createdBy) } as any);
  }

  async searchByDescription(search: string): Promise<WallPostDocument[]> {
    return this.find({ description: { $regex: search, $options: 'i' } } as any);
  }

  async findAll(): Promise<WallPostDocument[]> {
    return this.find({} as any);
  }
}

