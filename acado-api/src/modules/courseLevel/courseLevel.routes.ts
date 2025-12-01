// src/modules/courseLevel/courseLevel.routes.ts
import { Router } from 'express';
import { courseLevelController } from './courseLevel.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createCourseLevelDto, updateCourseLevelDto } from './courseLevel.dto.js';

const router = Router();

router.get('/', courseLevelController.list);
router.get('/:id', courseLevelController.getOne);

router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(createCourseLevelDto, 'body'), courseLevelController.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), validateRequest(updateCourseLevelDto, 'body'), courseLevelController.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), courseLevelController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), courseLevelController.remove);

export default router;

