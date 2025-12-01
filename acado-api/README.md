# Acado API - Backend Service

RESTful API service with JWT authentication, role-based access control, and MongoDB database. Built with clean enterprise architecture following Domain-Driven Design principles.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Available Scripts](#available-scripts)
- [Role-Based Permissions](#role-based-permissions)
- [Project Structure](#project-structure)
- [Migration Status](#migration-status)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Acado API provides a comprehensive solution for managing university applications, courses, forms, and user management:

- **RESTful API** - Express.js with TypeScript
- **Clean Architecture** - Domain-Driven Design with module-based structure
- **Authentication** - JWT-based authentication with refresh tokens
- **Authorization** - Role-based access control (SuperAdmin, Admin, Learner)
- **Database** - MongoDB with Mongoose ODM
- **Documentation** - OpenAPI/Swagger interactive documentation
- **Validation** - Zod schema validation for all endpoints
- **Security** - Rate limiting, CORS, helmet, and comprehensive error handling
- **File Uploads** - Azure Blob Storage integration
- **Email Service** - Templated email sending with Nodemailer

---

## 🏗️ Architecture

### Clean Enterprise Architecture

The project follows a clean, enterprise-level architecture with clear separation of concerns:

```
src/
├── config/          # Configuration (env, db, logger)
├── core/            # Core utilities (http, middleware, utils)
│   ├── http/        # HTTP utilities (ApiError, ApiResponse)
│   ├── middleware/  # Express middleware (auth, RBAC, validation, error handling)
│   └── utils/       # Utility functions (crypto, date, file, validator)
├── infrastructure/  # Infrastructure layer
│   └── database/    # Database connections and repositories
│       └── mongo/   # MongoDB connection and BaseRepository
├── loaders/         # Application loaders
│   ├── express.ts   # Express app initialization
│   ├── routes.ts    # Route registration
│   └── index.ts     # Main loader orchestrator
├── modules/         # Business modules (22 modules)
│   ├── auth/        # Authentication module
│   ├── user/        # User management
│   ├── course/      # Course management
│   ├── university/  # University management
│   ├── form/        # Form builder
│   ├── application/ # Application management
│   └── ...          # 16 more modules
├── models/          # Mongoose models
├── schemas/          # Zod validation schemas
└── services/         # Legacy services (gradual migration)
```

### Module Structure

Each module follows a consistent structure:

```
modules/{moduleName}/
├── {moduleName}.model.ts    # Mongoose model (if needed)
├── {moduleName}.repo.ts      # Repository (data access layer)
├── {moduleName}.dto.ts       # DTOs and Zod schemas
├── {moduleName}.service.ts   # Business logic
├── {moduleName}.controller.ts # HTTP handlers
└── {moduleName}.routes.ts    # Express routes
```

---

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication with access and refresh tokens
- ✅ Role-based access control (SuperAdmin, Admin, Learner)
- ✅ User profile management and password change
- ✅ Token refresh mechanism with cookie-based refresh tokens
- ✅ Password reset via email
- ✅ Account activation/deactivation

### Form Management
- ✅ Dynamic form builder with configurable fields
- ✅ Form status management (draft, published, archived)
- ✅ Form duplication functionality
- ✅ Custom category and subcategory naming
- ✅ Field validation rules and configurations
- ✅ Form association with universities and courses

### Master Fields & Categories
- ✅ Master field library management
- ✅ Category and subcategory organization
- ✅ Field type support (text, select, date, file upload, etc.)
- ✅ Field search and filtering

### University Management
- ✅ University CRUD operations
- ✅ University profiles with details, website, logo, ranking
- ✅ Course listing per university
- ✅ Country and city-based filtering
- ✅ University statistics

### Course Management
- ✅ Course CRUD operations
- ✅ Multiple course types (degree, exchange, pathway, diploma, certification)
- ✅ Course levels (undergraduate, postgraduate, doctoral)
- ✅ Course categories and learning outcomes
- ✅ Application form association
- ✅ Fee and deadline management

### Application Management
- ✅ Application submission with form data
- ✅ Store university, course, and user associations
- ✅ Application lifecycle tracking (draft → submitted → review → accepted/rejected)
- ✅ Application status management
- ✅ Draft and auto-save functionality
- ✅ Submit, withdraw, and review actions
- ✅ Application statistics by status
- ✅ Metadata capture (completion time, IP, user agent)

### User Management
- ✅ User CRUD operations
- ✅ Bulk user creation
- ✅ User search and filtering
- ✅ Organization and university associations
- ✅ User status management

### Engagement Builder
- ✅ Wall posts management
- ✅ Community posts with categories
- ✅ Reels with views and likes tracking
- ✅ Events with registrations
- ✅ Scholarships with applications tracking

### File Management
- ✅ Azure Blob Storage integration
- ✅ File upload with validation
- ✅ File retrieval
- ✅ Support for multiple file types

### Email Service
- ✅ Templated email sending
- ✅ Password reset emails
- ✅ Custom email templates

### Technical Features
- ✅ RESTful API with Express.js and TypeScript
- ✅ MongoDB database with Mongoose ODM
- ✅ OpenAPI/Swagger interactive documentation
- ✅ Zod schema validation for all endpoints
- ✅ Rate limiting and security headers (Helmet.js)
- ✅ CORS configuration
- ✅ Comprehensive error handling
- ✅ Health check endpoint
- ✅ Request logging with Pino
- ✅ Request ID tracking

---

## 🛠 Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB v6+
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Documentation**: OpenAPI/Swagger
- **Security**: Helmet, CORS, express-rate-limit
- **File Storage**: Azure Blob Storage
- **Email**: Nodemailer
- **Logging**: Pino

---

## 📋 Prerequisites

- **Node.js** - v18.x or higher ([Download](https://nodejs.org/))
- **npm** - v9.x or higher (comes with Node.js)
- **MongoDB** - v6.x or higher ([Download](https://www.mongodb.com/try/download/community))
  - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

### Verify Installation

```bash
node --version    # Should show v18.x or higher
npm --version     # Should show v9.x or higher
mongod --version  # Should show v6.x or higher
```

---

## 📦 Installation

### 1. Navigate to API Directory

```bash
cd acado-api
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js, Mongoose, bcryptjs, jsonwebtoken
- TypeScript and development dependencies
- Validation and security packages
- Azure Blob Storage SDK
- Nodemailer

---

## ⚙️ Configuration

Create a `.env` file in the `acado-api` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# Database
MONGO_URI=mongodb://localhost:27017/acadodb

# JWT
JWT_ACCESS_SECRET=your-access-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:8080,http://localhost:3000,http://localhost:5173

# Azure Blob Storage (Optional)
AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
AZURE_CONTAINER_NAME=your-container-name
AZURE_STORAGE_ACCOUNT_URL=your-azure-account-url

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `4000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/acadodb` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Required | JWT access token signing secret |
| `JWT_REFRESH_SECRET` | Required | JWT refresh token signing secret |
| `ACCESS_TOKEN_EXPIRES_IN` | `15m` | Access token expiration time |
| `REFRESH_TOKEN_EXPIRES_IN` | `7d` | Refresh token expiration time |
| `CORS_ORIGIN` | Multiple origins | Allowed CORS origins |
| `AZURE_STORAGE_CONNECTION_STRING` | Optional | Azure Blob Storage connection string |
| `AZURE_CONTAINER_NAME` | Optional | Azure container name |
| `AZURE_STORAGE_ACCOUNT_URL` | Optional | Azure storage account URL |
| `SMTP_HOST` | Optional | SMTP server host |
| `SMTP_PORT` | Optional | SMTP server port |
| `SMTP_USER` | Optional | SMTP username |
| `SMTP_PASS` | Optional | SMTP password |
| `FRONTEND_URL` | Optional | Frontend URL for email links |

---

## 🚀 Running the Application

### Start MongoDB

#### Option 1: Local MongoDB
```bash
mongod
```

#### Option 2: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Start Backend Server

#### Development Mode (with hot reload)
```bash
npm run dev
```

Backend will run at: **http://localhost:4000**

#### Production Mode
```bash
npm run build
npm run start
```

### Verify Server is Running

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "uptime": 123.456
}
```

---

## 📚 API Documentation

### Swagger UI (Interactive Documentation)

Once the backend is running, access the interactive API documentation:

**URL**: http://localhost:4000/docs

### Using Swagger UI

1. **Login to Get Token**:
   - Expand `POST /auth/login`
   - Click "Try it out"
   - Enter credentials: `admin@example.com` / `admin123`
   - Click "Execute"
   - Copy the `accessToken` from the response

2. **Authorize**:
   - Click the 🔓 "Authorize" button at the top right
   - Enter: `Bearer <paste-your-token-here>`
   - Click "Authorize"
   - Click "Close"

3. **Test Endpoints**:
   - Now you can test any protected endpoint directly from Swagger UI

---

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/profile` - Get current user profile
- `PUT /auth/profile` - Update current user profile
- `POST /auth/change-password` - Change password

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

### Upload
- `POST /upload` - Upload file
- `GET /upload/:filename` - Get uploaded file

### Locations
- `GET /locations/countries` - Get all countries
- `GET /locations/states` - Get states (query: country)
- `GET /locations/cities` - Get cities (query: country, state)

### Emails
- `POST /emails` - Send templated email

### Master Data
- `GET /masterCategories` - List categories
- `GET /masterCategories/:id` - Get category
- `POST /masterCategories` - Create category
- `PUT /masterCategories/:id` - Update category
- `DELETE /masterCategories/:id` - Delete category
- `POST /masterCategories/:id/subcategories` - Add subcategory
- `PUT /masterCategories/:id/subcategories/:subId` - Update subcategory
- `DELETE /masterCategories/:id/subcategories/:subId` - Delete subcategory

- `GET /masterFields` - Search fields
- `GET /masterFields/:id` - Get field
- `POST /masterFields` - Create field
- `PUT /masterFields/:id` - Update field
- `DELETE /masterFields/:id` - Delete field

### Forms
- `GET /forms` - List forms
- `GET /forms/:id` - Get form
- `GET /forms/by-course/:courseId` - Get form by course ID
- `POST /forms` - Create form
- `PUT /forms/:id` - Update form
- `DELETE /forms/:id` - Delete form
- `POST /forms/:id/publish` - Publish form
- `POST /forms/:id/archive` - Archive form
- `POST /forms/:id/duplicate` - Duplicate form

### Universities
- `GET /universities` - List universities
- `GET /universities/stats/summary` - Get university statistics
- `GET /universities/:id` - Get university
- `GET /universities/:id/courses` - Get university courses
- `POST /universities` - Create university
- `PUT /universities/:id` - Update university
- `DELETE /universities/:id` - Delete university

### Courses
- `GET /courses` - List courses
- `GET /courses/:id` - Get course
- `POST /courses` - Create course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course

### Organizations
- `GET /organizations/public` - List public organizations
- `GET /organizations` - List organizations (admin)
- `GET /organizations/:organizationId` - Get organization
- `POST /organizations` - Create organization
- `POST /organizations/:organizationId/admins` - Add organization admin
- `PATCH /organizations/:organizationId/status` - Update organization status
- `PATCH /organizations/:organizationId/location` - Update organization location
- `PATCH /organizations/:organizationId/info` - Update organization info
- `PATCH /organizations/:organizationId/contacts` - Update organization contacts
- `PATCH /organizations/:organizationId/onboarding-stage` - Update onboarding stage

### Course Metadata
- `GET /course-categories` - List course categories
- `GET /course-categories/:id` - Get course category
- `POST /course-categories` - Create course category
- `PUT /course-categories/:id` - Update course category
- `DELETE /course-categories/:id` - Delete course category

- `GET /course-types` - List course types
- `GET /course-types/:id` - Get course type
- `POST /course-types` - Create course type
- `PUT /course-types/:id` - Update course type
- `DELETE /course-types/:id` - Delete course type

- `GET /course-levels` - List course levels
- `GET /course-levels/:id` - Get course level
- `POST /course-levels` - Create course level
- `PUT /course-levels/:id` - Update course level
- `DELETE /course-levels/:id` - Delete course level

- `GET /learning-outcomes` - List learning outcomes
- `GET /learning-outcomes/:id` - Get learning outcome
- `POST /learning-outcomes` - Create learning outcome
- `PUT /learning-outcomes/:id` - Update learning outcome
- `DELETE /learning-outcomes/:id` - Delete learning outcome

### Applications
- `GET /applications` - List applications
- `GET /applications/stats` - Get application statistics
- `GET /applications/:id` - Get application
- `POST /applications` - Create application
- `PUT /applications/:id` - Update application
- `DELETE /applications/:id` - Delete application
- `POST /applications/:id/submit` - Submit application
- `POST /applications/:id/withdraw` - Withdraw application
- `POST /applications/:id/review` - Review application (admin)

### Users
- `GET /users` - List users
- `GET /users/:userId` - Get user
- `POST /users` - Create user
- `POST /users/bulk` - Bulk create users
- `PATCH /users/:userId` - Update user
- `DELETE /users/:userId` - Delete user

### Engagement Builder
- `GET /wall-posts` - List wall posts
- `GET /wall-posts/:id` - Get wall post
- `POST /wall-posts` - Create wall post
- `PUT /wall-posts/:id` - Update wall post
- `DELETE /wall-posts/:id` - Delete wall post

- `GET /community-posts` - List community posts
- `GET /community-posts/categories` - List categories
- `GET /community-posts/categories/:id` - Get category
- `POST /community-posts/categories` - Create category
- `PUT /community-posts/categories/:id` - Update category
- `DELETE /community-posts/categories/:id` - Delete category
- `GET /community-posts/:id` - Get community post
- `POST /community-posts` - Create community post
- `PUT /community-posts/:id` - Update community post
- `DELETE /community-posts/:id` - Delete community post

- `GET /reels` - List reels
- `GET /reels/:id` - Get reel
- `POST /reels` - Create reel
- `PUT /reels/:id` - Update reel
- `DELETE /reels/:id` - Delete reel
- `POST /reels/:id/views` - Increment views
- `POST /reels/:id/likes` - Increment likes

- `GET /events` - List events
- `GET /events/:id` - Get event
- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `POST /events/:id/views` - Increment views
- `POST /events/:id/registrations` - Increment registrations

- `GET /scholarships` - List scholarships
- `GET /scholarships/:id` - Get scholarship
- `POST /scholarships` - Create scholarship
- `PUT /scholarships/:id` - Update scholarship
- `DELETE /scholarships/:id` - Delete scholarship
- `POST /scholarships/:id/views` - Increment views
- `POST /scholarships/:id/applications` - Increment applications

### System
- `GET /health` - Health check endpoint
- `GET /docs` - API documentation (Swagger UI)

### Notes

- All endpoints maintain the same paths as before migration
- No `/v1` prefix - all routes are at base level
- Authentication: Bearer token in `Authorization` header
- All endpoints use the new module structure internally
- Response format remains consistent

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript to JavaScript (output to dist/)
npm run start            # Start production server (runs compiled code from dist/)

# User Management
npm run create:users     # Create users using scripts/create-users.js

# Code Quality
npm run lint             # Run ESLint
```

---

## 🔐 Role-Based Permissions

### Permission Matrix

| Action | SuperAdmin | Admin | Learner | Guest |
|--------|:----------:|:-----:|:-------:|:-----:|
| **View** categories/fields/forms/universities/courses | ✅ | ✅ | ✅ | ✅ |
| **View** profile | ✅ | ✅ | ✅ | ❌ |
| **View** own applications | ✅ | ✅ | ✅ | ❌ |
| **View** all applications | ✅ | ✅ | ❌ | ❌ |
| **Create** categories/fields/forms/courses | ✅ | ✅ | ❌ | ❌ |
| **Create** universities | ✅ | ✅ | ❌ | ❌ |
| **Create** applications (submit) | ✅ | ✅ | ✅ | ❌ |
| **Update** categories/fields/forms/courses | ✅ | ✅ | ❌ | ❌ |
| **Update** universities | ✅ | ✅ | ❌ | ❌ |
| **Update** own draft applications | ✅ | ✅ | ✅ | ❌ |
| **Update** any applications | ✅ | ✅ | ❌ | ❌ |
| **Delete** categories/fields/forms/courses/universities | ✅ | ✅ | ❌ | ❌ |
| **Delete** applications | ✅ | ✅ | ❌ | ❌ |
| **Publish** forms | ✅ | ✅ | ❌ | ❌ |
| **Archive** forms | ✅ | ✅ | ❌ | ❌ |
| **Duplicate** forms | ✅ | ✅ | ❌ | ❌ |
| **Review** applications (accept/reject) | ✅ | ✅ | ❌ | ❌ |
| **Withdraw** own applications | ✅ | ✅ | ✅ | ❌ |
| **Register** new users | ✅ | ❌ | ❌ | ✅ |

---

## 📁 Project Structure

```
acado-api/
├── src/
│   ├── config/                # Configuration
│   │   ├── env.ts             # Environment variables
│   │   ├── db.ts              # Database configuration
│   │   └── logger.ts          # Pino logger setup
│   ├── core/                  # Core utilities
│   │   ├── http/              # HTTP utilities
│   │   │   ├── ApiError.ts    # Custom error class
│   │   │   └── ApiResponse.ts # Response utilities
│   │   ├── middleware/       # Express middleware
│   │   │   ├── authMiddleware.ts      # JWT authentication
│   │   │   ├── rbacMiddleware.ts     # Role-based access control
│   │   │   ├── validateMiddleware.ts  # Zod validation
│   │   │   ├── errorHandler.ts       # Error handling
│   │   │   ├── rateLimiter.ts         # Rate limiting
│   │   │   ├── requestLogger.ts       # Request logging
│   │   │   └── universityScopeMiddleware.ts # University scoping
│   │   └── utils/             # Utility functions
│   │       ├── crypto.ts      # Password hashing, token generation
│   │       ├── date.ts        # Date utilities
│   │       ├── file.ts        # File utilities
│   │       └── validator.ts  # Validation utilities
│   ├── infrastructure/        # Infrastructure layer
│   │   └── database/          # Database
│   │       └── mongo/         # MongoDB
│   │           ├── connection.ts      # MongoDB connection
│   │           ├── BaseRepository.ts  # Base repository class
│   │           └── types.ts          # Database types
│   ├── loaders/               # Application loaders
│   │   ├── express.ts         # Express app initialization
│   │   ├── routes.ts          # Route registration
│   │   └── index.ts           # Main loader orchestrator
│   ├── modules/               # Business modules (22 modules)
│   │   ├── auth/              # Authentication module
│   │   ├── user/              # User management
│   │   ├── category/          # Category management
│   │   ├── field/             # Field management
│   │   ├── university/        # University management
│   │   ├── course/            # Course management
│   │   ├── courseCategory/   # Course category management
│   │   ├── courseType/        # Course type management
│   │   ├── courseLevel/       # Course level management
│   │   ├── learningOutcome/   # Learning outcome management
│   │   ├── form/              # Form builder
│   │   ├── application/      # Application management
│   │   ├── organization/      # Organization management
│   │   ├── location/          # Location management
│   │   ├── dashboard/         # Dashboard statistics
│   │   ├── upload/            # File upload
│   │   ├── email/             # Email service
│   │   ├── wallPost/          # Wall posts
│   │   ├── communityPost/    # Community posts
│   │   ├── reel/              # Reels
│   │   ├── event/             # Events
│   │   └── scholarship/      # Scholarships
│   ├── models/                # Mongoose models
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   ├── Field.ts
│   │   ├── Form.ts
│   │   ├── University.ts
│   │   ├── Course.ts
│   │   ├── Application.ts
│   │   └── ... (19 models total)
│   ├── schemas/               # Zod validation schemas
│   │   ├── category.schema.ts
│   │   ├── field.schema.ts
│   │   ├── form.schema.ts
│   │   ├── application.schema.ts
│   │   └── ... (13 schemas total)
│   ├── services/              # Legacy services (gradual migration)
│   │   ├── user.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── email.service.ts
│   │   └── ... (20 services total, 9 still in use)
│   ├── types/                 # TypeScript types
│   │   ├── express-request-id.d.ts
│   │   └── nodemailer.d.ts
│   ├── app.ts                 # Legacy app.ts (re-exports loadApp)
│   └── server.ts              # Entry point
├── dist/                      # Compiled JavaScript (generated)
├── .env                       # Environment variables (create this)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔄 Migration Status

### ✅ Completed Migration (2024-07-30)

The project has been successfully migrated to a clean enterprise architecture:

#### Infrastructure Migration (100% Complete)
- ✅ All routes migrated to new modules
- ✅ All controllers migrated to new modules
- ✅ All middleware migrated to `core/middleware/`
- ✅ All utilities migrated to `core/utils/` and `config/logger.ts`
- ✅ All database connections migrated to `infrastructure/database/mongo/`
- ✅ Upload module fully migrated (no longer depends on old controllers)
- ✅ v1 routes removed (cleaner API)

#### Old Folders Removed
- ✅ `src/middleware/` - REMOVED (6 files)
- ✅ `src/utils/` - REMOVED (2 files)
- ✅ `src/db/` - REMOVED (1 file)
- ✅ `src/routes/` - REMOVED (23 files)
- ✅ `src/controllers/` - REMOVED (22 files)

#### Remaining Old Folders
- ⚠️ `src/services/` - Still Present (Used by 9 new modules)
  - **Status**: New modules wrap old services (gradual migration pattern)
  - **Used By**: user, dashboard, email, application, form, auth, event, scholarship, organization
  - **Reason**: Business logic still in old services (safe migration approach)
  - **Action**: Can be migrated gradually by moving business logic to new services

#### Endpoint Compatibility
- ✅ **All endpoints remain the same** - No frontend changes required
- ✅ **Same request/response formats**
- ✅ **Same authentication mechanism**
- ✅ **No `/v1` prefix** - Cleaner API

#### Current Architecture
- ✅ **22 modules** fully migrated and operational
- ✅ **Clean separation of concerns** (Core, Infrastructure, Modules, Shared)
- ✅ **Repository pattern** implemented
- ✅ **DTO pattern** implemented
- ✅ **Service layer** with business logic
- ✅ **Controller layer** with HTTP handlers
- ✅ **Route layer** with Express routes

---

## 🚨 Troubleshooting

### Cannot connect to MongoDB
```bash
# Error: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017

# Solution 1: Start MongoDB locally
mongod

# Solution 2: Start MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Solution 3: Check if MongoDB is already running
# Windows: tasklist | findstr mongod
# Linux/Mac: ps aux | grep mongod
```

### Port 4000 already in use
```bash
# Error: EADDRINUSE: address already in use :::4000

# Solution 1: Change port in .env
PORT=4001

# Solution 2: Kill process using port 4000
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:4000 | xargs kill
```

### JWT_SECRET not set
```bash
# Warning: JWT_SECRET environment variable is not set

# Solution: Create .env file with JWT secrets
echo "JWT_ACCESS_SECRET=your-secure-random-string-here" > .env
echo "JWT_REFRESH_SECRET=your-secure-random-string-here" >> .env
```

### TypeScript errors during build
```bash
# Error: TypeScript compilation errors

# Solution: Check TypeScript version and dependencies
npm install
npm run build
```

### Database is empty
```bash
# No data returned from API

# Solution: Create users and data through API endpoints or scripts
npm run create:users    # Create users using scripts/create-users.js
```

### Authentication fails
```bash
# Error: Invalid email or password

# Solution: Make sure users are created
npm run create:users

# Then try login with correct credentials
```

---

## 🔒 Security Features

- ✅ **Password Hashing**: bcrypt with 10 salt rounds
- ✅ **JWT Tokens**: Access tokens (15m) and refresh tokens (7d), signed with secrets
- ✅ **CORS Protection**: Configurable allowed origins
- ✅ **Rate Limiting**: 100 requests per 15 minutes per IP
- ✅ **Security Headers**: Helmet.js for security headers
- ✅ **Input Validation**: Zod schemas for all endpoints
- ✅ **Role-Based Access Control**: SuperAdmin, Admin, Learner roles
- ✅ **Error Handling**: Generic error messages in production
- ✅ **Request ID**: Unique ID for each request (logging)
- ✅ **Refresh Token Rotation**: Token version tracking for security

---

## 📖 Additional Information

### Authentication Flow

1. User sends email/password to `/auth/login`
2. Server validates credentials against database
3. If valid, server generates access token (15m) and refresh token (7d)
4. Refresh token is stored in HTTP-only cookie
5. Access token is returned in response body
6. Client stores access token and sends it in `Authorization` header
7. Server verifies token on protected routes
8. When access token expires, client uses refresh token to get new access token
9. Server grants access based on user's role

### Development vs Production

**Development Mode** (`NODE_ENV=development`):
- Detailed error messages with stack traces
- Console logging enabled
- CORS allows multiple origins
- Hot reload with tsx watch

**Production Mode** (`NODE_ENV=production`):
- Generic error messages
- Structured logging with Pino
- Strict CORS configuration
- Optimized builds

---

## 🌐 Service URLs

| Endpoint | URL | Description |
|----------|-----|-------------|
| **API Base** | http://localhost:4000 | Base URL for all endpoints |
| **Swagger Docs** | http://localhost:4000/docs | Interactive API documentation |
| **Health Check** | http://localhost:4000/health | API health status |

---

## 🎉 You're Ready!

Your Backend API Service is now set up and ready to use!

### Quick Verification Checklist

- [ ] MongoDB is running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment configured (`.env` created if needed)
- [ ] Server running (`npm run dev`)
- [ ] Health check passes (http://localhost:4000/health)
- [ ] Swagger docs accessible (http://localhost:4000/docs)
- [ ] Can access API endpoints

**Next Step**: Start the frontend application to interact with this API!

Happy coding! 🚀
