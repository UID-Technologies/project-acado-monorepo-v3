# File Mapping: Current → New Structure

## Configuration Layer

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/config/env.ts` | `src/config/env.ts` | Keep, enhance |
| `src/db/mongoose.ts` | `src/config/db.ts` | Rename and enhance |
| `src/utils/logger.ts` | `src/config/logger.ts` | Move to config |
| - | `src/config/index.ts` | New: Export all config |

## Core Layer

### HTTP Utilities

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/utils/ApiError.ts` | `src/core/http/ApiError.ts` | Move, enhance with error codes |
| - | `src/core/http/ApiResponse.ts` | New: Standardized responses |

### Core Utilities

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| - | `src/core/utils/crypto.ts` | New: Password hashing, token generation |
| - | `src/core/utils/date.ts` | New: Date formatting, validation |
| - | `src/core/utils/file.ts` | New: File validation, processing |
| - | `src/core/utils/validator.ts` | New: Validation helpers |

### Core Middleware

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/middleware/error.ts` | `src/core/middleware/errorHandler.ts` | Refactor |
| `src/middleware/auth.ts` | `src/core/middleware/authMiddleware.ts` | Refactor |
| `src/middleware/rateLimit.ts` | `src/core/middleware/rateLimiter.ts` | Move |
| `src/middleware/rbac.ts` | `src/core/middleware/rbacMiddleware.ts` | Move |
| `src/middleware/validate.ts` | `src/core/middleware/validateMiddleware.ts` | Move |
| `src/middleware/universityScope.ts` | `src/core/middleware/universityScopeMiddleware.ts` | Move |
| - | `src/core/middleware/requestLogger.ts` | New: Enhanced request logging |

## Infrastructure Layer

### Database

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/db/mongoose.ts` | `src/infrastructure/database/mongo/connection.ts` | Move, enhance |
| - | `src/infrastructure/database/mongo/BaseRepository.ts` | New: Base repository class |
| - | `src/infrastructure/database/mongo/index.ts` | New: Exports |

### Storage

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| Upload logic in controllers | `src/infrastructure/storage/azure/blobStorage.ts` | Extract upload logic |

## Modules (Domain Layer)

### Auth Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/routes/auth.routes.ts` | `src/modules/auth/auth.routes.ts` | Move |
| `src/controllers/auth.controller.ts` | `src/modules/auth/auth.controller.ts` | Move |
| `src/services/auth.service.ts` | `src/modules/auth/auth.service.ts` | Move |
| - | `src/modules/auth/auth.dto.ts` | New: Request/response DTOs |

### User Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/User.ts` | `src/modules/user/user.model.ts` | Move |
| `src/routes/user.routes.ts` | `src/modules/user/user.routes.ts` | Move |
| `src/controllers/user.controller.ts` | `src/modules/user/user.controller.ts` | Move |
| `src/services/user.service.ts` | `src/modules/user/user.service.ts` | Move |
| - | `src/modules/user/user.repo.ts` | New: Repository pattern |
| - | `src/modules/user/user.dto.ts` | New: DTOs |

### Course Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Course.ts` | `src/modules/course/course.model.ts` | Move |
| `src/routes/course.routes.ts` | `src/modules/course/course.routes.ts` | Move |
| `src/controllers/course.controller.ts` | `src/modules/course/course.controller.ts` | Move |
| `src/services/course.service.ts` | `src/modules/course/course.service.ts` | Move |
| - | `src/modules/course/course.repo.ts` | New: Repository |
| - | `src/modules/course/course.dto.ts` | New: DTOs |

### University Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/University.ts` | `src/modules/university/university.model.ts` | Move |
| `src/routes/university.routes.ts` | `src/modules/university/university.routes.ts` | Move |
| `src/controllers/university.controller.ts` | `src/modules/university/university.controller.ts` | Move |
| `src/services/university.service.ts` | `src/modules/university/university.service.ts` | Move |
| - | `src/modules/university/university.repo.ts` | New: Repository |
| - | `src/modules/university/university.dto.ts` | New: DTOs |

### Application Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Application.ts` | `src/modules/application/application.model.ts` | Move |
| `src/routes/application.routes.ts` | `src/modules/application/application.routes.ts` | Move |
| `src/controllers/application.controller.ts` | `src/modules/application/application.controller.ts` | Move |
| `src/services/application.service.ts` | `src/modules/application/application.service.ts` | Move |
| - | `src/modules/application/application.repo.ts` | New: Repository |
| - | `src/modules/application/application.dto.ts` | New: DTOs |

### Form Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Form.ts` | `src/modules/form/form.model.ts` | Move |
| `src/routes/form.routes.ts` | `src/modules/form/form.routes.ts` | Move |
| `src/controllers/form.controller.ts` | `src/modules/form/form.controller.ts` | Move |
| `src/services/form.service.ts` | `src/modules/form/form.service.ts` | Move |
| - | `src/modules/form/form.repo.ts` | New: Repository |
| - | `src/modules/form/form.dto.ts` | New: DTOs |

