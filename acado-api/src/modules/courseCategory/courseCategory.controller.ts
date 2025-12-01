// src/modules/courseCategory/courseCategory.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CourseCategoryService } from './courseCategory.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listCourseCategoriesDto, createCourseCategoryDto, updateCourseCategoryDto } from './courseCategory.dto.js';

export class CourseCategoryController {
  private categoryService: CourseCategoryService;

  constructor() {
    this.categoryService = new CourseCategoryService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = listCourseCategoriesDto.parse(req.query);
      const categories = await this.categoryService.listCategories(params);
      res.json(successResponse(categories));
    } catch (error: any) {
      // Log error for debugging
      console.error('CourseCategory list error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        errors: error?.errors,
        query: req.query,
      });
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      res.json(successResponse(category));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createCourseCategoryDto.parse(req.body);
      const category = await this.categoryService.createCategory(data);
      res.status(201).json(successResponse(category));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateCourseCategoryDto.parse(req.body);
      const category = await this.categoryService.updateCategory(req.params.id, data);
      res.json(successResponse(category));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const courseCategoryController = new CourseCategoryController();

