# Akedo Form Builder - Backend API Service

RESTful API service with JWT authentication, role-based access control, and MongoDB database for form builder application.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Loading Sample Data](#loading-sample-data)
- [Default User Accounts](#default-user-accounts)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Role-Based Permissions](#role-based-permissions)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Backend API Service provides a comprehensive solution for managing university application forms:
- **RESTful API** - Express.js with TypeScript
- **Authentication** - JWT-based authentication with bcrypt password hashing
- **Authorization** - Role-based access control (Admin, Editor, User)
- **Database** - MongoDB with Mongoose ODM
- **Documentation** - OpenAPI/Swagger interactive documentation
- **Validation** - Zod schema validation for all endpoints
- **Security** - Rate limiting, CORS, helmet, and comprehensive error handling
- **Form Builder** - Dynamic form creation and field configuration
- **University Management** - Manage universities and their courses
- **Course Management** - Manage degree programs, exchanges, pathways, and certifications

---

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication with bcrypt password hashing
- ✅ Role-based access control (SuperAdmin, Admin, Presenter, Learner)
- ✅ User profile management and password change
- ✅ Token refresh mechanism

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

### Course Management
- ✅ Course CRUD operations
- ✅ Multiple course types (degree, exchange, pathway, diploma, certification)
- ✅ Course levels (undergraduate, postgraduate, doctoral)
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

### Technical Features
- ✅ RESTful API with Express.js and TypeScript
- ✅ MongoDB database with Mongoose ODM
- ✅ OpenAPI/Swagger interactive documentation
- ✅ Zod schema validation for all endpoints
- ✅ Rate limiting and security headers (Helmet.js)
- ✅ CORS configuration
- ✅ Comprehensive error handling
- ✅ Health check endpoint
- ✅ Database seeding scripts
- ✅ Request logging with Pino

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

### 1. Navigate to Backend Directory

```bash
cd backend-service
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js, Mongoose, bcryptjs, jsonwebtoken
- TypeScript and development dependencies
- Validation and security packages

---

## ⚙️ Configuration

Create a `.env` file in the `backend-service` directory (optional, defaults work fine):

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# Database
MONGO_URI=mongodb://localhost:27017/masterfields

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:8080,http://localhost:3000,http://localhost:5173
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `4000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/masterfields` | MongoDB connection string |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |
| `CORS_ORIGIN` | Multiple origins | Allowed CORS origins |

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

## 📊 Loading Sample Data

### Method 1: MongoDB Direct Insert (Fastest - No Node.js Required)

Use pure MongoDB scripts to insert data directly - perfect for quick setup or CI/CD:

#### Windows:
```batch
cd backend-service
insert-seed.bat
```

#### Linux/Mac:
```bash
cd backend-service
./insert-seed.sh
```

#### Direct Command:
```bash
cd backend-service
mongosh "mongodb://localhost:27017/akedo-form-builder" insert-seed-data.js
```

**What gets inserted:**
- **10 categories** with 21 subcategories
- **70+ fields** with proper relationships
- All data with Mongoose-compatible structure

**Benefits:**
- ⚡ Very fast (direct MongoDB insertion)
- 🎯 No Node.js dependencies required
- 🤖 Perfect for CI/CD pipelines
- 📝 Interactive connection setup

**Note:** This method only inserts categories and fields. For users, universities, and forms, use the Node.js seeders below.

📖 **Full Guide**: See [INSERT-SEED-DATA-GUIDE.md](./INSERT-SEED-DATA-GUIDE.md) and [SEED-DATA-QUICK-REFERENCE.md](./SEED-DATA-QUICK-REFERENCE.md)

---

### Method 2: Node.js Seeders (Integrated with Application)

#### 1. Create Default Users

```bash
npm run seed:users
```

This creates three users with different roles:

| Email | Password | Role |
|-------|----------|------|
| `superadmin@example.com` | `superadmin123` | SuperAdmin |
| `admin@example.com` | `admin123` | Admin |
| `presenter@example.com` | `presenter123` | Presenter |
| `learner@example.com` | `learner123` | Learner |

#### 2. Load Master Fields and Categories

```bash
npm run seed
```

This loads:
- **10 categories**: Personal, Education, Experience, Skills, References, Documents, Employment, Projects, Certifications, Preferences
- **25+ subcategories**: Various subcategories under each category
- **67+ master fields**: Text inputs, dropdowns, date pickers, file uploads, etc.

#### 3. Load Universities and Courses

```bash
npm run seed:universities
```

This loads sample universities from around the world with details including:
- University names
- Countries and cities
- Descriptions
- Website URLs
- Rankings
- Logos
- **Also creates 4 sample courses per university**

#### 4. Load Additional Courses (Optional)

```bash
npm run seed:courses
```

This creates additional courses for existing universities. This script:
- Checks if universities exist in the database
- Creates 4-6 courses per university
- Includes various course types (degree, exchange, pathway, diploma, certification)
- Includes different levels (undergraduate, postgraduate, doctoral)
- Adjusts fees based on university ranking
- Sets application deadlines and start dates

**Note**: Run `npm run seed:universities` first, as this script requires universities to exist.

#### 5. Load Location Hierarchy (Countries → States → Cities)

```bash
npm run seed:locations            # Imports src/data/locations.sample.csv by default
npm run seed:locations -- --append ./path/to/your-file.xlsx   # Append/update from custom file
```

This script ingests a three-column dataset (**Country**, **State/Province**, **City**) from Excel or CSV and stores the normalized hierarchy in MongoDB.

- Default input lives at `src/data/locations.sample.csv` – replace it with your own master file or pass a path as the first argument.
- Use `--append` to merge new rows without clearing the collection. By default the script performs an upsert after wiping the existing collection to keep data in sync with the file.
- Each row must include all three values; blank entries are skipped automatically.

Once imported, the new `/locations` API can serve cascading dropdowns for the frontend.

#### 6. Load Sample Forms

```bash
npm run seed:forms
```

This loads sample application forms with:
- Pre-configured fields
- Different form statuses (draft, published)
- University associations
- Custom category names

#### 6. Check Database Status

```bash
npm run seed:check
```

Shows comprehensive database statistics including count of:
- Users (by role)
- Categories and subcategories
- Fields (by category)
- Forms (by status)
- Universities (by country)
- Courses (by type and level)

#### 7. Clear Database

```bash
npm run seed:clear
```

Removes **ALL** data from the database including:
- Users
- Categories and fields
- Forms
- Universities and courses

#### 8. Reset Database

```bash
npm run db:reset
```

Clears all data and re-seeds categories/fields (does not re-create users, universities, or forms).

#### 9. Full Setup (All at Once)

```bash
npm run seed:users && npm run seed && npm run seed:universities && npm run seed:forms
```

This creates users, master fields/categories, universities (with courses), and sample forms in one command.

**Alternative**: Load additional courses separately:
```bash
npm run seed:users && npm run seed && npm run seed:universities && npm run seed:courses && npm run seed:forms
```

---

### 🆚 Comparison: MongoDB Direct vs Node.js Seeders

| Feature | MongoDB Direct (`insert-seed.sh`) | Node.js (`npm run seed`) |
|---------|----------------------------------|--------------------------|
| **Speed** | ⚡ Very Fast | ⚡ Fast |
| **Setup** | Only needs mongosh | Needs Node.js + npm |
| **Configuration** | Manual or interactive | Uses .env file |
| **Dependencies** | None (just mongosh) | Requires packages |
| **What it seeds** | Categories + Fields only | Categories + Fields |
| **Use case** | Quick setup, CI/CD | Development workflow |
| **Platform** | Cross-platform | Cross-platform |

---

## 👥 Default User Accounts

### SuperAdmin User
```
Email: superadmin@example.com
Password: superadmin123
Role: superadmin
```
**Permissions**: Full system access - All Create, Read, Update, Delete, Publish operations

### Admin User
```
Email: admin@example.com
Password: admin123
Role: admin
```
**Permissions**: Full access - Create, Read, Update, Delete (Cannot manage system settings)

### Presenter User
```
Email: presenter@example.com
Password: presenter123
Role: presenter
```
**Permissions**: Create, Read, Update (Cannot Delete or Publish)

### Learner User
```
Email: learner@example.com
Password: learner123
Role: learner
```
**Permissions**: Read-only access, Can submit applications

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
   - Copy the `token` from the response

2. **Authorize**:
   - Click the 🔓 "Authorize" button at the top right
   - Enter: `Bearer <paste-your-token-here>`
   - Click "Authorize"
   - Click "Close"

3. **Test Endpoints**:
   - Now you can test any protected endpoint directly from Swagger UI

### API Endpoints

#### Authentication Endpoints
```
POST   /auth/login              # Login with email/password
POST   /auth/register           # Register new user
GET    /auth/profile            # Get current user (requires auth)
PUT    /auth/profile            # Update profile (requires auth)
POST   /auth/change-password    # Change password (requires auth)
POST   /auth/refresh            # Refresh JWT token (requires auth)
```

#### Form Endpoints
```
GET    /forms                   # List all forms (filter by: status, universityId, search)
POST   /forms                   # Create form (Admin/Editor)
GET    /forms/:id               # Get form by ID with all configured fields
PUT    /forms/:id               # Update form (Admin/Editor)
PATCH  /forms/:id               # Partially update form (Admin/Editor)
DELETE /forms/:id               # Delete form (Admin only)
POST   /forms/:id/publish       # Publish form (Admin only)
POST   /forms/:id/archive       # Archive form (Admin/Editor)
POST   /forms/:id/duplicate     # Duplicate form (Admin/Editor)
```

#### Category Endpoints
```
GET    /masterCategories        # List all categories
POST   /masterCategories        # Create category (Admin/Editor)
GET    /masterCategories/:id    # Get category by ID
PUT    /masterCategories/:id    # Update category (Admin/Editor)
DELETE /masterCategories/:id    # Delete category (Admin only)
POST   /masterCategories/:id/subcategories       # Add subcategory (Admin/Editor)
PUT    /masterCategories/:id/subcategories/:sid  # Update subcategory (Admin/Editor)
DELETE /masterCategories/:id/subcategories/:sid  # Delete subcategory (Admin only)
```

#### Field Endpoints
```
GET    /masterFields            # List/search fields (query params: category, subcategory, type)
POST   /masterFields            # Create field (Admin/Editor)
GET    /masterFields/:id        # Get field by ID
PUT    /masterFields/:id        # Update field (Admin/Editor)
DELETE /masterFields/:id        # Delete field (Admin only)
```

#### University Endpoints
```
GET    /universities            # List all universities (filter by: country, search, isActive)
POST   /universities            # Create university (Admin only)
GET    /universities/:id        # Get university by ID
PUT    /universities/:id        # Update university (Admin only)
PATCH  /universities/:id        # Partially update university (Admin only)
DELETE /universities/:id        # Delete university (Admin only)
GET    /universities/:id/courses # Get all courses for a university
```

#### Course Endpoints
```
GET    /courses                 # List all courses (filter by: universityId, type, level, search)
POST   /courses                 # Create course (Admin/Editor)
GET    /courses/:id             # Get course by ID
PUT    /courses/:id             # Update course (Admin/Editor)
PATCH  /courses/:id             # Partially update course (Admin/Editor)
DELETE /courses/:id             # Delete course (Admin only)
```

#### Application Endpoints
```
GET    /applications            # List applications (filter by: userId, universityId, courseId, formId, status)
POST   /applications            # Submit new application (Authenticated users)
GET    /applications/stats      # Get application statistics by status
GET    /applications/:id        # Get application by ID
PUT    /applications/:id        # Update application (Admin/Editor)
DELETE /applications/:id        # Delete application (Admin only)
POST   /applications/:id/submit # Submit a draft application
POST   /applications/:id/withdraw # Withdraw an application
POST   /applications/:id/review # Review application - accept/reject (Admin/Editor only)
```

#### Location Endpoints
```
GET    /locations/countries     # List distinct countries (public)
GET    /locations/states        # Query states by ?country=Name (public)
GET    /locations/cities        # Query cities by ?country=Name&state=Name (public)
```
> Legacy `/v1/locations/...` routes are also available for backward compatibility.

#### Health Check
```
GET    /health                  # API health status
```

### Example API Calls

#### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "isActive": true
  }
}
```

#### Get Categories (No Auth Required)
```bash
curl http://localhost:4000/masterCategories
```

#### Create Category (Auth Required)
```bash
curl -X POST http://localhost:4000/masterCategories \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test Category",
    "icon": "Folder",
    "description": "Test description",
    "order": 11
  }'
```

#### Search Fields by Category
```bash
curl "http://localhost:4000/masterFields?category=CATEGORY_ID"
```

#### Create a Form (Auth Required)
```bash
curl -X POST http://localhost:4000/forms \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "undergraduate-application-2024",
    "title": "Undergraduate Application Form 2024",
    "description": "Application form for Fall 2024 undergraduate programs",
    "status": "draft",
    "fields": []
  }'
```

#### Get All Universities
```bash
curl http://localhost:4000/universities
```

#### Create a University (Admin Only)
```bash
curl -X POST http://localhost:4000/universities \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Stanford University",
    "country": "United States",
    "city": "Stanford",
    "website": "https://www.stanford.edu",
    "ranking": 3
  }'
```

#### Get Courses by University
```bash
curl "http://localhost:4000/universities/UNIVERSITY_ID/courses"
```

#### Create a Course (Admin/Editor)
```bash
curl -X POST http://localhost:4000/courses \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "universityId": "UNIVERSITY_ID",
    "name": "Master of Computer Science",
    "type": "degree",
    "level": "postgraduate",
    "duration": "2 years",
    "fee": 55000,
    "currency": "USD"
  }'
```

#### Publish a Form (Admin Only)
```bash
curl -X POST http://localhost:4000/forms/FORM_ID/publish \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

#### Submit an Application
```bash
curl -X POST http://localhost:4000/applications \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "user@example.com",
    "universityId": "UNIVERSITY_ID",
    "courseId": "COURSE_ID",
    "formId": "FORM_ID",
    "formData": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "status": "submitted",
    "metadata": {
      "completionTime": 300
    }
  }'
```

#### Get User's Applications
```bash
curl "http://localhost:4000/applications?userId=user@example.com&status=submitted" \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

#### Get Application Statistics
```bash
curl http://localhost:4000/applications/stats \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

#### Review Application (Admin/Editor)
```bash
curl -X POST http://localhost:4000/applications/APPLICATION_ID/review \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "accepted",
    "reviewNotes": "Excellent candidate with strong qualifications"
  }'
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload (uses tsx watch)
npm run build            # Build TypeScript to JavaScript (output to dist/)
npm run start            # Start production server (runs compiled code from dist/)

