// src/modules/category/category.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const includeCount = req.query.include === 'count';
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const data = await this.categoryService.listCategories(includeCount, search);
      res.json(successResponse(data));
    } catch (error: any) {
      const includeCount = req.query.include === 'count';
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      console.error('CategoryController.list error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        includeCount,
        search
      });
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.categoryService.getCategoryById(req.params.id);
      res.json(successResponse(data));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const data = await this.categoryService.createCategory(req.body, userId);
      res.status(201).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.categoryService.updateCategory(req.params.id, req.body);
      res.json(successResponse(data));
    } catch (error) {
      next(error);
    }
  };

  addSub = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sub = await this.categoryService.addSubcategory(req.params.id, req.body);
      res.status(201).json(successResponse(sub));
    } catch (error) {
      next(error);
    }
  };

  updateSub = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sub = await this.categoryService.updateSubcategory(req.params.id, req.params.subId, req.body);
      res.json(successResponse(sub));
    } catch (error) {
      next(error);
    }
  };

  removeSub = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteSubcategory(req.params.id, req.params.subId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cascade = req.query.cascade === 'true';
      await this.categoryService.deleteCategory(req.params.id, cascade);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const categoryController = new CategoryController();

