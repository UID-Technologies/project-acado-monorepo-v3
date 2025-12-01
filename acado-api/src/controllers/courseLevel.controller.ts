// src/controllers/courseLevel.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/courseLevel.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const levels = await service.listLevels(includeInactive);
    res.json(levels);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const level = await service.getLevelById(req.params.id);
    if (!level) {
      return res.status(404).json({ error: 'Course level not found' });
    }
    res.json(level);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const level = await service.createLevel(req.body);
    res.status(201).json(level);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const level = await service.updateLevel(req.params.id, req.body);
    if (!level) {
      return res.status(404).json({ error: 'Course level not found' });
    }
    res.json(level);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteLevel(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


