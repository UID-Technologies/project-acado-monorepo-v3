// src/routes/university.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/university.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';

const router = Router();

// Public routes
router.get('/', controller.list);
router.get('/stats/summary', controller.getStats);
router.get('/:id', controller.getOne);
router.get('/:id/courses', controller.getCourses);

// Protected routes (superadmin/admin only)
router.post('/', requireAuth, permit('superadmin', 'admin'), controller.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), controller.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), controller.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), controller.remove);

export default router;

