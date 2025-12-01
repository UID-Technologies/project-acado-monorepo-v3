// Central export point for all API modules
export * from './auth.api';
export * from './forms.api';
export * from './universities.api';
export * from './applications.api';
export * from './portfolio.api';
export * from './upload.api';
export * from './masterFields.api';
export * from './users.api';
export * from './universityFormSections.api';
export * from './dashboard.api';
export * from './locations.api';
export * from './courseCategories.api';
export * from './courseTypes.api';
export * from './courseLevels.api';
export * from './learningOutcomes.api';
export * from './courses.api';
export * from './organizations.api';
// Engagement Builder APIs
export * from './wallPost.api';
export * from './communityPost.api';
export * from './reel.api';
export * from './event.api';
export * from './scholarship.api';

// Export axios instance for custom requests
export { default as axiosInstance } from '@/lib/axios';

