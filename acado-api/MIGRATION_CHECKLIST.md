# Migration Checklist

Use this checklist to track progress during the migration.

## Phase 1: Foundation Setup

### Configuration Layer
- [ ] Create `src/config/index.ts`
- [ ] Move `src/db/mongoose.ts` → `src/config/db.ts`
- [ ] Move `src/utils/logger.ts` → `src/config/logger.ts`
- [ ] Enhance `src/config/env.ts`
- [ ] Test configuration loading

### Core HTTP Utilities
- [ ] Create `src/core/http/ApiError.ts`
- [ ] Create `src/core/http/ApiResponse.ts`
- [ ] Update error handling to use new classes
- [ ] Test error responses

### Core Utilities
- [ ] Create `src/core/utils/crypto.ts`
- [ ] Create `src/core/utils/date.ts`
- [ ] Create `src/core/utils/file.ts`
- [ ] Create `src/core/utils/validator.ts`
- [ ] Test utilities

### Infrastructure Layer
- [ ] Create `src/infrastructure/database/mongo/connection.ts`
- [ ] Create `src/infrastructure/database/mongo/BaseRepository.ts`
- [ ] Create `src/infrastructure/database/mongo/index.ts`
- [ ] Create `src/infrastructure/storage/azure/blobStorage.ts`
- [ ] Test database connection
- [ ] Test base repository

## Phase 2: Middleware Refactoring

### Core Middleware
- [ ] Create `src/core/middleware/errorHandler.ts`
- [ ] Create `src/core/middleware/authMiddleware.ts`
- [ ] Create `src/core/middleware/rbacMiddleware.ts`
- [ ] Create `src/core/middleware/validateMiddleware.ts`
- [ ] Create `src/core/middleware/rateLimiter.ts`
- [ ] Create `src/core/middleware/requestLogger.ts`
- [ ] Create `src/core/middleware/universityScopeMiddleware.ts`
- [ ] Test all middleware
- [ ] Update imports in app.ts

## Phase 3: Module Migration

### Auth Module
- [ ] Create `src/modules/auth/` directory
- [ ] Move auth routes
- [ ] Move auth controller
- [ ] Move auth service
- [ ] Create `auth.dto.ts`
- [ ] Update imports
- [ ] Test auth endpoints
- [ ] Test token generation
- [ ] Test token validation

### User Module
- [ ] Create `src/modules/user/` directory
- [ ] Move user model
- [ ] Move user routes
- [ ] Move user controller
- [ ] Move user service
- [ ] Create `user.repo.ts`
- [ ] Create `user.dto.ts`
- [ ] Refactor service to use repository
- [ ] Update imports
- [ ] Test user CRUD
- [ ] Test user queries

### Category Module
- [ ] Create `src/modules/category/` directory
- [ ] Move category model
- [ ] Move category routes
- [ ] Move category controller
- [ ] Move category service
- [ ] Create `category.repo.ts`
- [ ] Create `category.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test category endpoints

### Field Module
- [ ] Create `src/modules/field/` directory
- [ ] Move field model
- [ ] Move field routes
- [ ] Move field controller
- [ ] Move field service
- [ ] Create `field.repo.ts`
- [ ] Create `field.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test field endpoints

### Location Module
- [ ] Create `src/modules/location/` directory
- [ ] Move location model
- [ ] Move location routes
- [ ] Move location controller
- [ ] Move location service
- [ ] Create `location.repo.ts`
- [ ] Create `location.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test location endpoints

### Organization Module
- [ ] Create `src/modules/organization/` directory
- [ ] Move organization model
- [ ] Move organization routes
- [ ] Move organization controller
- [ ] Move organization service
- [ ] Create `organization.repo.ts`
- [ ] Create `organization.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test organization endpoints

### University Module
- [ ] Create `src/modules/university/` directory
- [ ] Move university model
- [ ] Move university routes
- [ ] Move university controller
- [ ] Move university service
- [ ] Create `university.repo.ts`
- [ ] Create `university.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test university endpoints

### Course Category Module
- [ ] Create `src/modules/courseCategory/` directory
- [ ] Move courseCategory model
- [ ] Move courseCategory routes
- [ ] Move courseCategory controller
- [ ] Move courseCategory service
- [ ] Create `courseCategory.repo.ts`
- [ ] Create `courseCategory.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test courseCategory endpoints

### Course Type Module
- [ ] Create `src/modules/courseType/` directory
- [ ] Move courseType model
- [ ] Move courseType routes
- [ ] Move courseType controller
- [ ] Move courseType service
- [ ] Create `courseType.repo.ts`
- [ ] Create `courseType.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test courseType endpoints

### Course Level Module
- [ ] Create `src/modules/courseLevel/` directory
- [ ] Move courseLevel model
- [ ] Move courseLevel routes
- [ ] Move courseLevel controller
- [ ] Move courseLevel service
- [ ] Create `courseLevel.repo.ts`
- [ ] Create `courseLevel.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test courseLevel endpoints

### Learning Outcome Module
- [ ] Create `src/modules/learningOutcome/` directory
- [ ] Move learningOutcome model
- [ ] Move learningOutcome routes
- [ ] Move learningOutcome controller
- [ ] Move learningOutcome service
- [ ] Create `learningOutcome.repo.ts`
- [ ] Create `learningOutcome.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test learningOutcome endpoints

### Course Module
- [ ] Create `src/modules/course/` directory
- [ ] Move course model
- [ ] Move course routes
- [ ] Move course controller
- [ ] Move course service
- [ ] Create `course.repo.ts`
- [ ] Create `course.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test course endpoints