# Database Operations
npm run seed             # Load categories and fields sample data
npm run seed:users       # Create default users (admin, editor, user)
npm run seed:universities # Load sample universities
npm run seed:forms       # Load sample application forms
npm run seed:locations   # Import country/state/city hierarchy from Excel or CSV
npm run seed:check       # Check database status (show counts of all collections)
npm run seed:clear       # Clear all data from database
npm run db:reset         # Clear and re-seed categories/fields
npm run db:status        # Alias for seed:check - show database status

# Code Quality
npm run lint             # Run ESLint

# Testing
npm run test             # Run tests (if configured)
```

---

## 🔐 Role-Based Permissions

### Permission Matrix

| Action | SuperAdmin | Admin | Presenter | Learner | Guest |
|--------|:----------:|:-----:|:---------:|:-------:|:-----:|
| **View** categories/fields/forms/universities/courses | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View** profile | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View** own applications | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View** all applications | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Create** categories/fields/forms/courses | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Create** universities | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Create** applications (submit) | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Update** categories/fields/forms/courses | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Update** universities | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Update** own draft applications | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Update** any applications | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Delete** categories/fields/forms/courses/universities | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Delete** applications | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Publish** forms | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Archive** forms | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Duplicate** forms | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Review** applications (accept/reject) | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Withdraw** own applications | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Register** new users | ✅ | ❌ | ❌ | ❌ | ✅ |

### Middleware Usage

The API uses two main middleware for authorization:

1. **`requireAuth`**: Requires valid JWT token
2. **`permit(...roles)`**: Requires specific role(s)

Example route protection:
```typescript
// Forms - SuperAdmin/Admin/Presenter can create, only SuperAdmin/Admin can publish
router.post('/forms', 
  requireAuth, 
  permit('superadmin', 'admin', 'presenter'), 
  formController.create
);

