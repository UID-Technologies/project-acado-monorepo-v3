// src/routes/field.routes.ts
import { Router } from 'express';
import * as ctrl from '../controllers/field.controller.js';
import validate from '../middleware/validate.js';
import { createFieldSchema, queryFieldsSchema } from '../schemas/field.schema.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';

const r = Router();

r.get('/', validate(queryFieldsSchema), ctrl.search);
r.get('/:id', ctrl.getOne);
r.post('/', requireAuth, permit('superadmin','admin'), validate(createFieldSchema), ctrl.create);
r.put('/:id', requireAuth, permit('superadmin','admin'), ctrl.update);
r.patch('/:id', requireAuth, permit('superadmin','admin'), ctrl.update);
r.delete('/:id', requireAuth, permit('superadmin','admin'), ctrl.remove);

export default r;