### Form Module
- [ ] Create `src/modules/form/` directory
- [ ] Move form model
- [ ] Move form routes
- [ ] Move form controller
- [ ] Move form service
- [ ] Create `form.repo.ts`
- [ ] Create `form.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test form endpoints

### Application Module
- [ ] Create `src/modules/application/` directory
- [ ] Move application model
- [ ] Move application routes
- [ ] Move application controller
- [ ] Move application service
- [ ] Create `application.repo.ts`
- [ ] Create `application.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test application endpoints

### Dashboard Module
- [ ] Create `src/modules/dashboard/` directory
- [ ] Move dashboard routes
- [ ] Move dashboard controller
- [ ] Move dashboard service
- [ ] Create `dashboard.dto.ts`
- [ ] Update imports
- [ ] Test dashboard endpoints

### Upload Module
- [ ] Create `src/modules/upload/` directory
- [ ] Move upload routes
- [ ] Move upload controller
- [ ] Create `upload.service.ts`
- [ ] Create `upload.dto.ts`
- [ ] Extract upload logic from controller
- [ ] Update imports
- [ ] Test upload endpoints

### Email Module
- [ ] Create `src/modules/email/` directory
- [ ] Move email routes
- [ ] Move email controller
- [ ] Move email service
- [ ] Create `email.dto.ts`
- [ ] Update imports
- [ ] Test email endpoints

### Wall Post Module
- [ ] Create `src/modules/wallPost/` directory
- [ ] Move wallPost model
- [ ] Move wallPost routes
- [ ] Move wallPost controller
- [ ] Move wallPost service
- [ ] Create `wallPost.repo.ts`
- [ ] Create `wallPost.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test wallPost endpoints

### Community Post Module
- [ ] Create `src/modules/communityPost/` directory
- [ ] Move communityPost model
- [ ] Move communityPost routes
- [ ] Move communityPost controller
- [ ] Move communityPost service
- [ ] Create `communityPost.repo.ts`
- [ ] Create `communityPost.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test communityPost endpoints

### Reel Module
- [ ] Create `src/modules/reel/` directory
- [ ] Move reel model
- [ ] Move reel routes
- [ ] Move reel controller
- [ ] Move reel service
- [ ] Create `reel.repo.ts`
- [ ] Create `reel.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test reel endpoints

### Event Module
- [ ] Create `src/modules/event/` directory
- [ ] Move event model
- [ ] Move event routes
- [ ] Move event controller
- [ ] Move event service
- [ ] Create `event.repo.ts`
- [ ] Create `event.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test event endpoints

### Scholarship Module
- [ ] Create `src/modules/scholarship/` directory
- [ ] Move scholarship model
- [ ] Move scholarship routes
- [ ] Move scholarship controller
- [ ] Move scholarship service
- [ ] Create `scholarship.repo.ts`
- [ ] Create `scholarship.dto.ts`
- [ ] Refactor service
- [ ] Update imports
- [ ] Test scholarship endpoints

## Phase 4: Loaders & Route Registration

### Loaders
- [ ] Create `src/loaders/express.ts`
- [ ] Create `src/loaders/routes.ts`
- [ ] Create `src/loaders/index.ts`
- [ ] Update `src/app.ts`
- [ ] Update `src/server.ts`
- [ ] Test application startup
- [ ] Test route registration

## Phase 5: Shared Layer

### Shared Components
- [ ] Move schemas to `src/shared/dtos/`
- [ ] Convert schemas to DTOs
- [ ] Move types to `src/shared/types/`
- [ ] Create `src/shared/constants/`
- [ ] Create `src/shared/exceptions/`
- [ ] Update all imports
- [ ] Test shared components

## Phase 6: Testing & Cleanup

### Testing
- [ ] Write unit tests for repositories
- [ ] Write unit tests for services
- [ ] Write unit tests for controllers
- [ ] Write integration tests
- [ ] Write E2E tests
- [ ] Achieve > 80% code coverage
- [ ] Run all tests

### Cleanup
- [ ] Remove old `src/controllers/` directory
- [ ] Remove old `src/services/` directory
- [ ] Remove old `src/routes/` directory (except index.ts)
- [ ] Remove old `src/models/` directory
- [ ] Remove old `src/middleware/` directory
- [ ] Remove old `src/utils/` directory
- [ ] Remove old `src/db/` directory
- [ ] Remove old `src/schemas/` directory
- [ ] Update all remaining imports
- [ ] Verify no broken imports

### Documentation
- [ ] Update README.md
- [ ] Update API documentation
- [ ] Create architecture documentation
- [ ] Update deployment docs
- [ ] Document new patterns
- [ ] Create migration notes

## Phase 7: Final Verification

### Testing
- [ ] Run all unit tests
- [ ] Run all integration tests
- [ ] Run all E2E tests
- [ ] Manual API testing
- [ ] Performance testing
- [ ] Load testing
- [ ] Security testing

### Code Quality
- [ ] Run linter
- [ ] Fix all linting errors
- [ ] Run type checking
- [ ] Fix all type errors
- [ ] Code review
- [ ] Performance review

### Deployment
- [ ] Test in staging
- [ ] Verify all endpoints work
- [ ] Test authentication flow
- [ ] Test authorization
- [ ] Test file uploads
- [ ] Monitor error logs
- [ ] Performance monitoring

## Success Metrics

- [ ] All modules migrated
- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] No breaking API changes
- [ ] Performance maintained
- [ ] Documentation complete
- [ ] Team trained
- [ ] Production deployment successful

## Notes

Use this section to track issues, blockers, and decisions made during migration:

---

**Migration Start Date:** _______________

**Expected Completion Date:** _______________

**Actual Completion Date:** _______________

