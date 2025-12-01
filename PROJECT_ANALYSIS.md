# Acado Monorepo - Project Analysis

## Overview

This monorepo contains three main projects:
1. **acado-api** - Backend API (Node.js, Express, TypeScript, MongoDB)
2. **acado-client** - Frontend client application (React, Vite, TypeScript)
3. **acado-admin** - Admin dashboard application (React, Vite, TypeScript)

---

## 1. acado-api (Backend API)

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh tokens)
- **Validation**: Zod schemas
- **File Storage**: Azure Blob Storage
- **Logging**: Pino
- **Documentation**: Swagger/OpenAPI

### Project Structure

```
acado-api/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── config/
│   │   └── env.ts          # Environment configuration
│   ├── db/
│   │   └── mongoose.ts     # MongoDB connection
│   ├── models/             # Mongoose models (19 models)
│   │   ├── User.ts
│   │   ├── University.ts
│   │   ├── Course.ts
│   │   ├── Application.ts
│   │   ├── Form.ts
│   │   ├── Organization.ts
│   │   ├── Event.ts
│   │   ├── Scholarship.ts
│   │   ├── WallPost.ts
│   │   ├── CommunityPost.ts
│   │   ├── Reel.ts
│   │   └── ... (9 more)
│   ├── controllers/        # Route handlers (22 controllers)
│   │   ├── auth.controller.ts
│   │   ├── university.controller.ts
│   │   ├── course.controller.ts
│   │   ├── application.controller.ts
│   │   └── ... (18 more)
│   ├── services/          # Business logic (20 services)
│   │   ├── auth.service.ts
│   │   ├── university.service.ts
│   │   ├── course.service.ts
│   │   └── ... (17 more)
│   ├── routes/            # Express routes (23 route files)
│   │   ├── index.ts       # Main router
│   │   ├── auth.routes.ts
│   │   ├── university.routes.ts
│   │   ├── course.routes.ts
│   │   └── ... (19 more)
│   ├── middleware/
│   │   ├── auth.ts        # JWT authentication
│   │   ├── rbac.ts        # Role-based access control
│   │   ├── validate.ts    # Request validation
│   │   ├── error.ts       # Error handling
│   │   ├── rateLimit.ts   # Rate limiting
│   │   └── universityScope.ts
│   ├── schemas/           # Zod validation schemas (13 files)
│   ├── utils/
│   │   └── logger.ts      # Pino logger
│   └── seed/              # Database seeding scripts
├── dist/                  # Compiled JavaScript
└── package.json
```

### API Routes Structure

All routes are mounted in `src/routes/index.ts`:

#### Base Routes (No `/v1` prefix - JSON Server compatible)
- `/auth` - Authentication endpoints
- `/dashboard` - Dashboard data
- `/upload` - File uploads
- `/locations` - Location management
- `/emails` - Email operations
- `/masterCategories` - Master categories
- `/masterFields` - Master fields
- `/forms` - Form management
- `/universities` - University CRUD
- `/courses` - Course management
- `/organizations` - Organization management
- `/course-categories` - Course categories
- `/course-types` - Course types
- `/course-levels` - Course levels
- `/learning-outcomes` - Learning outcomes
- `/applications` - Application management
- `/users` - User management
- `/wall-posts` - Wall posts (Engagement Builder)
- `/community-posts` - Community posts
- `/reels` - Reels content
- `/events` - Events management
- `/scholarships` - Scholarships

#### Legacy v1 Routes (Backward compatibility)
All above routes also available under `/v1/*` prefix

### Authentication & Authorization

**JWT Token Structure:**
- Access Token: Short-lived (15m default)
- Refresh Token: Long-lived (7d default)
- Token contains: `sub`, `email`, `name`, `role`, `organizationId`, `universityIds`, `courseIds`

**User Roles:**
- `superadmin` - Full system access
- `admin` - Administrative access
- `learner` - End user access

**Middleware:**
- `requireAuth` - Validates JWT token, extracts user info
- `optionalAuth` - Optional authentication
- `permit(roles...)` - Role-based access control
- `validate(schema)` - Request validation with Zod

### Key Models

**User Model:**
- Email, password (bcrypt), name, username
- Role: superadmin | admin | learner
- userType: Learner | Faculty | Staff | Admin
- organizationId, universityIds[], courseIds[]
- Token versioning for logout

**University Model:**
- Basic info, location, contact details
- Associated courses, forms, users

**Course Model:**
- Title, description, category, type, level
- Learning outcomes, requirements
- Associated university

