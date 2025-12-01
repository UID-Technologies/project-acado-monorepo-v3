// src/controllers/dashboard.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/dashboard.service.js';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('📊 Dashboard stats requested by user:', (req as any).user?.id || 'unknown');
    const stats = await service.getDashboardStats();
    console.log('✅ Dashboard stats calculated:', stats);
    res.json(stats);
  } catch (e) {
    console.error('❌ Error in dashboard controller:', e);
    next(e);
  }
};

