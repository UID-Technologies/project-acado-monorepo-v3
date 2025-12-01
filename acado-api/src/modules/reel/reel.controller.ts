// src/modules/reel/reel.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ReelService } from './reel.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listReelsDto, createReelDto, updateReelDto } from './reel.dto.js';

export class ReelController {
  private reelService: ReelService;

  constructor() {
    this.reelService = new ReelService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = listReelsDto.parse(req.query);
      const reels = await this.reelService.listReels(filters);
      res.json(successResponse(reels));
    } catch (error: any) {
      console.error('ReelController.list error:', {
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
      const reel = await this.reelService.getReelById(req.params.id);
      res.json(successResponse(reel));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createReelDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const reel = await this.reelService.createReel(data, userId);
      res.status(201).json(successResponse(reel));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateReelDto.parse(req.body);
      const reel = await this.reelService.updateReel(req.params.id, data);
      res.json(successResponse(reel));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.reelService.deleteReel(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const reelController = new ReelController();