**Application Model:**
- User, course, form submissions
- Status tracking, process steps

### Environment Configuration

Key environment variables:
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - Access token secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `CORS_ORIGIN` - Allowed origins (comma-separated)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` - SMTP config
- `AZURE_STORAGE_*` - Azure Blob Storage config

---

## 2. acado-client (Frontend Client Application)

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: Zustand stores
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Custom components + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Project Structure

```
acado-client/
├── src/
│   ├── main.tsx           # Application entry point
│   ├── app/
│   │   ├── App.tsx        # Root component
│   │   ├── config/
│   │   │   ├── app.config.ts
│   │   │   ├── env.config.ts
│   │   │   ├── endpoint.config.ts
│   │   │   ├── routes.config/
│   │   │   │   ├── routes.config.ts    # Main route definitions
│   │   │   │   ├── authRoute.ts
│   │   │   │   ├── publicRoute.ts
│   │   │   │   ├── learning.ts
│   │   │   │   └── community.ts
│   │   │   └── constants/
│   │   │       ├── api.constant.ts
│   │   │       ├── roles.constant.ts
│   │   │       └── route.constant.ts
│   │   ├── providers/
│   │   │   └── auth/
│   │   │       ├── AuthProvider.tsx
│   │   │       └── AuthContext.ts
│   │   ├── router/
│   │   │   └── route/
│   │   │       ├── AllRoutes.tsx       # Route renderer
│   │   │       ├── ProtectedRoute.tsx
│   │   │       ├── PublicRoute.tsx
│   │   │       ├── AuthRoute.tsx
│   │   │       └── AuthorityGuard.tsx
│   │   ├── store/         # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── learner/  # Learner-specific stores
│   │   │   ├── public/   # Public stores
│   │   │   └── ...
│   │   └── types/
│   ├── features/          # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── app/
│   │   │   ├── learner/   # Learner features
│   │   │   ├── faculty/   # Faculty features
│   │   │   ├── public/   # Public pages
│   │   │   └── common/    # Shared components
│   │   ├── community/    # Community features
│   │   ├── collaborate/  # Collaboration features
│   │   └── player/        # Media player components
│   ├── components/       # Reusable UI components (144 files)
│   ├── services/         # API service layer (62 files)
│   │   ├── http/
│   │   │   ├── ApiService.ts
│   │   │   └── AxiosBase.ts
│   │   ├── auth/
│   │   ├── learner/
│   │   ├── public/
│   │   └── ...
│   ├── layouts/           # Layout components (21 files)
│   ├── utils/            # Utility functions (23 files)
│   └── styles/
├── public/
└── package.json
```

### Routing Architecture

**Route Types:**
1. **Public Routes** - No authentication required
2. **Auth Routes** - Login/signup pages (redirect if authenticated)
3. **Protected Routes** - Require authentication + role-based access

**Route Configuration:**
Routes defined in `src/app/config/routes.config/routes.config.ts`:
- Lazy-loaded components
- Authority-based access control
- Meta configuration (layout, page container type)

**Key Routes:**
- `/` - Home/landing page
- `/dashboard` - Learner dashboard
- `/courses-list` - Course listing
- `/courses-show/:course_id` - Course details
- `/application` - Application management
- `/learning` - Learning dashboard
- `/communities` - Community features
- `/events-list` - Events listing
- `/portfolio` - User portfolio
- `/assessment*` - Assessment pages
- `/assignment/:id` - Assignment pages
- `/universities` - University listing
- `/reels` - Reels content
- `/scholarship*` - Scholarship pages
- `/volunteering*` - Volunteering pages

### Authentication Flow

1. **Login**: POST to `/auth/login` → Receive JWT tokens
2. **Token Storage**: Stored in localStorage/cookies
3. **Token Refresh**: Automatic refresh via refresh token
4. **Protected Routes**: Check token validity before rendering
5. **Role-Based Access**: Authority guard checks user role

**Auth Provider:**
- `AuthProvider` wraps application
- `useAuth()` hook provides user state
- Automatic token refresh
- Logout functionality

### State Management

**Zustand Stores:**
- `authStore` - Authentication state
- `portfolioStore` - Portfolio data
- `courseListStore` - Course listings
- `dashboardStore` - Dashboard data
- `communityStore` - Community data
- `notificationStore` - Notifications
- And many more domain-specific stores

**React Query:**
- Server state management
- Caching, refetching, optimistic updates
- Query invalidation

### API Integration

**Service Layer:**
- Organized by domain (auth, learner, public, etc.)
- Axios-based HTTP client
- Request/response interceptors
- Error handling
- Token attachment

**API Base URL:**
- Configured via `VITE_API_BASE_URL` environment variable
- Default: `http://localhost:5000`

