// src/controllers/category.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/category.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeCount = req.query.include === 'count';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const data = await service.listCategories(includeCount, search);
    res.json(data); // Return direct data, no wrapper
  } catch (e) { next(e); }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getCategoryById(req.params.id);
    res.json(data);
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.createCategory(req.body, (req as any).user?.id);
    res.status(201).json(data); // Return direct data
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.updateCategory(req.params.id, req.body);
    res.json(data);
  } catch (e) { next(e); }
};

export const addSub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await service.addSubcategory(req.params.id, req.body);
    res.status(201).json(sub);
  } catch (e) { next(e); }
};

export const updateSub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await service.updateSubcategory(req.params.id, req.params.subId, req.body);
    res.json(sub);
  } catch (e) { next(e); }
};

export const removeSub = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteSubcategory(req.params.id, req.params.subId);
    res.status(204).send();
  } catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cascade = req.query.cascade === 'true';
    await service.deleteCategory(req.params.id, cascade);
    res.status(204).send();
  } catch (e) { next(e); }
};