router.post('/forms/:id/publish', 
  requireAuth, 
  permit('superadmin', 'admin'), 
  formController.publish
);

// Universities - SuperAdmin/Admin only
router.post('/universities', 
  requireAuth, 
  permit('superadmin', 'admin'), 
  universityController.create
);

// Courses - SuperAdmin/Admin/Presenter can manage
router.post('/courses', 
  requireAuth, 
  permit('superadmin', 'admin', 'presenter'), 
  courseController.create
);

// Applications - All authenticated users can create
router.post('/applications', 
  requireAuth, 
  applicationController.create
);

// Applications - SuperAdmin/Admin/Presenter can review
router.post('/applications/:id/review', 
  requireAuth, 
  permit('superadmin', 'admin', 'presenter'), 
  applicationController.review
);

// Categories - SuperAdmin/Admin/Presenter can create/update, only SuperAdmin/Admin can delete
router.delete('/masterCategories/:id', 
  requireAuth, 
  permit('superadmin', 'admin'), 
  categoryController.delete
);
```

---

## 📁 Project Structure

```
backend-service/
├── src/
│   ├── controllers/           # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── field.controller.ts
│   │   ├── form.controller.ts
│   │   ├── university.controller.ts
│   │   ├── course.controller.ts
│   │   ├── application.controller.ts
│   │   └── location.controller.ts
│   ├── models/                # Mongoose models
│   │   ├── Category.ts
│   │   ├── Field.ts
│   │   ├── Form.ts
│   │   ├── University.ts
│   │   ├── Course.ts
│   │   ├── Application.ts
│   │   ├── User.ts
│   │   └── Location.ts
│   ├── routes/                # Express routes
│   │   ├── auth.routes.ts
│   │   ├── category.routes.ts
│   │   ├── field.routes.ts
│   │   ├── form.routes.ts
│   │   ├── university.routes.ts
│   │   ├── course.routes.ts
│   │   ├── application.routes.ts
│   │   ├── location.routes.ts
│   │   └── index.ts
│   ├── services/              # Business logic
│   │   ├── category.service.ts
│   │   ├── field.service.ts
│   │   ├── form.service.ts
│   │   ├── university.service.ts
│   │   ├── course.service.ts
│   │   ├── application.service.ts
│   │   └── location.service.ts
│   ├── middleware/            # Custom middleware
│   │   ├── auth.ts           # JWT verification
│   │   ├── rbac.ts           # Role-based access control
│   │   ├── validate.ts       # Zod validation
│   │   ├── error.ts          # Error handling
│   │   └── rateLimit.ts      # Rate limiting
│   ├── schemas/               # Zod validation schemas
│   │   ├── category.schema.ts
│   │   ├── field.schema.ts
│   │   ├── form.schema.ts
│   │   ├── application.schema.ts
│   │   ├── location.schema.ts
│   │   └── shared.ts
│   ├── seed/                  # Database seeders
│   │   ├── seed.ts           # Category/field seeder
│   │   ├── seed-users.ts     # User seeder
│   │   ├── seed-forms.ts     # Form seeder
│   │   ├── seed-universities.ts # University seeder
│   │   ├── seed-locations.ts # Location hierarchy importer
│   │   ├── check-db.ts       # Database status checker
│   │   └── clear-db.ts       # Database clearer
│   ├── data/                 # Static datasets
│   │   └── locations.sample.csv
│   ├── docs/                  # API documentation
│   │   └── openapi.ts        # OpenAPI/Swagger spec
│   ├── db/                    # Database connection
│   │   └── mongoose.ts
│   ├── config/                # Configuration
│   │   └── env.ts
│   ├── utils/                 # Utilities
│   │   ├── ApiError.ts
│   │   └── logger.ts
│   ├── types/                 # TypeScript types
│   │   └── express-request-id.d.ts
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Entry point
├── dist/                      # Compiled JavaScript (generated)
├── .env                       # Environment variables (create this)
├── package.json
├── tsconfig.json
├── docker-compose.yaml        # Docker Compose configuration
├── Dockerfile                 # Docker configuration
└── README.md
```

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

# Solution: Create .env file with JWT_SECRET
echo "JWT_SECRET=your-secure-random-string-here" > .env
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

# Solution: Load sample data
npm run seed:users
npm run seed
npm run seed:check  # Verify data loaded
```

