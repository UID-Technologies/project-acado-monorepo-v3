// src/modules/university/university.routes.ts
import { Router } from 'express';
import { universityController } from './university.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createUniversityDto } from './university.dto.js';

const router = Router();

// Public routes
router.get('/', universityController.list);
router.get('/stats/summary', universityController.getStats);
router.get('/:id', universityController.getOne);
router.get('/:id/courses', universityController.getCourses);

// Protected routes (superadmin/admin only)
router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(createUniversityDto, 'body'), universityController.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), universityController.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), universityController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), universityController.remove);

export default router;

