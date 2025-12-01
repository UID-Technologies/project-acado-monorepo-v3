# Akedo Form Builder - Frontend React Application

Modern React application with TypeScript, Tailwind CSS, and shadcn/ui components for form builder management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Role-Based UI](#role-based-ui)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Frontend React Application provides:
- **Modern UI** - Beautiful and responsive design with Tailwind CSS
- **TypeScript** - Type-safe React components and hooks
- **Authentication** - JWT token management and role-based access
- **Master Fields** - Interface for managing categories, subcategories, and fields
- **Form Builder** - Dynamic form creation and management
- **shadcn/ui** - High-quality, accessible UI components

---

## ✨ Features

- ✅ React 18 with TypeScript
- ✅ Modern UI with Tailwind CSS and shadcn/ui
- ✅ JWT token management (automatic storage and refresh)
- ✅ Role-based UI components (show/hide based on permissions)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Master fields management interface
- ✅ Real-time form validation
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Protected routes with role checking
- ✅ Axios interceptors for authentication
- ✅ React Router for navigation

---

## 🛠 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)

---

## 📋 Prerequisites

- **Node.js** - v18.x or higher ([Download](https://nodejs.org/))
- **npm** - v9.x or higher (comes with Node.js)
- **Backend API** - Must be running on http://localhost:4000

### Verify Installation

```bash
node --version    # Should show v18.x or higher
npm --version     # Should show v9.x or higher
```

---

## 📦 Installation

### 1. Navigate to Frontend Directory

```bash
cd frontend-react-web
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React, React Router, Axios
- Tailwind CSS, shadcn/ui components
- TypeScript and development dependencies

---

## ⚙️ Configuration

### Create Environment File

Create a `.env` file in the `frontend-react-web` directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:4000` | Backend API base URL |

**Note**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client.

---

## 🚀 Running the Application

### Prerequisites
Make sure the backend API is running first:
```bash
cd backend-service
npm run dev
```

### Start Frontend Development Server

```bash
npm run dev
```

Frontend will run at: **http://localhost:5173** (or the port shown in terminal)

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

You'll be redirected to the login page if not authenticated.

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build for production (output to dist/)
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check

# Testing
npm run test             # Run tests (if configured)
```

---

## 📁 Project Structure

```
frontend-react-web/
├── src/
│   ├── api/                    # API client services
│   │   ├── auth.api.ts         # Authentication API
│   │   ├── masterFields.api.ts # Categories/Fields API
│   │   ├── forms.api.ts        # Forms API
│   │   └── index.ts            # API exports
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── forms/              # Form-related components
│   │   ├── masterFields/       # Master fields components
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useMasterFieldsManagement.ts
│   │   ├── useFormsData.ts
│   │   └── use-toast.ts
│   ├── pages/                  # Page components
│   │   ├── Login.tsx           # Login page
│   │   ├── Signup.tsx          # Registration page
│   │   ├── Dashboard.tsx       # Dashboard page
│   │   ├── MasterFields.tsx    # Master fields page
│   │   └── Forms.tsx           # Forms page
│   ├── lib/                    # Utilities
│   │   ├── axios.ts            # Axios instance with interceptors
│   │   └── utils.ts            # Helper functions
│   ├── types/                  # TypeScript types
│   │   ├── auth.ts
│   │   ├── forms.ts
│   │   └── masterFields.ts
│   ├── App.tsx                 # App component with routes
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── .env                        # Environment variables (create this)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🔐 Authentication

### Login Flow

1. User navigates to `/login`
2. Enters email and password
3. Frontend calls `/auth/login` API
4. Backend returns JWT token and user data
5. Frontend stores token in `localStorage`
6. User is redirected to dashboard
7. Token is automatically added to all API requests

### Default Login Credentials

| User Type | Email | Password | Role |
|-----------|-------|----------|------|
| **SuperAdmin** | `superadmin@example.com` | `superadmin123` | superadmin |
| **Admin** | `admin@example.com` | `admin123` | admin |
| **Presenter** | `presenter@example.com` | `presenter123` | presenter |
| **Learner** | `learner@example.com` | `learner123` | learner |

### Using the `useAuth` Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated, isAdmin, canCreate } = useAuth();

  const handleLogin = async () => {
    try {
      await login('admin@example.com', 'admin123');
      // User is now logged in
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      {isAuthenticated() ? (
        <>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

### Protected Routes

Routes are protected using the `ProtectedRoute` component:

```typescript
<Route
  path="/master-fields"
  element={
    <ProtectedRoute>
      <MasterFields />
    </ProtectedRoute>
  }
/>
```

---

## 🎨 Role-Based UI

### Permission Matrix

| Action | SuperAdmin | Admin | Presenter | Learner | Guest |
|--------|:----------:|:-----:|:---------:|:-------:|:-----:|
| **View** categories/fields | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Create** categories/fields | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Update** categories/fields | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Delete** categories/fields | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Publish** forms | ✅ | ✅ | ❌ | ❌ | ❌ |

### Using Role Helpers

```typescript
import { useAuth } from '@/hooks/useAuth';

const MasterFieldsPage = () => {
  const { user, isSuperAdmin, isAdmin, isPresenter, canCreate, canDelete, canPublish, hasRole } = useAuth();

  return (
    <div>
      {/* Show to all authenticated users */}
      <p>Welcome, {user?.name}!</p>
      
      {/* Show only to superadmin/admin/presenter */}
      {canCreate() && (
        <Button onClick={handleCreate}>
          Add New Category
        </Button>
      )}
      
      {/* Show only to superadmin/admin */}
      {canDelete() && (
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      )}
      
      {/* Show only to superadmin/admin */}
      {canPublish() && (
        <Button onClick={handlePublish}>
          Publish Form
        </Button>
      )}
      
      {/* Check if superadmin */}
      {isSuperAdmin() && <SuperAdminPanel />}
      
      {/* Check if admin */}
      {isAdmin() && <AdminSettings />}
      
      {/* Check if presenter */}
      {isPresenter() && <PresenterTools />}
      
      {/* Check specific role */}
      {hasRole(['superadmin', 'admin']) && <AdminPanel />}
    </div>
  );
};
```

### Role Helper Functions

- `isAuthenticated()` - Check if user is logged in
- `isSuperAdmin()` - Check if user has superadmin role
- `isAdmin()` - Check if user has admin role
- `isPresenter()` - Check if user has presenter role
- `isLearner()` - Check if user has learner role
- `canCreate()` - Check if user can create (superadmin, admin, or presenter)
- `canDelete()` - Check if user can delete (superadmin or admin)
- `canPublish()` - Check if user can publish (superadmin or admin)
- `hasRole(role)` - Check if user has specific role(s)

---

## 🔌 API Integration

### Axios Configuration

The application uses a pre-configured Axios instance with:
- Automatic authentication header injection
- Request/response interceptors
- Error handling
- Base URL configuration

```typescript
// lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor - adds JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Service Example

```typescript
// api/masterFields.api.ts
import api from '@/lib/axios';

export const masterFieldsApi = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/masterCategories');
    return response.data;
  },

  // Create category
  createCategory: async (data: CategoryData) => {
    const response = await api.post('/masterCategories', data);
    return response.data;
  },

  // Update category
  updateCategory: async (id: string, data: CategoryData) => {
    const response = await api.put(`/masterCategories/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: string) => {
    await api.delete(`/masterCategories/${id}`);
  },
};
```

---

## 🧪 Testing the Application

### 1. Login Test

1. Start backend and frontend
2. Navigate to http://localhost:5173/login
3. Enter credentials: `admin@example.com` / `admin123`
4. Click "Sign In"
5. Should see: "Welcome back, Admin User!" toast
6. Redirected to dashboard

### 2. Token Verification

After login, open DevTools (F12):
1. Go to Application tab > Local Storage
2. Should see:
   - `token`: JWT token string
   - `user`: User object JSON

### 3. API Call Verification

1. Login as admin
2. Navigate to Master Fields page
3. Open DevTools > Network tab
4. Perform an action (e.g., view categories)
5. Check the request:
   - Should see `Authorization: Bearer <token>` header
   - Should get 200 OK response

### 4. Role-Based UI Test

1. Login as `user@example.com` / `user123`
2. Navigate to Master Fields
3. Should NOT see "Add Category" or "Delete" buttons
4. Logout and login as `admin@example.com` / `admin123`
5. Should see "Add Category" and "Delete" buttons

---

## 🚨 Troubleshooting

### Cannot connect to backend

```bash
# Error: Network Error / ERR_CONNECTION_REFUSED

# Solution 1: Make sure backend is running
cd backend-service
npm run dev

# Solution 2: Check VITE_API_BASE_URL in .env
VITE_API_BASE_URL=http://localhost:4000

# Solution 3: Restart frontend after changing .env
# Stop server (Ctrl+C) and run:
npm run dev
```

### Login fails with 401

```bash
# Error: Invalid email or password

# Solution: Make sure default users are created in backend
cd backend-service
npm run seed:users

# Then try login again with correct credentials
```

### Token expired error

```bash
# Error: JWT expired / 401 Unauthorized

# Solution: Login again to get new token
# Tokens expire in 7 days by default
# You'll be automatically redirected to login page
```

### No data showing on Master Fields page

```bash
# Error: Empty page or "No categories found"

# Solution: Load sample data in backend
cd backend-service
npm run seed          # Load categories and fields
npm run seed:check    # Verify data loaded
```

### TypeScript errors

```bash
# Error: Type errors in IDE

# Solution: Make sure dependencies are installed
npm install

# Restart TypeScript server in VS Code
# Cmd+Shift+P > "TypeScript: Restart TS Server"
```

### Styling not working

```bash
# Error: Styles not applying

# Solution: Make sure Tailwind CSS is configured
# Check tailwind.config.ts and postcss.config.js exist
# Restart dev server
npm run dev
```

### Port 5173 already in use

```bash
# Error: Port 5173 is already in use

# Solution 1: Kill process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5173 | xargs kill

# Solution 2: Use a different port
# Vite will automatically use next available port
```

### Environment variables not working

```bash
# Error: import.meta.env.VITE_API_BASE_URL is undefined

# Solution:
# 1. Make sure .env file exists in frontend-react-web/
# 2. Variable must be prefixed with VITE_
# 3. Restart dev server after creating/modifying .env
```

---

## 🎨 UI Components

The application uses [shadcn/ui](https://ui.shadcn.com/) components, which are:
- **Accessible**: ARIA compliant
- **Customizable**: Built with Tailwind CSS
- **Copy-paste friendly**: Own the code
- **Type-safe**: Full TypeScript support

### Available Components

- Button, Input, Textarea, Select
- Dialog, Sheet, Popover, Dropdown Menu
- Table, Card, Badge, Avatar
- Toast, Alert, Progress
- Form components with validation
- And many more...

### Using Components

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';

const MyForm = () => {
  return (
    <div>
      <Input placeholder="Enter name" />
      <Button>Submit</Button>
    </div>
  );
};
```

---

## 📖 Additional Information

### State Management

The application uses React hooks for state management:
- **useState** - Local component state
- **useEffect** - Side effects and data fetching
- **Custom hooks** - Reusable logic (useAuth, useMasterFieldsManagement)

### Routing

React Router v6 is used for navigation:

```typescript
// App.tsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/master-fields" element={<MasterFields />} />
    <Route path="/forms" element={<Forms />} />
  </Route>
</Routes>
```

### Form Validation

Forms use Zod schemas for validation (same as backend):

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
```

---

## 🌐 Application URLs

| Page | URL | Description |
|------|-----|-------------|
| **Login** | http://localhost:5173/login | User login page |
| **Signup** | http://localhost:5173/signup | User registration |
| **Dashboard** | http://localhost:5173/dashboard | Main dashboard |
| **Master Fields** | http://localhost:5173/master-fields | Manage categories/fields |
| **Forms** | http://localhost:5173/forms | Form builder |

---

## 🎉 You're Ready!

Your Frontend Application is now set up and ready to use!

### Quick Verification Checklist

- [ ] Backend API is running (http://localhost:4000)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with `VITE_API_BASE_URL`
- [ ] Frontend running (`npm run dev`)
- [ ] Can access login page (http://localhost:5173/login)
- [ ] Can login with admin credentials
- [ ] Can see master fields page
- [ ] Can perform CRUD operations (based on role)

**Next Step**: Start building amazing forms! 🎨

Happy coding! 🚀

