// src/controllers/courseCategory.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/courseCategory.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { parentId, includeInactive } = req.query;
    const categories = await service.listCategories({
      parentId: typeof parentId === 'string' ? parentId : undefined,
      includeInactive: includeInactive === 'true',
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await service.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Course category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await service.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await service.updateCategory(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ error: 'Course category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


