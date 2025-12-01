// src/loaders/routes.ts
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from '../docs/openapi.js';

// Import new module routes (migrated)
import authRoutes from '../modules/auth/auth.routes.js';
import categoryRoutes from '../modules/category/category.routes.js';
import locationRoutes from '../modules/location/location.routes.js';
import fieldRoutes from '../modules/field/field.routes.js';
import universityRoutes from '../modules/university/university.routes.js';
import courseCategoryRoutes from '../modules/courseCategory/courseCategory.routes.js';
import courseTypeRoutes from '../modules/courseType/courseType.routes.js';
import courseLevelRoutes from '../modules/courseLevel/courseLevel.routes.js';
import learningOutcomeRoutes from '../modules/learningOutcome/learningOutcome.routes.js';
import courseRoutes from '../modules/course/course.routes.js';
import formRoutes from '../modules/form/form.routes.js';
import applicationRoutes from '../modules/application/application.routes.js';
import organizationRoutes from '../modules/organization/organization.routes.js';
import wallPostRoutes from '../modules/wallPost/wallPost.routes.js';
import communityPostRoutes from '../modules/communityPost/communityPost.routes.js';
import reelRoutes from '../modules/reel/reel.routes.js';
import eventRoutes from '../modules/event/event.routes.js';
import scholarshipRoutes from '../modules/scholarship/scholarship.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
import uploadRoutes from '../modules/upload/upload.routes.js';
import emailRoutes from '../modules/email/email.routes.js';
import userRoutes from '../modules/user/user.routes.js';

export function loadRoutes(app: Express): void {
  // API Documentation
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

  // Authentication routes
  app.use('/auth', authRoutes);

  // Dashboard routes
  app.use('/dashboard', dashboardRoutes);

  // Upload routes
  app.use('/upload', uploadRoutes);

  // Location routes
  app.use('/locations', locationRoutes);

  // Email routes
  app.use('/emails', emailRoutes);

  // Master data routes
  app.use('/masterCategories', categoryRoutes);
  app.use('/masterFields', fieldRoutes);
  app.use('/forms', formRoutes);
  app.use('/universities', universityRoutes);
  app.use('/courses', courseRoutes);
  app.use('/organizations', organizationRoutes);
  app.use('/course-categories', courseCategoryRoutes);
  app.use('/course-types', courseTypeRoutes);
  app.use('/course-levels', courseLevelRoutes);
  app.use('/learning-outcomes', learningOutcomeRoutes);
  app.use('/applications', applicationRoutes);
  app.use('/users', userRoutes);

  // Engagement Builder routes
  app.use('/wall-posts', wallPostRoutes);
  app.use('/community-posts', communityPostRoutes);
  app.use('/reels', reelRoutes);
  app.use('/events', eventRoutes);
  app.use('/scholarships', scholarshipRoutes);
}

