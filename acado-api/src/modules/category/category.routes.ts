// src/modules/category/category.routes.ts
import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import {
  createCategoryDto,
  addSubcategoryDto,
} from './category.dto.js';

const router = Router();

// Category routes
router.get('/', categoryController.list);
router.get('/:id', categoryController.getOne);
router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(createCategoryDto, 'body'), categoryController.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), categoryController.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), categoryController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), categoryController.remove);

// Subcategory routes
router.post('/:id/subcategories', requireAuth, permit('superadmin', 'admin'), validateRequest(addSubcategoryDto, 'body'), categoryController.addSub);
router.put('/:id/subcategories/:subId', requireAuth, permit('superadmin', 'admin'), categoryController.updateSub);
router.patch('/:id/subcategories/:subId', requireAuth, permit('superadmin', 'admin'), categoryController.updateSub);
router.delete('/:id/subcategories/:subId', requireAuth, permit('superadmin', 'admin'), categoryController.removeSub);

export default router;

