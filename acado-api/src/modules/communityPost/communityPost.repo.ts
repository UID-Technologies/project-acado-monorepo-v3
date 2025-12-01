// src/modules/communityPost/communityPost.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import CommunityPost, { CommunityCategoryModel } from '../../models/CommunityPost.js';
import { Types, Document } from 'mongoose';
import { CommunityPost as ICommunityPost } from '../../models/CommunityPost.js';

export type CommunityPostDocument = Document<unknown, {}, ICommunityPost> & ICommunityPost;

export class CommunityPostRepository extends BaseRepository<CommunityPostDocument> {
  constructor() {
    super(CommunityPost as any);
  }

  async findByCategory(categoryId: string): Promise<CommunityPostDocument[]> {
    return this.find({ categoryId: new Types.ObjectId(categoryId) } as any);
  }

  async findByContentType(contentType: string): Promise<CommunityPostDocument[]> {
    return this.find({ contentType } as any);
  }

  async findPinned(): Promise<CommunityPostDocument[]> {
    return this.find({ isPinned: true } as any);
  }

  async findAll(): Promise<CommunityPostDocument[]> {
    return this.find({} as any);
  }
}

export class CommunityCategoryRepository extends BaseRepository<any> {
  constructor() {
    super(CommunityCategoryModel as any);
  }

  async findAll(): Promise<any[]> {
    return this.find({} as any);
  }
}

