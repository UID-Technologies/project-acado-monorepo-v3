// src/modules/course/course.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CourseService } from './course.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listCoursesDto, createCourseDto, updateCourseDto } from './course.dto.js';

export class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = listCoursesDto.parse(req.query);
      const courses = await this.courseService.listCourses(filters);
      res.json(successResponse(courses));
    } catch (error: any) {
      // Log error for debugging
      console.error('CourseController list error:', {
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
      const course = await this.courseService.getCourseById(req.params.id);
      res.json(successResponse(course));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createCourseDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const course = await this.courseService.createCourse(data, userId);
      res.status(201).json(successResponse(course));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateCourseDto.parse(req.body);
      const course = await this.courseService.updateCourse(req.params.id, data);
      res.json(successResponse(course));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.courseService.deleteCourse(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const courseController = new CourseController();