### Authentication fails
```bash
# Error: Invalid email or password

# Solution: Make sure users are created
npm run seed:users

# Then try login with correct credentials:
# admin@example.com / admin123
```

### Reset everything
```bash
# Start fresh with clean database

# Stop the server (Ctrl+C)
npm run seed:clear      # Clear all data
npm run seed:users      # Recreate users
npm run seed            # Reload categories/fields
npm run dev             # Restart server
```

---

## 🔒 Security Features

- ✅ **Password Hashing**: bcrypt with 10 salt rounds
- ✅ **JWT Tokens**: 7-day expiration, signed with secret
- ✅ **CORS Protection**: Configurable allowed origins
- ✅ **Rate Limiting**: 100 requests per 15 minutes per IP
- ✅ **Security Headers**: Helmet.js for security headers
- ✅ **Input Validation**: Zod schemas for all endpoints
- ✅ **Role-Based Access Control**: Admin, Editor, User roles
- ✅ **Error Handling**: Generic error messages in production
- ✅ **Request ID**: Unique ID for each request (logging)

---

## 📖 Additional Information

### Authentication Flow

1. User sends email/password to `/auth/login`
2. Server validates credentials against database
3. If valid, server generates JWT token
4. Client stores token and sends it in `Authorization` header
5. Server verifies token on protected routes
6. Server grants access based on user's role

### Development vs Production

**Development Mode** (`NODE_ENV=development`):
- Detailed error messages with stack traces
- Console logging enabled
- CORS allows multiple origins
- Hot reload with nodemon

**Production Mode** (`NODE_ENV=production`):
- Generic error messages
- Structured logging
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
- [ ] Default users created (`npm run seed:users`)
- [ ] Master fields/categories loaded (`npm run seed`)
- [ ] Sample universities loaded (`npm run seed:universities`)
- [ ] Sample forms loaded (`npm run seed:forms`)
- [ ] Database status verified (`npm run seed:check`)
- [ ] Server running (`npm run dev`)
- [ ] Health check passes (http://localhost:4000/health)
- [ ] Swagger docs accessible (http://localhost:4000/docs)
- [ ] Can login with admin credentials
- [ ] Can view forms, universities, courses, and applications endpoints

**Next Step**: Start the frontend application to interact with this API!

Happy coding! 🚀

