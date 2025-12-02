# Acado-API Authentication Integration

## Overview

The `acado-client` application has been integrated with the `acado-api` authentication system. This document outlines the changes made and what still needs to be implemented.

## ✅ Completed Changes

### 1. **Endpoint Configuration** (`src/app/config/endpoint.config.ts`)
- Updated authentication endpoints to use acado-api routes:
  - `signIn`: `/auth/login`
  - `signOut`: `/auth/logout`
  - `signUp`: `/auth/register`
  - `forgotPassword`: `/auth/forgot-password`
  - `resetPassword`: `/auth/reset-password`
- Added new endpoints:
  - `refreshToken`: `/auth/refresh`
  - `profile`: `/auth/profile`

### 2. **Authentication Types** (`src/app/types/auth.ts`)
- Created `AcadoApiUser` type matching the backend user model:
  ```typescript
  {
    id: string
    email: string
    name: string
    username?: string
    role: string
    organizationId?: string
    organizationName?: string
    universityIds?: string[]
    courseIds?: string[]
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  ```
- Updated `SignInResponse` to use `accessToken` instead of `token`
- Simplified `SignUpCredential` to match backend requirements:
  ```typescript
  {
    name: string
    email: string
    password: string
    username?: string
    organizationId: string  // Required
    universityId: string    // Required
    courseIds?: string[]    // Optional
  }
  ```

### 3. **Authentication Service** (`src/services/auth/AuthService.ts`)
- Added `withCredentials: true` to all auth API calls
- This enables HTTP-only cookie support for refresh tokens

### 4. **Axios Configuration** (`src/services/http/AxiosBase.ts`)
- Enabled `withCredentials: true` globally
- This allows the backend to set and read HTTP-only cookies for refresh tokens

### 5. **Auth Provider** (`src/app/providers/auth/AuthProvider.tsx`)
- Updated to handle `accessToken` instead of `token`
- Updated response parsing to match new API format

## ⚠️ TODO: Required Implementation

### 1. **Sign Up Form Enhancement**

The current sign-up form uses placeholder values for `organizationId` and `universityId`. You need to:

#### Option A: Pre-populate from URL Parameters
```typescript
// In SignUpForm.tsx
const [searchParams] = useSearchParams();
const orgId = searchParams.get("org_id");
const uniId = searchParams.get("uni_id");
```

#### Option B: Add Dropdown Selectors
1. Fetch organizations and universities from the API
2. Add dropdown fields to the sign-up form
3. Let users select their organization and university

**Example Implementation:**
```typescript
// Add to SignUpForm.tsx
const [organizations, setOrganizations] = useState([]);
const [universities, setUniversities] = useState([]);

useEffect(() => {
  // Fetch organizations
  fetch('/api/organizations')
    .then(res => res.json())
    .then(data => setOrganizations(data));
    
  // Fetch universities
  fetch('/api/universities')
    .then(res => res.json())
    .then(data => setUniversities(data));
}, []);

// Add to form
<Select
  label="Organization"
  options={organizations}
  onChange={(value) => setSelectedOrg(value)}
/>
<Select
  label="University"
  options={universities}
  onChange={(value) => setSelectedUni(value)}
/>
```

### 2. **Token Refresh Implementation**

The backend uses HTTP-only cookies for refresh tokens. You may need to:

1. **Add Token Refresh Logic** in `AuthProvider.tsx`:
```typescript
const refreshAccessToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });
    const data = await response.json();
    // Update access token
    setToken(data.accessToken);
  } catch (error) {
    // Handle refresh failure (logout user)
    signOut();
  }
};
```

2. **Add Axios Interceptor** to automatically refresh tokens on 401 errors:
```typescript
// In AxiosBase.ts
AxiosBase.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      await refreshAccessToken();
      // Retry the original request
      return AxiosBase(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 3. **Profile Management**

Add profile fetching and updating:

```typescript
// In AuthService.ts
export async function apiGetProfile() {
  return ApiService.fetchDataWithAxios<AcadoApiUser>({
    url: endpointConfig.profile,
    method: 'get',
    withCredentials: true,
  });
}

export async function apiUpdateProfile(data: Partial<AcadoApiUser>) {
  return ApiService.fetchDataWithAxios<AcadoApiUser>({
    url: endpointConfig.profile,
    method: 'put',
    data,
    withCredentials: true,
  });
}
```

### 4. **Error Handling**

Update error messages to match backend validation errors:

```typescript
// In AuthProvider.tsx
catch (errors: any) {
  const errorMessage = 
    errors?.response?.data?.error || 
    errors?.response?.data?.message || 
    errors.toString();
    
  return {
    status: 0,
    message: errorMessage,
    error: errorMessage,
  };
}
```

## 🔐 Security Considerations

1. **CORS Configuration**: Ensure the backend CORS settings allow credentials:
   ```typescript
   // In acado-api
   cors({
     origin: 'http://localhost:5173', // Your client URL
     credentials: true,
   })
   ```

2. **Cookie Settings**: The backend sets HTTP-only cookies with:
   - `httpOnly: true` - Prevents JavaScript access
   - `secure: true` - HTTPS only (disable in development)
   - `sameSite: 'none'` - Allows cross-site requests

3. **Token Storage**: Access tokens are stored in localStorage/sessionStorage (configurable in `app.config.ts`)

## 🧪 Testing

### Test Login Flow:
1. Start acado-api: `cd acado-api && npm run dev`
2. Start acado-client: `cd acado-client && npm run dev`
3. Navigate to sign-in page
4. Enter credentials:
   - Email: `superadmin@test.com`
   - Password: `password123`
5. Verify successful login and token storage

### Test Registration Flow:
1. Navigate to sign-up page
2. Fill in the form (note: currently uses placeholder org/uni IDs)
3. Submit and verify account creation
4. Check that user is automatically logged in

## 📝 API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/profile` | GET | Get user profile |
| `/api/auth/profile` | PUT | Update user profile |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password |

## 🔄 Migration from Old System

The old authentication system used different field names. Here's the mapping:

| Old Field | New Field |
|-----------|-----------|
| `token` | `accessToken` |
| `organization_id` (number) | `organizationId` (string) |
| `wp_center_id` | (removed) |
| `wp_course_id` | (removed) |
| Various user fields | Simplified to `AcadoApiUser` |

## 📚 Additional Resources

- [Acado API Documentation](../acado-api/README.md)
- [Authentication Module](../acado-api/src/modules/auth/)
- [JWT Strategy](../acado-api/src/core/middleware/authMiddleware.ts)

