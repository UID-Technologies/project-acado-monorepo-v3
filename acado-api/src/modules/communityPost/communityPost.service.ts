// src/modules/communityPost/communityPost.service.ts
import { Types } from 'mongoose';
import { CommunityPostRepository, CommunityCategoryRepository } from './communityPost.repo.js';
import { NotFoundError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateCommunityPostDto,
  UpdateCommunityPostDto,
  ListCommunityPostsDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './communityPost.dto.js';

export class CommunityPostService {
  private postRepo: CommunityPostRepository;
  private categoryRepo: CommunityCategoryRepository;

  constructor() {
    this.postRepo = new CommunityPostRepository();
    this.categoryRepo = new CommunityCategoryRepository();
  }

  async listCategories() {
    try {
      const categories = await this.categoryRepo.findAll();
      return categories.map(c => {
        try {
          return c.toJSON ? c.toJSON() : c;
        } catch (error) {
          console.error('Error converting category to JSON:', error, c);
          return c;
        }
      });
    } catch (error: any) {
      console.error('CommunityPostService.listCategories error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      throw error;
    }
  }

  async getCategoryById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid category ID');
    }

    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category.toJSON();
  }

  async createCategory(data: CreateCategoryDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Invalid user ID');
    }

    const category = await this.categoryRepo.create({
      ...data,
      createdBy: new Types.ObjectId(userId),
    } as any);
    return category.toJSON();
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid category ID');
    }

    const category = await this.categoryRepo.update(id, data);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category.toJSON();
  }

  async deleteCategory(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid category ID');
    }

    await this.categoryRepo.delete(id);
  }

  async listCommunityPosts(filters: ListCommunityPostsDto = {}) {
    try {
      const { categoryId, contentType, isPinned, search } = filters;

      let posts;
      if (categoryId && Types.ObjectId.isValid(categoryId)) {
        posts = await this.postRepo.findByCategory(categoryId);
      } else if (contentType) {
        posts = await this.postRepo.findByContentType(contentType);
      } else if (isPinned !== undefined) {
        if (isPinned) {
          posts = await this.postRepo.findPinned();
        } else {
          posts = await this.postRepo.find({ isPinned: false } as any);
        }
      } else {
        posts = await this.postRepo.findAll();
      }

      // Apply search filter if provided
      if (search) {
        posts = posts.filter(p => {
          try {
            const json = p.toJSON ? p.toJSON() : p;
            return json.title?.toLowerCase().includes(search.toLowerCase()) ||
                   json.description?.toLowerCase().includes(search.toLowerCase());
          } catch (error) {
            console.error('Error filtering post:', error, p);
            return false;
          }
        });
      }

      return posts.map(p => {
        try {
          return p.toJSON ? p.toJSON() : p;
        } catch (error) {
          console.error('Error converting post to JSON:', error, p);
          // Fallback to manual conversion
          const postObj = p as any;
          return {
            id: postObj._id?.toString() || postObj.id,
            title: postObj.title,
            description: postObj.description,
            categoryId: postObj.categoryId?.toString() || postObj.categoryId,
            contentType: postObj.contentType,
            isPinned: postObj.isPinned,
            createdAt: postObj.createdAt,
            updatedAt: postObj.updatedAt
          };
        }
      });
    } catch (error: any) {
      console.error('CommunityPostService.listCommunityPosts error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        filters
      });
      throw error;
    }
  }

  async getCommunityPostById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid post ID');
    }

    const post = await this.postRepo.findById(id);
    if (!post) {
      throw new NotFoundError('Community post not found');
    }
    return post.toJSON();
  }

  async createCommunityPost(data: CreateCommunityPostDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Invalid user ID');
    }
    if (!Types.ObjectId.isValid(data.categoryId)) {
      throw new ValidationError('Invalid category ID');
    }

    const post = await this.postRepo.create({
      ...data,
      categoryId: new Types.ObjectId(data.categoryId),
      createdBy: new Types.ObjectId(userId),
    } as any);
    return post.toJSON();
  }

  async updateCommunityPost(id: string, data: UpdateCommunityPostDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid post ID');
    }

    const payload: any = { ...data };
    if (data.categoryId && Types.ObjectId.isValid(data.categoryId)) {
      payload.categoryId = new Types.ObjectId(data.categoryId);
    }

    const post = await this.postRepo.update(id, payload);
    if (!post) {
      throw new NotFoundError('Community post not found');
    }
    return post.toJSON();
  }

  async deleteCommunityPost(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid post ID');
    }

    const deleted = await this.postRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError('Community post not found');
    }
  }
}

