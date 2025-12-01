// src/controllers/application.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/application.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enrichValue = req.query.enrich;
    const enrich = typeof enrichValue === 'string' 
      ? (enrichValue === 'true' || enrichValue === '1')
      : Array.isArray(enrichValue)
      ? false
      : Boolean(enrichValue);
    const result = await service.listApplications({ 
      ...(req.query as any),
      enrich
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enrichValue = req.query.enrich;
    let enrich = true; // Default to true for getOne
    if (typeof enrichValue === 'string') {
      enrich = enrichValue !== 'false' && enrichValue !== '0';
    } else if (Array.isArray(enrichValue)) {
      enrich = false;
    } else if (enrichValue === null || enrichValue === undefined) {
      enrich = true; // Default behavior
    } else {
      // For other types (ParsedQs), default to true
      enrich = true;
    }
    const application = await service.getApplicationById(req.params.id, enrich);
    res.json(application);
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get metadata from request
    const metadata = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };
    
    const application = await service.createApplication(
      { ...req.body, metadata },
      (req as any).user?.id
    );
    res.status(201).json(application);
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const application = await service.updateApplication(req.params.id, req.body);
    res.json(application);
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.deleteApplication(req.params.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const submit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const application = await service.submitApplication(req.params.id);
    res.json(application);
  } catch (e) {
    next(e);
  }
};

export const withdraw = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const application = await service.withdrawApplication(req.params.id);
    res.json(application);
  } catch (e) {
    next(e);
  }
};

export const review = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, reviewNotes } = req.body;
    const application = await service.reviewApplication(
      req.params.id,
      (req as any).user?.id,
      status,
      reviewNotes
    );
    res.json(application);
  } catch (e) {
    next(e);
  }
};

export const stats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statistics = await service.getApplicationStats({
      userId: req.query.userId as string | undefined,
      universityId: req.query.universityId as string | undefined,
      courseId: req.query.courseId as string | undefined,
      formId: req.query.formId as string | undefined
    });
    res.json(statistics);
  } catch (e) {
    next(e);
  }
};

