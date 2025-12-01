// src/routes/organization.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import validate from '../middleware/validate.js';
import {
  adminInviteSchema,
  createOrganizationSchema,
  organizationStatusSchema,
  updateOrganizationLocationSchema,
  updateOrganizationInfoSchema,
  updateOrganizationContactsSchema,
  updateOrganizationStageSchema,
} from '../schemas/organization.schema.js';
import {
  addOrganizationAdmin,
  createOrganization,
  getOrganization,
  listOrganizations,
  listOrganizationsPublic,
  updateOrganizationSuspension,
  updateOrganizationLocation,
  updateOrganizationOnboardingStage,
  updateOrganizationInfo,
  updateOrganizationContacts,
} from '../controllers/organization.controller.js';

const router = Router();

router.get('/public', listOrganizationsPublic);
router.get('/', requireAuth, permit('superadmin', 'admin'), listOrganizations);
router.get('/:organizationId', requireAuth, permit('superadmin', 'admin'), getOrganization);
router.post(
  '/:organizationId/admins',
  requireAuth,
  permit('superadmin'),
  validate(adminInviteSchema),
  addOrganizationAdmin
);
router.patch(
  '/:organizationId/status',
  requireAuth,
  permit('superadmin'),
  validate(organizationStatusSchema),
  updateOrganizationSuspension
);
router.patch(
  '/:organizationId/location',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateOrganizationLocationSchema),
  updateOrganizationLocation
);
router.patch(
  '/:organizationId/info',
  requireAuth,
  permit('superadmin'),
  validate(updateOrganizationInfoSchema),
  updateOrganizationInfo
);
router.patch(
  '/:organizationId/contacts',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateOrganizationContactsSchema),
  updateOrganizationContacts
);
router.patch(
  '/:organizationId/onboarding-stage',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateOrganizationStageSchema),
  updateOrganizationOnboardingStage
);

router.post(
  '/',
  requireAuth,
  permit('superadmin'),
  validate(createOrganizationSchema),
  createOrganization
);

export default router;


