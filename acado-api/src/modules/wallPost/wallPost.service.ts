// src/modules/wallPost/wallPost.service.ts
import { Types } from 'mongoose';
import { WallPostRepository } from './wallPost.repo.js';
import { NotFoundError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateWallPostDto,
  UpdateWallPostDto,
  ListWallPostsDto,
} from './wallPost.dto.js';

export class WallPostService {
  private wallPostRepo: WallPostRepository;

  constructor() {
    this.wallPostRepo = new WallPostRepository();
  }

  async listWallPosts(filters: ListWallPostsDto = {}) {
    try {
      const { createdBy, search } = filters;

      let posts;
      if (search) {
        posts = await this.wallPostRepo.searchByDescription(search);
      } else if (createdBy && Types.ObjectId.isValid(createdBy)) {
        posts = await this.wallPostRepo.findByCreator(createdBy);
      } else {
        posts = await this.wallPostRepo.findAll();
      }

      return posts.map(p => {
        try {
          return p.toJSON ? p.toJSON() : p;
        } catch (error) {
          console.error('Error converting wall post to JSON:', error, p);
          // Fallback to manual conversion
          const postObj = p as any;
          return {
            id: postObj._id?.toString() || postObj.id,
            description: postObj.description,
            createdBy: postObj.createdBy?.toString() || postObj.createdBy,
            createdAt: postObj.createdAt,
            updatedAt: postObj.updatedAt
          };
        }
      });
    } catch (error: any) {
      console.error('WallPostService.listWallPosts error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        filters
      });
      throw error;
    }
  }

  async getWallPostById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid wall post ID');
    }

    const post = await this.wallPostRepo.findById(id);
    if (!post) {
      throw new NotFoundError('Wall post not found');
    }
    return post.toJSON();
  }

  async createWallPost(data: CreateWallPostDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Invalid user ID');
    }

    const post = await this.wallPostRepo.create({
      ...data,
      createdBy: new Types.ObjectId(userId),
    } as any);
    return post.toJSON();
  }

  async updateWallPost(id: string, data: UpdateWallPostDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid wall post ID');
    }

    const post = await this.wallPostRepo.update(id, data);
    if (!post) {
      throw new NotFoundError('Wall post not found');
    }
    return post.toJSON();
  }

  async deleteWallPost(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid wall post ID');
    }

    const deleted = await this.wallPostRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError('Wall post not found');
    }
  }
}

