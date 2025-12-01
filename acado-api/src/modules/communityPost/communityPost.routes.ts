// src/modules/communityPost/communityPost.routes.ts
import { Router } from 'express';
import { communityPostController } from './communityPost.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import {
  createCommunityPostDto,
  updateCommunityPostDto,
  createCategoryDto,
  updateCategoryDto,
} from './communityPost.dto.js';

const router = Router();

// Category routes
router.get('/categories', communityPostController.listCategories);
router.get('/categories/:id', communityPostController.getCategory);
router.post('/categories', requireAuth, permit('superadmin', 'admin'), validateRequest(createCategoryDto, 'body'), communityPostController.createCategory);
router.put('/categories/:id', requireAuth, permit('superadmin', 'admin'), validateRequest(updateCategoryDto, 'body'), communityPostController.updateCategory);
router.delete('/categories/:id', requireAuth, permit('superadmin', 'admin'), communityPostController.deleteCategory);

// Post routes
router.get('/', communityPostController.list);
router.get('/:id', communityPostController.getOne);
router.post('/', requireAuth, validateRequest(createCommunityPostDto, 'body'), communityPostController.create);
router.put('/:id', requireAuth, validateRequest(updateCommunityPostDto, 'body'), communityPostController.update);
router.patch('/:id', requireAuth, communityPostController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), communityPostController.remove);

export default router;

