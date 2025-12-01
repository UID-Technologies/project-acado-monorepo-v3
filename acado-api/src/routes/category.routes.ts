// src/routes/category.routes.ts
import { Router } from 'express';
import * as ctrl from '../controllers/category.controller.js';
import validate from '../middleware/validate.js';
import { addSubcategorySchema, createCategorySchema, deleteSubcategorySchema } from '../schemas/category.schema.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';

const r = Router();

// Category routes
r.get('/', ctrl.list);
r.get('/:id', ctrl.getOne);
r.post('/', requireAuth, permit('superadmin','admin'), validate(createCategorySchema), ctrl.create);
r.put('/:id', requireAuth, permit('superadmin','admin'), ctrl.update);
r.patch('/:id', requireAuth, permit('superadmin','admin'), ctrl.update);
r.delete('/:id', requireAuth, permit('superadmin','admin'), ctrl.remove);

// Subcategory routes
r.post('/:id/subcategories', requireAuth, permit('superadmin','admin'), validate(addSubcategorySchema), ctrl.addSub);
r.put('/:id/subcategories/:subId', requireAuth, permit('superadmin','admin'), ctrl.updateSub);
r.patch('/:id/subcategories/:subId', requireAuth, permit('superadmin','admin'), ctrl.updateSub);
r.delete('/:id/subcategories/:subId', requireAuth, permit('superadmin','admin'), validate(deleteSubcategorySchema), ctrl.removeSub);

export default r;