### Organization Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Organization.ts` | `src/modules/organization/organization.model.ts` | Move |
| `src/routes/organization.routes.ts` | `src/modules/organization/organization.routes.ts` | Move |
| `src/controllers/organization.controller.ts` | `src/modules/organization/organization.controller.ts` | Move |
| `src/services/organization.service.ts` | `src/modules/organization/organization.service.ts` | Move |
| - | `src/modules/organization/organization.repo.ts` | New: Repository |
| - | `src/modules/organization/organization.dto.ts` | New: DTOs |

### Category Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Category.ts` | `src/modules/category/category.model.ts` | Move |
| `src/routes/category.routes.ts` | `src/modules/category/category.routes.ts` | Move |
| `src/controllers/category.controller.ts` | `src/modules/category/category.controller.ts` | Move |
| `src/services/category.service.ts` | `src/modules/category/category.service.ts` | Move |
| - | `src/modules/category/category.repo.ts` | New: Repository |
| - | `src/modules/category/category.dto.ts` | New: DTOs |

### Field Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Field.ts` | `src/modules/field/field.model.ts` | Move |
| `src/routes/field.routes.ts` | `src/modules/field/field.routes.ts` | Move |
| `src/controllers/field.controller.ts` | `src/modules/field/field.controller.ts` | Move |
| `src/services/field.service.ts` | `src/modules/field/field.service.ts` | Move |
| - | `src/modules/field/field.repo.ts` | New: Repository |
| - | `src/modules/field/field.dto.ts` | New: DTOs |

### Course Category Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/CourseCategory.ts` | `src/modules/courseCategory/courseCategory.model.ts` | Move |
| `src/routes/courseCategory.routes.ts` | `src/modules/courseCategory/courseCategory.routes.ts` | Move |
| `src/controllers/courseCategory.controller.ts` | `src/modules/courseCategory/courseCategory.controller.ts` | Move |
| `src/services/courseCategory.service.ts` | `src/modules/courseCategory/courseCategory.service.ts` | Move |
| - | `src/modules/courseCategory/courseCategory.repo.ts` | New: Repository |
| - | `src/modules/courseCategory/courseCategory.dto.ts` | New: DTOs |

### Course Type Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/CourseType.ts` | `src/modules/courseType/courseType.model.ts` | Move |
| `src/routes/courseType.routes.ts` | `src/modules/courseType/courseType.routes.ts` | Move |
| `src/controllers/courseType.controller.ts` | `src/modules/courseType/courseType.controller.ts` | Move |
| `src/services/courseType.service.ts` | `src/modules/courseType/courseType.service.ts` | Move |
| - | `src/modules/courseType/courseType.repo.ts` | New: Repository |
| - | `src/modules/courseType/courseType.dto.ts` | New: DTOs |

### Course Level Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/CourseLevel.ts` | `src/modules/courseLevel/courseLevel.model.ts` | Move |
| `src/routes/courseLevel.routes.ts` | `src/modules/courseLevel/courseLevel.routes.ts` | Move |
| `src/controllers/courseLevel.controller.ts` | `src/modules/courseLevel/courseLevel.controller.ts` | Move |
| `src/services/courseLevel.service.ts` | `src/modules/courseLevel/courseLevel.service.ts` | Move |
| - | `src/modules/courseLevel/courseLevel.repo.ts` | New: Repository |
| - | `src/modules/courseLevel/courseLevel.dto.ts` | New: DTOs |

### Learning Outcome Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/LearningOutcome.ts` | `src/modules/learningOutcome/learningOutcome.model.ts` | Move |
| `src/routes/learningOutcome.routes.ts` | `src/modules/learningOutcome/learningOutcome.routes.ts` | Move |
| `src/controllers/learningOutcome.controller.ts` | `src/modules/learningOutcome/learningOutcome.controller.ts` | Move |
| `src/services/learningOutcome.service.ts` | `src/modules/learningOutcome/learningOutcome.service.ts` | Move |
| - | `src/modules/learningOutcome/learningOutcome.repo.ts` | New: Repository |
| - | `src/modules/learningOutcome/learningOutcome.dto.ts` | New: DTOs |

### Location Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Location.ts` | `src/modules/location/location.model.ts` | Move |
| `src/routes/location.routes.ts` | `src/modules/location/location.routes.ts` | Move |
| `src/controllers/location.controller.ts` | `src/modules/location/location.controller.ts` | Move |
| `src/services/location.service.ts` | `src/modules/location/location.service.ts` | Move |
| - | `src/modules/location/location.repo.ts` | New: Repository |
| - | `src/modules/location/location.dto.ts` | New: DTOs |

