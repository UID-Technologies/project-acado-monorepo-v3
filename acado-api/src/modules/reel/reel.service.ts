// src/modules/reel/reel.service.ts
import { Types } from 'mongoose';
import { ReelRepository } from './reel.repo.js';
import { NotFoundError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateReelDto,
  UpdateReelDto,
  ListReelsDto,
} from './reel.dto.js';

export class ReelService {
  private reelRepo: ReelRepository;

  constructor() {
    this.reelRepo = new ReelRepository();
  }

  async listReels(filters: ListReelsDto = {}) {
    const { status, visibility, category, search } = filters;

    let reels;
    if (status) {
      reels = await this.reelRepo.findByStatus(status);
    } else if (visibility) {
      reels = await this.reelRepo.findByVisibility(visibility);
    } else if (category) {
      reels = await this.reelRepo.findByCategory(category);
    } else {
      reels = await this.reelRepo.findAll();
    }

    // Apply search filter if provided
    if (search) {
      reels = reels.filter(r => {
        const json = r.toJSON();
        return json.title?.toLowerCase().includes(search.toLowerCase()) ||
               json.description?.toLowerCase().includes(search.toLowerCase()) ||
               json.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      });
    }

    return reels.map(r => r.toJSON());
  }

  async getReelById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid reel ID');
    }

    const reel = await this.reelRepo.findById(id);
    if (!reel) {
      throw new NotFoundError('Reel not found');
    }
    return reel.toJSON();
  }

  async createReel(data: CreateReelDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Invalid user ID');
    }

    const payload: any = {
      ...data,
      createdBy: new Types.ObjectId(userId),
    };

    if (data.status === 'active' && !data.scheduledPublishAt) {
      payload.publishedAt = new Date();
    }

    const reel = await this.reelRepo.create(payload);
    return reel.toJSON();
  }

  async updateReel(id: string, data: UpdateReelDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid reel ID');
    }

    const reel = await this.reelRepo.update(id, data);
    if (!reel) {
      throw new NotFoundError('Reel not found');
    }
    return reel.toJSON();
  }

  async deleteReel(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid reel ID');
    }

    const deleted = await this.reelRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError('Reel not found');
    }
  }
}

