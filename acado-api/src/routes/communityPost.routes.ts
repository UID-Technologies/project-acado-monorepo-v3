// src/routes/communityPost.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/communityPost.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';

const router = Router();

// Category routes
router.get('/categories', controller.listCategories);
router.get('/categories/:id', controller.getCategory);
router.post(
  '/categories',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.createCategory
);
router.put(
  '/categories/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.updateCategory
);
router.delete(
  '/categories/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.deleteCategory
);

// Post routes
router.get('/', optionalAuth, controller.list);
router.get('/:id', controller.getOne);
router.post(
  '/',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.create
);
router.put(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.update
);
router.patch(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.update
);
router.delete(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.remove
);

export default router;

