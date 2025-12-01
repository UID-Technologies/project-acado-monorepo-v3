// src/modules/scholarship/scholarship.routes.ts
import { Router } from 'express';
import { scholarshipController } from './scholarship.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createScholarshipDto, updateScholarshipDto } from './scholarship.dto.js';

const router = Router();

router.get('/', scholarshipController.list);
router.get('/:id', scholarshipController.getOne);
router.post('/', requireAuth, validateRequest(createScholarshipDto, 'body'), scholarshipController.create);
router.put('/:id', requireAuth, validateRequest(updateScholarshipDto, 'body'), scholarshipController.update);
router.patch('/:id', requireAuth, scholarshipController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), scholarshipController.remove);
router.post('/:id/views', scholarshipController.incrementViews);
router.post('/:id/applications', requireAuth, scholarshipController.incrementApplications);

export default router;

