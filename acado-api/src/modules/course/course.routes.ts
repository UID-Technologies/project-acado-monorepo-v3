// src/modules/course/course.routes.ts
import { Router } from 'express';
import { courseController } from './course.controller.js';
import { requireAuth, optionalAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createCourseDto, updateCourseDto } from './course.dto.js';
// Note: universityScope middleware may need to be migrated or recreated

const router = Router();

// Public routes (optionalAuth allows both authenticated and unauthenticated access)
router.get('/', optionalAuth, courseController.list);
router.get('/:id', courseController.getOne);

// Protected routes (superadmin/admin)
router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(createCourseDto, 'body'), courseController.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), validateRequest(updateCourseDto, 'body'), courseController.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), courseController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), courseController.remove);

export default router;

