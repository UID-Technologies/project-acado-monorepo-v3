# Acado API - Clean Architecture Migration Plan

## Overview

This document outlines the migration from the current structure to a clean, enterprise-level architecture following Domain-Driven Design (DDD) principles.

## Target Architecture

```
acado-api/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Server entry point
│   │
│   ├── config/                   # Configuration layer
│   │   ├── index.ts              # Config exports
│   │   ├── env.ts                # Environment variables
│   │   ├── db.ts                 # Database config
│   │   └── logger.ts             # Logger config
│   │
│   ├── core/                     # Core building blocks
│   │   ├── http/
│   │   │   ├── ApiResponse.ts   # Standardized API responses
│   │   │   └── ApiError.ts       # Custom error classes
│   │   ├── utils/
│   │   │   ├── crypto.ts         # Cryptographic utilities
│   │   │   ├── date.ts           # Date utilities
│   │   │   ├── file.ts           # File utilities
│   │   │   └── validator.ts      # Validation utilities
│   │   └── middleware/
│   │       ├── errorHandler.ts   # Error handling middleware
│   │       ├── authMiddleware.ts  # Authentication middleware
│   │       ├── requestLogger.ts  # Request logging
│   │       └── rateLimiter.ts    # Rate limiting
│   │
│   ├── modules/                  # DOMAIN LAYER (DDD)
│   │   ├── user/
│   │   │   ├── user.model.ts     # Mongoose model
│   │   │   ├── user.repo.ts      # Repository (data access)
│   │   │   ├── user.service.ts   # Business logic
│   │   │   ├── user.controller.ts # HTTP handlers
│   │   │   ├── user.routes.ts    # Express routes
│   │   │   └── user.dto.ts       # Data Transfer Objects
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.dto.ts
│   │   │
│   │   ├── course/
│   │   │   ├── course.model.ts
│   │   │   ├── course.repo.ts
│   │   │   ├── course.service.ts
│   │   │   ├── course.controller.ts
│   │   │   ├── course.routes.ts
│   │   │   └── course.dto.ts
│   │   │
│   │   └── ... (other modules)
│   │
│   ├── shared/                    # Shared components
│   │   ├── dtos/                  # Shared DTOs
│   │   ├── constants/             # Shared constants
│   │   ├── exceptions/            # Shared exceptions
│   │   └── types/                  # Shared types
│   │
│   ├── infrastructure/            # Infrastructure layer
│   │   ├── database/
│   │   │   ├── mongo/
│   │   │   │   ├── connection.ts
│   │   │   │   ├── BaseRepository.ts
│   │   │   │   └── index.ts
│   │   │   └── ...
│   │   ├── cache/
│   │   ├── messaging/
│   │   └── storage/
│   │       └── azure/
│   │           └── blobStorage.ts
│   │
│   ├── loaders/                   # Application loaders
│   │   ├── express.ts             # Express setup
│   │   ├── routes.ts              # Route registration
│   │   └── index.ts               # Loader orchestration
│   │
│   ├── test/                      # Tests
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   └── scripts/                   # Utility scripts
│       ├── seed/
│       └── maintenance/
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── jest.config.js
├── Dockerfile
└── docker-compose.yml
```

## Migration Strategy

### Phase 1: Foundation (Core Infrastructure)
1. Create new directory structure
2. Move and refactor core utilities
3. Set up infrastructure layer
4. Create base repository pattern

### Phase 2: Middleware & HTTP Layer
1. Refactor middleware to core/middleware
2. Create standardized API response/error classes
3. Update error handling

### Phase 3: Module Migration (One at a time)
1. Start with `auth` module (simplest, no dependencies)
2. Migrate `user` module
3. Migrate remaining modules incrementally
4. Update routes and loaders

### Phase 4: Cleanup & Testing
1. Remove old structure
2. Update imports across codebase
3. Add comprehensive tests
4. Update documentation

## Benefits

1. **Separation of Concerns**: Clear boundaries between layers
2. **Testability**: Easy to unit test services and repositories
3. **Maintainability**: Related code grouped by domain
4. **Scalability**: Easy to add new modules
5. **Reusability**: Shared components in `shared/` and `core/`
6. **Type Safety**: DTOs for request/response validation

## Key Principles

1. **Dependency Rule**: Inner layers don't depend on outer layers
2. **Repository Pattern**: Abstract data access from business logic
3. **DTO Pattern**: Separate internal models from API contracts
4. **Service Layer**: Business logic lives in services, not controllers
5. **Module Independence**: Each module is self-contained

## Risk Mitigation

1. **Incremental Migration**: Migrate one module at a time
2. **Feature Flags**: Use feature flags to toggle old/new code
3. **Comprehensive Testing**: Test after each module migration
4. **Backward Compatibility**: Maintain API compatibility during migration
5. **Rollback Plan**: Keep old code until migration is complete

