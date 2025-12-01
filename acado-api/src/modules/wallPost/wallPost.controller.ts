// src/modules/wallPost/wallPost.controller.ts
import { Request, Response, NextFunction } from 'express';
import { WallPostService } from './wallPost.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listWallPostsDto, createWallPostDto, updateWallPostDto } from './wallPost.dto.js';

export class WallPostController {
  private wallPostService: WallPostService;

  constructor() {
    this.wallPostService = new WallPostService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = listWallPostsDto.parse(req.query);
      const posts = await this.wallPostService.listWallPosts(filters);
      res.json(successResponse(posts));
    } catch (error: any) {
      console.error('WallPostController.list error:', {
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
      const post = await this.wallPostService.getWallPostById(req.params.id);
      res.json(successResponse(post));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createWallPostDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const post = await this.wallPostService.createWallPost(data, userId);
      res.status(201).json(successResponse(post));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateWallPostDto.parse(req.body);
      const post = await this.wallPostService.updateWallPost(req.params.id, data);
      res.json(successResponse(post));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.wallPostService.deleteWallPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const wallPostController = new WallPostController();

