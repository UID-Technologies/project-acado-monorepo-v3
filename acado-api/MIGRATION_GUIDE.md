# Step-by-Step Migration Guide

## Prerequisites

1. Create a new branch: `git checkout -b refactor/clean-architecture`
2. Ensure all tests pass: `npm test`
3. Backup current codebase
4. Review all dependencies

## Phase 1: Foundation Setup (Week 1)

### Step 1.1: Create New Directory Structure

```bash
# Create core directories
mkdir -p src/core/http
mkdir -p src/core/utils
mkdir -p src/core/middleware
mkdir -p src/infrastructure/database/mongo
mkdir -p src/infrastructure/storage/azure
mkdir -p src/shared/dtos
mkdir -p src/shared/constants
mkdir -p src/shared/exceptions
mkdir -p src/shared/types
mkdir -p src/loaders
mkdir -p src/test/unit
mkdir -p src/test/integration
mkdir -p src/test/e2e
mkdir -p src/scripts/seed
mkdir -p src/scripts/maintenance
```

### Step 1.2: Setup Configuration Layer

1. **Create `src/config/index.ts`**:
```typescript
export * from './env.js';
export * from './db.js';
export * from './logger.js';
```

2. **Move and enhance `src/config/db.ts`**:
   - Move from `src/db/mongoose.ts`
   - Add connection pooling config
   - Add health check methods

3. **Move `src/config/logger.ts`**:
   - Move from `src/utils/logger.ts`
   - Enhance with structured logging

4. **Keep `src/config/env.ts`**:
   - Enhance with validation
   - Add type-safe config exports

### Step 1.3: Create Core HTTP Utilities

1. **Create `src/core/http/ApiError.ts`**:
```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errorCode?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}
```

2. **Create `src/core/http/ApiResponse.ts`**:
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export function successResponse<T>(data: T, meta?: ApiResponse['meta']): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta }),
  };
}

export function errorResponse(error: { code: string; message: string; details?: any }): ApiResponse {
  return {
    success: false,
    error,
  };
}
```

### Step 1.4: Create Core Utilities

1. **Create `src/core/utils/crypto.ts`**:
   - Password hashing (bcrypt)
   - Token generation
   - Hash utilities

2. **Create `src/core/utils/date.ts`**:
   - Date formatting
   - Date validation
   - Timezone utilities

3. **Create `src/core/utils/file.ts`**:
   - File validation
   - File type checking
   - File size validation

4. **Create `src/core/utils/validator.ts`**:
   - Common validation functions
   - Object validation helpers

### Step 1.5: Setup Infrastructure Layer

1. **Create `src/infrastructure/database/mongo/connection.ts`**:
   - Move from `src/db/mongoose.ts`
   - Add connection options
   - Add retry logic

2. **Create `src/infrastructure/database/mongo/BaseRepository.ts`**:
```typescript
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
```

3. **Create `src/infrastructure/storage/azure/blobStorage.ts`**:
   - Extract upload logic from controllers
   - Create reusable storage service

## Phase 2: Middleware Refactoring (Week 1-2)

### Step 2.1: Refactor Error Handler

1. **Create `src/core/middleware/errorHandler.ts`**:
   - Move from `src/middleware/error.ts`
   - Use new `ApiError` classes
   - Return standardized `ApiResponse`

### Step 2.2: Refactor Auth Middleware

1. **Create `src/core/middleware/authMiddleware.ts`**:
   - Move from `src/middleware/auth.ts`
   - Enhance with better error handling
   - Add token refresh logic

2. **Create `src/core/middleware/rbacMiddleware.ts`**:
   - Move from `src/middleware/rbac.ts`
   - Enhance with permission checking

3. **Create `src/core/middleware/validateMiddleware.ts`**:
   - Move from `src/middleware/validate.ts`
   - Enhance validation error messages

4. **Create `src/core/middleware/rateLimiter.ts`**:
   - Move from `src/middleware/rateLimit.ts`
   - Add different rate limits per route

5. **Create `src/core/middleware/requestLogger.ts`**:
   - Enhanced request logging
   - Add request ID tracking

## Phase 3: Module Migration (Week 2-4)

### Migration Order (by dependency):
1. **Auth** (no dependencies)
2. **User** (depends on Auth)
3. **Category, Field** (simple, no dependencies)
4. **Location** (simple)
5. **Organization** (depends on User)
6. **University** (depends on Organization, Location)
7. **Course Category, Type, Level** (simple)
8. **Learning Outcome** (depends on Course)
9. **Course** (depends on many)
10. **Form** (depends on Field, Category)
11. **Application** (depends on User, Course, Form)
12. **Dashboard** (depends on many)
13. **Upload, Email** (utility modules)
14. **Engagement modules** (WallPost, CommunityPost, Reel, Event, Scholarship)

### Step 3.1: Migrate Auth Module (Example)

1. **Create module directory**:
```bash
mkdir -p src/modules/auth
```

2. **Move files**:
   - `src/routes/auth.routes.ts` → `src/modules/auth/auth.routes.ts`
   - `src/controllers/auth.controller.ts` → `src/modules/auth/auth.controller.ts`
   - `src/services/auth.service.ts` → `src/modules/auth/auth.service.ts`

3. **Create DTOs** (`src/modules/auth/auth.dto.ts`):
```typescript
import { z } from 'zod';

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  username: z.string().min(3).optional(),
  organizationId: z.string().optional(),
  universityId: z.string().optional(),
});

