// src/routes/index.ts
import { Router } from 'express';
import categoryRoutes from './category.routes.js';
import fieldRoutes from './field.routes.js';
import authRoutes from './auth.routes.js';
import formRoutes from './form.routes.js';
import universityRoutes from './university.routes.js';
import courseRoutes from './course.routes.js';
import courseCategoryRoutes from './courseCategory.routes.js';
import courseTypeRoutes from './courseType.routes.js';
import courseLevelRoutes from './courseLevel.routes.js';
import learningOutcomeRoutes from './learningOutcome.routes.js';
import applicationRoutes from './application.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import uploadRoutes from './upload.routes.js';
import locationRoutes from './location.routes.js';
import userRoutes from './user.routes.js';
import organizationRoutes from './organization.routes.js';
import emailRoutes from './email.routes.js';
import wallPostRoutes from './wallPost.routes.js';
import communityPostRoutes from './communityPost.routes.js';
import reelRoutes from './reel.routes.js';
import eventRoutes from './event.routes.js';
import scholarshipRoutes from './scholarship.routes.js';

const r = Router();

r.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Authentication routes
r.use('/auth', authRoutes);

// Dashboard routes
r.use('/dashboard', dashboardRoutes);

// Upload routes
r.use('/upload', uploadRoutes);
r.use('/locations', locationRoutes);
r.use('/emails', emailRoutes);

// JSON Server compatible routes (no /v1 prefix)
r.use('/masterCategories', categoryRoutes);
r.use('/masterFields', fieldRoutes);
r.use('/forms', formRoutes);
r.use('/universities', universityRoutes);
r.use('/courses', courseRoutes);
r.use('/organizations', organizationRoutes);
r.use('/course-categories', courseCategoryRoutes);
r.use('/course-types', courseTypeRoutes);
r.use('/course-levels', courseLevelRoutes);
r.use('/learning-outcomes', learningOutcomeRoutes);
r.use('/applications', applicationRoutes);
r.use('/users', userRoutes);
// Engagement Builder routes
r.use('/wall-posts', wallPostRoutes);
r.use('/community-posts', communityPostRoutes);
r.use('/reels', reelRoutes);
r.use('/events', eventRoutes);
r.use('/scholarships', scholarshipRoutes);

// Legacy v1 routes for backward compatibility
r.use('/v1/categories', categoryRoutes);
r.use('/v1/fields', fieldRoutes);
r.use('/v1/forms', formRoutes);
r.use('/v1/universities', universityRoutes);
r.use('/v1/courses', courseRoutes);
r.use('/v1/organizations', organizationRoutes);
r.use('/v1/course-categories', courseCategoryRoutes);
r.use('/v1/course-types', courseTypeRoutes);
r.use('/v1/course-levels', courseLevelRoutes);
r.use('/v1/learning-outcomes', learningOutcomeRoutes);
r.use('/v1/applications', applicationRoutes);
r.use('/v1/users', userRoutes);
r.use('/v1/locations', locationRoutes);
r.use('/v1/emails', emailRoutes);
// Engagement Builder v1 routes
r.use('/v1/wall-posts', wallPostRoutes);
r.use('/v1/community-posts', communityPostRoutes);
r.use('/v1/reels', reelRoutes);
r.use('/v1/events', eventRoutes);
r.use('/v1/scholarships', scholarshipRoutes);

export default r;