### Key Features

1. **Learning Management**
   - Course enrollment
   - Module progression
   - Assessments
   - Assignments

2. **Community**
   - Posts, comments, likes
   - Community discovery
   - User profiles

3. **Portfolio**
   - Profile builder
   - Public profile view
   - Skills, achievements

4. **Applications**
   - Application wizard
   - Status tracking
   - Document uploads

5. **Events & Scholarships**
   - Event listings
   - Scholarship applications
   - Volunteering opportunities

---

## 3. acado-admin (Admin Dashboard)

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Project Structure

```
acado-admin/
├── src/
│   ├── main.tsx           # Entry point
│   ├── App.tsx            # Root component with routing
│   ├── api/               # API service functions (25 files)
│   │   ├── index.ts       # Central export
│   │   ├── auth.api.ts
│   │   ├── universities.api.ts
│   │   ├── courses.api.ts
│   │   ├── forms.api.ts
│   │   ├── applications.api.ts
│   │   ├── users.api.ts
│   │   └── ... (18 more)
│   ├── components/        # UI components
│   │   ├── ui/            # shadcn/ui components (51 files)
│   │   ├── Layout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── UserLayout.tsx
│   │   ├── UserProtectedRoute.tsx
│   │   ├── UniversityLayout.tsx
│   │   ├── UniversityProtectedRoute.tsx
│   │   └── ... (domain components)
│   ├── pages/             # Page components (93 files)
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Universities.tsx
│   │   ├── Courses.tsx
│   │   ├── Forms.tsx
│   │   ├── ApplicationsOverview.tsx
│   │   ├── user/          # User-facing pages
│   │   ├── university/    # University admin pages
│   │   └── ...
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.tsx
│   │   ├── useUniversityDashboard.ts
│   │   └── ... (10 more)
│   ├── lib/
│   │   └── axios.ts       # Axios instance
│   ├── types/             # TypeScript types (18 files)
│   └── utils/
├── public/
└── package.json
```

### Routing Structure

**Three Main Route Groups:**

1. **Admin Routes** (`/`)
   - Protected by `ProtectedRoute`
   - Layout: `Layout` component
   - Routes:
     - `/` - Dashboard
     - `/master-fields` - Master fields management
     - `/forms` - Form management
     - `/universities` - University CRUD
     - `/courses` - Course management
     - `/users` - User management
     - `/applications-overview` - Application overview
     - `/wall` - Wall posts
     - `/communities` - Community posts
     - `/reels` - Reels management
     - `/events` - Events management
     - `/scholarships` - Scholarships
     - `/talent-pool` - Talent pool
     - `/analytics` - Analytics
     - `/reports` - Reports

2. **User Routes** (`/user`)
   - Protected by `UserProtectedRoute`
   - Layout: `UserLayout`
   - Routes:
     - `/user/dashboard` - User dashboard
     - `/user/courses` - Course listing
     - `/user/apply/:formId` - Application wizard
     - `/user/applications` - My applications
     - `/user/portfolio` - Portfolio
     - `/user/communications` - Communications

3. **University Admin Routes** (`/university`)
   - Protected by `UniversityProtectedRoute`
   - Layout: `UniversityLayout`
   - Routes:
     - `/university/dashboard` - University dashboard
     - `/university/courses` - University courses
     - `/university/forms` - University forms
     - `/university/applications` - Application management
     - `/university/talent` - Talent pool
     - `/university/analytics` - Analytics
     - `/university/reports` - Reports

**Public Routes:**
- `/login` - Admin login
- `/signup` - Admin signup
- `/user/login` - User login
- `/user/register` - User registration
- `/university/login` - University login (if separate)
- `/profile/:username` - Public profile view

### Authentication

**Token Management:**
- Stored via `tokenManager` utility
- Axios interceptor attaches Bearer token
- 401 handling redirects to login
- Token refresh mechanism

**Auth Hook:**
- `useAuth()` provides authentication state
- User info, login, logout functions
- Role checking utilities

### API Integration

**API Functions:**
- Organized by domain in `src/api/`
- Each file exports CRUD functions
- Uses shared Axios instance
- TypeScript typed responses

