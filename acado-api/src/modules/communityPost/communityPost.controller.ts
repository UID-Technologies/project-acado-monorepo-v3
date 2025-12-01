// src/modules/communityPost/communityPost.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CommunityPostService } from './communityPost.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import {
  listCommunityPostsDto,
  createCommunityPostDto,
  updateCommunityPostDto,
  createCategoryDto,
  updateCategoryDto,
} from './communityPost.dto.js';

export class CommunityPostController {
  private postService: CommunityPostService;

  constructor() {
    this.postService = new CommunityPostService();
  }

  listCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.postService.listCategories();
      res.json(successResponse(categories));
    } catch (error) {
      next(error);
    }
  };

  getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.postService.getCategoryById(req.params.id);
      res.json(successResponse(category));
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createCategoryDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const category = await this.postService.createCategory(data, userId);
      res.status(201).json(successResponse(category));
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateCategoryDto.parse(req.body);
      const category = await this.postService.updateCategory(req.params.id, data);
      res.json(successResponse(category));
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.postService.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = listCommunityPostsDto.parse(req.query);
      const posts = await this.postService.listCommunityPosts(filters);
      res.json(successResponse(posts));
    } catch (error: any) {
      console.error('CommunityPostController.list error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        query: req.query
      });
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.getCommunityPostById(req.params.id);
      res.json(successResponse(post));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createCommunityPostDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const post = await this.postService.createCommunityPost(data, userId);
      res.status(201).json(successResponse(post));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateCommunityPostDto.parse(req.body);
      const post = await this.postService.updateCommunityPost(req.params.id, data);
      res.json(successResponse(post));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.postService.deleteCommunityPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const communityPostController = new CommunityPostController();

