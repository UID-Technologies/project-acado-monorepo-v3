// src/modules/courseType/courseType.routes.ts
import { Router } from 'express';
import { courseTypeController } from './courseType.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createCourseTypeDto, updateCourseTypeDto } from './courseType.dto.js';

const router = Router();

router.get('/', courseTypeController.list);
router.get('/:id', courseTypeController.getOne);

router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(createCourseTypeDto, 'body'), courseTypeController.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), validateRequest(updateCourseTypeDto, 'body'), courseTypeController.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), courseTypeController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), courseTypeController.remove);

export default router;