export type LoginDto = z.infer<typeof loginDto>;
export type RegisterDto = z.infer<typeof registerDto>;
```

4. **Update imports** in moved files:
   - Update all relative imports
   - Use new core utilities
   - Use new error classes

5. **Test the module**:
   - Run unit tests
   - Test API endpoints
   - Verify authentication flow

### Step 3.2: Migrate User Module

1. **Create module directory**:
```bash
mkdir -p src/modules/user
```

2. **Move files**:
   - `src/models/User.ts` → `src/modules/user/user.model.ts`
   - `src/routes/user.routes.ts` → `src/modules/user/user.routes.ts`
   - `src/controllers/user.controller.ts` → `src/modules/user/user.controller.ts`
   - `src/services/user.service.ts` → `src/modules/user/user.service.ts`

3. **Create Repository** (`src/modules/user/user.repo.ts`):
```typescript
import { BaseRepository } from '../../../infrastructure/database/mongo/BaseRepository.js';
import User, { UserDocument } from './user.model.js';

export class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.findOne({ username: username.toLowerCase() });
  }

  // Add other user-specific queries
}
```

4. **Refactor Service** to use Repository:
   - Replace direct model calls with repository calls
   - Keep business logic in service

5. **Create DTOs** (`src/modules/user/user.dto.ts`)

6. **Update Controller** to use DTOs and new response format

7. **Test the module**

### Step 3.3: Repeat for Other Modules

Follow the same pattern for each module:
1. Create directory
2. Move files
3. Create repository (if has model)
4. Create DTOs
5. Refactor service to use repository
6. Update controller
7. Test

## Phase 4: Loaders & Route Registration (Week 4)

### Step 4.1: Create Express Loader

1. **Create `src/loaders/express.ts`**:
   - Extract Express setup from `src/app.ts`
   - Setup middleware
   - Return configured app

### Step 4.2: Create Route Loader

1. **Create `src/loaders/routes.ts`**:
   - Import all module routes
   - Register routes
   - Return router

### Step 4.3: Create Main Loader

1. **Create `src/loaders/index.ts`**:
   - Orchestrate all loaders
   - Setup database connection
   - Return configured app

### Step 4.4: Update Entry Points

1. **Update `src/app.ts`**:
   - Import from loaders
   - Minimal setup

2. **Update `src/server.ts`**:
   - Use new loader pattern

## Phase 5: Shared Layer (Week 4)

### Step 5.1: Convert Schemas to DTOs

1. Move `src/schemas/*.schema.ts` to `src/shared/dtos/`
2. Convert to DTO format
3. Update imports

### Step 5.2: Move Shared Types

1. Move `src/types/*.ts` to `src/shared/types/`
2. Update imports

### Step 5.3: Create Shared Constants

1. Extract constants from modules
2. Create `src/shared/constants/`
3. Update imports

## Phase 6: Testing & Cleanup (Week 5)

### Step 6.1: Update All Imports

1. Use find/replace to update imports
2. Verify all imports work
3. Fix any broken imports

### Step 6.2: Remove Old Structure

1. Delete old directories:
   - `src/controllers/`
   - `src/services/`
   - `src/routes/` (except index.ts)
   - `src/models/`
   - `src/middleware/`
   - `src/utils/`
   - `src/db/`
   - `src/schemas/`

2. Keep `src/routes/index.ts` temporarily for backward compatibility

### Step 6.3: Add Tests

1. Unit tests for services
2. Unit tests for repositories
3. Integration tests for modules
4. E2E tests for API endpoints

### Step 6.4: Update Documentation

1. Update README
2. Update API documentation
3. Update architecture docs

## Phase 7: Final Verification (Week 5)

### Step 7.1: Run All Tests

```bash
npm test
npm run test:integration
npm run test:e2e
```

### Step 7.2: Manual Testing

1. Test all API endpoints
2. Test authentication flow
3. Test authorization
4. Test file uploads
5. Test error handling

### Step 7.3: Performance Testing

1. Load testing
2. Memory profiling
3. Database query optimization

## Rollback Plan

If issues arise:

1. Keep old code in a `src/legacy/` directory
2. Use feature flags to toggle old/new code
3. Maintain backward compatibility during migration
4. Create rollback scripts

## Success Criteria

- [ ] All modules migrated
- [ ] All tests passing
- [ ] No breaking API changes
- [ ] Performance maintained or improved
- [ ] Code coverage > 80%
- [ ] Documentation updated
- [ ] Team trained on new structure

## Timeline

- **Week 1**: Foundation & Core
- **Week 2**: Middleware & First Modules
- **Week 3**: Module Migration (continued)
- **Week 4**: Loaders & Shared Layer
- **Week 5**: Testing & Cleanup

Total: ~5 weeks for complete migration