**Key API Modules:**
- `auth.api.ts` - Authentication
- `universities.api.ts` - University management
- `courses.api.ts` - Course management
- `forms.api.ts` - Form builder
- `applications.api.ts` - Application processing
- `users.api.ts` - User management
- `wallPost.api.ts` - Wall posts
- `communityPost.api.ts` - Community posts
- `event.api.ts` - Events
- `scholarship.api.ts` - Scholarships

### Key Features

1. **Master Data Management**
   - Master fields
   - Course categories, types, levels
   - Learning outcomes
   - Locations

2. **University Management**
   - CRUD operations
   - University details
   - Course association
   - User management

3. **Course Management**
   - Course CRUD
   - Course details
   - Campaign management
   - Learning outcomes

4. **Form Builder**
   - Dynamic form creation
   - Field configuration
   - Form sections

5. **Application Processing**
   - Application overview
   - Selection process configuration
   - Application review
   - Acceptance letters

6. **Engagement Builder**
   - Wall posts
   - Community posts
   - Reels
   - Events
   - Scholarships

7. **Analytics & Reports**
   - Dashboard analytics
   - User analytics
   - Application reports
   - Talent pool analytics

8. **Talent Management**
   - Talent pool
   - Candidate search
   - Saved profiles
   - Communications

---

## Common Patterns & Architecture

### Authentication Flow

1. **Login**: User submits credentials → API validates → Returns JWT tokens
2. **Token Storage**: Frontend stores tokens (localStorage/cookies)
3. **Request Interceptor**: Axios attaches `Authorization: Bearer <token>` header
4. **Token Validation**: Backend middleware validates token, extracts user info
5. **Role Checking**: RBAC middleware checks user role for protected routes
6. **Token Refresh**: Automatic refresh using refresh token before expiry

### API Communication Pattern

**Backend:**
```
Request → Middleware (auth, validate, rbac) → Controller → Service → Model → Response
```

**Frontend:**
```
Component → Hook/Service → API Function → Axios → Backend API
```

### Error Handling

**Backend:**
- Centralized error middleware
- Zod validation errors
- MongoDB errors
- Custom error types

**Frontend:**
- Axios interceptors for 401/403
- React Query error handling
- Error boundaries
- Toast notifications

### Data Flow

1. **Read Operations:**
   - Component → React Query Hook → API Service → Backend → Database
   - Cached in React Query cache

2. **Write Operations:**
   - Component → Form Submit → API Service → Backend → Database
   - Optimistic updates
   - Cache invalidation

### File Upload Pattern

1. Frontend: FormData with file
2. Backend: Multer middleware → Azure Blob Storage
3. Response: File URL returned
4. Frontend: Store URL in form data

---

## Development Workflow

### Backend (acado-api)
```bash
cd acado-api
npm install
npm run dev        # Development with hot reload
npm run build      # Build TypeScript
npm run start      # Run production build
npm run seed:dev   # Seed database
```

### Frontend Client (acado-client)
```bash
cd acado-client
npm install
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Frontend Admin (acado-admin)
```bash
cd acado-admin
npm install
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

---

## Environment Variables

### Backend (acado-api)
- `PORT` - Server port
- `MONGO_URI` - MongoDB connection
- `JWT_ACCESS_SECRET` - JWT secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `CORS_ORIGIN` - Allowed origins
- `EMAIL_*` - SMTP configuration
- `AZURE_STORAGE_*` - Azure Blob Storage

### Frontend Client (acado-client)
- `VITE_API_BASE_URL` - Backend API URL

### Frontend Admin (acado-admin)
- `VITE_API_BASE_URL` - Backend API URL

---

## Key Dependencies

### Backend
- express, mongoose, jsonwebtoken, bcryptjs
- zod, multer, @azure/storage-blob
- pino, swagger-ui-express

### Frontend Client
- react, react-router-dom, @tanstack/react-query
- zustand, axios, react-hook-form
- tailwindcss, framer-motion

### Frontend Admin
- react, react-router-dom, @tanstack/react-query
- axios, react-hook-form
- @radix-ui/*, tailwindcss

---

## Next Steps for Development

1. **Understand the data models** - Review Mongoose schemas
2. **Review API endpoints** - Check route definitions and controllers
3. **Understand authentication** - Review auth middleware and token flow
4. **Review frontend routing** - Understand route structure and guards
5. **Check API integration** - Review service layer and API functions
6. **Understand state management** - Review Zustand stores and React Query usage

This analysis provides a comprehensive overview of all three projects. Use this as a reference when making changes or adding new features.