### Dashboard Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/routes/dashboard.routes.ts` | `src/modules/dashboard/dashboard.routes.ts` | Move |
| `src/controllers/dashboard.controller.ts` | `src/modules/dashboard/dashboard.controller.ts` | Move |
| `src/services/dashboard.service.ts` | `src/modules/dashboard/dashboard.service.ts` | Move |
| - | `src/modules/dashboard/dashboard.dto.ts` | New: DTOs |

### Upload Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/routes/upload.routes.ts` | `src/modules/upload/upload.routes.ts` | Move |
| `src/controllers/upload.controller.ts` | `src/modules/upload/upload.controller.ts` | Move |
| - | `src/modules/upload/upload.service.ts` | New: Extract from controller |
| - | `src/modules/upload/upload.dto.ts` | New: DTOs |

### Email Module

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/routes/email.routes.ts` | `src/modules/email/email.routes.ts` | Move |
| `src/controllers/email.controller.ts` | `src/modules/email/email.controller.ts` | Move |
| `src/services/email.service.ts` | `src/modules/email/email.service.ts` | Move |
| - | `src/modules/email/email.dto.ts` | New: DTOs |

### Engagement Builder Modules

#### Wall Post Module
| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/WallPost.ts` | `src/modules/wallPost/wallPost.model.ts` | Move |
| `src/routes/wallPost.routes.ts` | `src/modules/wallPost/wallPost.routes.ts` | Move |
| `src/controllers/wallPost.controller.ts` | `src/modules/wallPost/wallPost.controller.ts` | Move |
| `src/services/wallPost.service.ts` | `src/modules/wallPost/wallPost.service.ts` | Move |
| - | `src/modules/wallPost/wallPost.repo.ts` | New: Repository |
| - | `src/modules/wallPost/wallPost.dto.ts` | New: DTOs |

#### Community Post Module
| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/CommunityPost.ts` | `src/modules/communityPost/communityPost.model.ts` | Move |
| `src/routes/communityPost.routes.ts` | `src/modules/communityPost/communityPost.routes.ts` | Move |
| `src/controllers/communityPost.controller.ts` | `src/modules/communityPost/communityPost.controller.ts` | Move |
| `src/services/communityPost.service.ts` | `src/modules/communityPost/communityPost.service.ts` | Move |
| - | `src/modules/communityPost/communityPost.repo.ts` | New: Repository |
| - | `src/modules/communityPost/communityPost.dto.ts` | New: DTOs |

#### Reel Module
| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Reel.ts` | `src/modules/reel/reel.model.ts` | Move |
| `src/routes/reel.routes.ts` | `src/modules/reel/reel.routes.ts` | Move |
| `src/controllers/reel.controller.ts` | `src/modules/reel/reel.controller.ts` | Move |
| `src/services/reel.service.ts` | `src/modules/reel/reel.service.ts` | Move |
| - | `src/modules/reel/reel.repo.ts` | New: Repository |
| - | `src/modules/reel/reel.dto.ts` | New: DTOs |

#### Event Module
| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Event.ts` | `src/modules/event/event.model.ts` | Move |
| `src/routes/event.routes.ts` | `src/modules/event/event.routes.ts` | Move |
| `src/controllers/event.controller.ts` | `src/modules/event/event.controller.ts` | Move |
| `src/services/event.service.ts` | `src/modules/event/event.service.ts` | Move |
| - | `src/modules/event/event.repo.ts` | New: Repository |
| - | `src/modules/event/event.dto.ts` | New: DTOs |

#### Scholarship Module
| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/models/Scholarship.ts` | `src/modules/scholarship/scholarship.model.ts` | Move |
| `src/routes/scholarship.routes.ts` | `src/modules/scholarship/scholarship.routes.ts` | Move |
| `src/controllers/scholarship.controller.ts` | `src/modules/scholarship/scholarship.controller.ts` | Move |
| `src/services/scholarship.service.ts` | `src/modules/scholarship/scholarship.service.ts` | Move |
| - | `src/modules/scholarship/scholarship.repo.ts` | New: Repository |
| - | `src/modules/scholarship/scholarship.dto.ts` | New: DTOs |

## Shared Layer

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/schemas/*.schema.ts` | `src/shared/dtos/*.dto.ts` | Convert Zod schemas to DTOs |
| `src/types/*.ts` | `src/shared/types/*.ts` | Move shared types |
| - | `src/shared/constants/` | New: Shared constants |
| - | `src/shared/exceptions/` | New: Shared exceptions |

## Loaders

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/app.ts` | `src/loaders/express.ts` | Extract Express setup |
| `src/routes/index.ts` | `src/loaders/routes.ts` | Route registration |
| - | `src/loaders/index.ts` | New: Loader orchestration |

## Scripts

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/seed/*.ts` | `src/scripts/seed/*.ts` | Move seed scripts |
| `scripts/*.js` | `src/scripts/maintenance/*.js` | Move utility scripts |

## Documentation

| Current Location | New Location | Notes |
|----------------|--------------|-------|
| `src/docs/openapi.ts` | `src/docs/openapi.ts` | Keep in place or move to config |

