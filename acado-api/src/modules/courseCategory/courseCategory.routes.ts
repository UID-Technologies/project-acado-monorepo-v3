// src/modules/courseCategory/courseCategory.routes.ts
import { Router } from 'express';
import { courseCategoryController } from './courseCategory.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createCourseCategoryDto, updateCourseCategoryDto } from './courseCategory.dto.js';

const router = Router();

router.get('/', courseCategoryController.list);
router.get('/:id', courseCategoryController.getOne);

router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(createCourseCategoryDto, 'body'), courseCategoryController.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), validateRequest(updateCourseCategoryDto, 'body'), courseCategoryController.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), courseCategoryController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), courseCategoryController.remove);

export default router;

