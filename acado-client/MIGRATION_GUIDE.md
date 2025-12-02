# API Migration Guide: ELMS → Acado-API

This guide provides step-by-step instructions for migrating `acado-client` from the legacy ELMS API to the new `acado-api` backend.

---

## 🎯 Quick Start

### Step 1: Update Environment Configuration

```typescript
// src/app/config/env.config.ts
const envConfig: EnvConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000', // Changed from ELMS URL
    // ... rest of config
}
```

### Step 2: Update Response Interceptor

```typescript
// src/services/http/AxiosBase.ts
AxiosBase.interceptors.response.use(
    (response) => {
        // Unwrap acado-api response format: { success: true, data: {...} }
        if (response.data && typeof response.data === 'object') {
            if ('success' in response.data && 'data' in response.data) {
                return { ...response, data: response.data.data };
            }
        }
        return response;
    },
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error);
        return Promise.reject(error);
    },
)
```

### Step 3: Remove Hardcoded URL Replacement

Remove this line from `AxiosBase.ts`:
```typescript
// DELETE THIS:
response.data = JSON.parse(JSON.stringify(response.data)
    .replace(/https:\/\/acado.ai/g, 'https://elist.acado.ai'))
```

---

## 📋 Endpoint Mapping Reference

### Authentication Endpoints

| Service | Old Endpoint (ELMS) | New Endpoint (Acado-API) | Method |
|---------|---------------------|--------------------------|--------|
| Sign In | `/api/login` | `/auth/login` | POST |
| Sign Up | `/api/joy/signup` | `/auth/register` | POST |
| Sign Out | `/api/sign-out` | `/auth/logout` | POST |
| Forgot Password | `/api/forgot-password` | `/auth/forgot-password` | POST |
| Reset Password | `/api/reset-password` | `/auth/reset-password` | POST |
| Google OAuth | `/api/google-auth-login` | `/auth/google` | POST |

**Update File:** `src/services/auth/AuthService.ts`

### Application Endpoints

| Service | Old Endpoint (ELMS) | New Endpoint (Acado-API) | Method |
|---------|---------------------|--------------------------|--------|
| Get Applications | `/api/application-dashboard` | `/applications` | GET |
| Get Application | `/api/application/{id}` | `/applications/{id}` | GET |
| Create Application | `/api/application` | `/applications` | POST |
| Update Application | `/api/application/{id}` | `/applications/{id}` | PATCH |
| Submit Application | `/api/application/{id}/submit` | `/applications/{id}/submit` | PATCH |

**Update File:** `src/services/learner/ApplicationServices.ts`

### Course Endpoints

| Service | Old Endpoint (ELMS) | New Endpoint (Acado-API) | Method |
|---------|---------------------|--------------------------|--------|
| Get Courses | `/api/courses` | `/courses` | GET |
| Get Course | `/api/courses/{id}` | `/courses/{id}` | GET |
| Get Enrolled Courses | `/api/enrolled-courses` | `/courses?enrolled=true` | GET |
| Apply to Course | `/api/courses/apply` | `/courses/{id}/apply` | POST |

**Update Files:**
- `src/services/learner/CourseListServices.ts`
- `src/services/public/LmsCourseService.ts`

### University Endpoints

| Service | Old Endpoint (ELMS) | New Endpoint (Acado-API) | Method |
|---------|---------------------|--------------------------|--------|
| Get Universities | `/api/universities` | `/universities` | GET |
| Get University | `/api/universities/{id}` | `/universities/{id}` | GET |
| Get University Courses | `/api/universities/{id}/courses` | `/universities/{id}/courses` | GET |

**Update Files:**
- `src/services/public/UniversitiesService.ts`
- `src/services/elms/UniversityService.ts` (consider removing)

### Event Endpoints

| Service | Old Endpoint (ELMS) | New Endpoint (Acado-API) | Method |
|---------|---------------------|--------------------------|--------|
| Get Events | `/api/competition-list` | `/events` | GET |
| Get Event | `/api/events/{id}` | `/events/{id}` | GET |
| Get Public Events | `/api/public-events` | `/events?public=true` | GET |

**Update Files:**
- `src/services/collaborate/EventService.ts`
- `src/services/public/EventService.ts`

### Community Endpoints

| Service | Old Endpoint (ELMS) | New Endpoint (Acado-API) | Method |
|---------|---------------------|--------------------------|--------|
| Get Posts | `/api/posts` | `/community-posts` | GET |
| Get Post | `/api/posts/{id}` | `/community-posts/{id}` | GET |
| Create Post | `/api/posts` | `/community-posts` | POST |
| Like Post | `/api/posts/{id}/like` | `/community-posts/{id}/like` | POST |
| Comment | `/api/posts/{id}/comments` | `/community-posts/{id}/comments` | POST |

**Update Files:**
- `src/services/common/communityservice.ts`
- `src/services/public/CommunityService.ts`

### Reel Endpoints

| Service | Old Endpoint (ELMS) | New Endpoint (Acado-API) | Method |
|---------|---------------------|--------------------------|--------|
| Get Reels | `/api/reels` | `/reels` | GET |
| Get Reel | `/api/reels/{id}` | `/reels/{id}` | GET |
| Create Reel | `/api/reels` | `/reels` | POST |

**Update File:** `src/services/learner/ReelsService.ts`

### Scholarship Endpoints

| Service | Old Endpoint (ELMS) | New Endpoint (Acado-API) | Method |
|---------|---------------------|--------------------------|--------|
| Get Scholarships | `/api/scholarships` | `/scholarships` | GET |
| Get Scholarship | `/api/scholarships/{id}` | `/scholarships/{id}` | GET |

**Update File:** Create new service if needed

### Wall Post Endpoints

| Service | Old Endpoint (ELMS) | New Endpoint (Acado-API) | Method |
|---------|---------------------|--------------------------|--------|
| Get Wall Posts | `/api/wall-posts` | `/wall-posts` | GET |
| Create Wall Post | `/api/wall-posts` | `/wall-posts` | POST |

**Update File:** Create new service if needed

---

## 🔄 Response Format Changes

### Old Format (ELMS)
```typescript
{
    status: 1 | 0,
    data: {...},
    message: string,
    error?: string
}
```

### New Format (Acado-API)
```typescript
{
    success: true,
    data: {...}
}
```

### Error Format (Acado-API)
```typescript
{
    success: false,
    error: {
        message: string,
        code?: string
    }
}
```

### Service Update Pattern

**Before:**
```typescript
export async function fetchApplication(): Promise<Data> {
    const response = await ApiService.fetchDataWithAxios<ApplicationData>({
        url: '/application-dashboard',
        method: 'get',
    });
    if (response.data) {
        return response.data;
    }
    throw new Error('Application data is not available');
}
```

**After:**
```typescript
export async function fetchApplication(): Promise<Data> {
    const response = await ApiService.fetchDataWithAxios<ApplicationData>({
        url: '/applications',
        method: 'get',
    });
    // Response is already unwrapped by interceptor
    // response is now the data directly (array or object)
    return response;
}
```

---

## 🔐 Authentication Updates

### Token Format
✅ **No changes needed** - Both use Bearer token format

### Request Header
```typescript
// Already correct:
config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
// Results in: Authorization: Bearer <token>
```

### Token Storage
✅ **No changes needed** - Configurable storage strategy works

### Token Refresh (If Implemented)
```typescript
// Add to AxiosResponseIntrceptorErrorCallback.ts
if (response?.status === 401) {
    // Attempt token refresh
    const refreshToken = getRefreshToken();
    if (refreshToken) {
        try {
            const newToken = await refreshAccessToken(refreshToken);
            setToken(newToken);
            // Retry original request
            return AxiosBase(originalRequest);
        } catch (error) {
            // Refresh failed, logout
            handleSignOut();
        }
    }
}
```

---

## 🛠️ Service Layer Refactoring

### Create Base Service Class (Optional)

```typescript
// src/services/base/BaseService.ts
import ApiService from '../http/ApiService';
import type { AxiosRequestConfig } from 'axios';

export class BaseService {
    protected baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    protected async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        return ApiService.fetchDataWithAxios<T>({
            url: `${this.baseUrl}${endpoint}`,
            method: 'get',
            ...config,
        });
    }

    protected async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return ApiService.fetchDataWithAxios<T>({
            url: `${this.baseUrl}${endpoint}`,
            method: 'post',
            data,
            ...config,
        });
    }

    protected async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return ApiService.fetchDataWithAxios<T>({
            url: `${this.baseUrl}${endpoint}`,
            method: 'patch',
            data,
            ...config,
        });
    }

    protected async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        return ApiService.fetchDataWithAxios<T>({
            url: `${this.baseUrl}${endpoint}`,
            method: 'delete',
            ...config,
        });
    }
}
```

### Example: Refactored Service

```typescript
// src/services/learner/ApplicationService.ts
import { BaseService } from '../base/BaseService';
import type { Application, CreateApplicationDto } from '@app/types/learner/application';

class ApplicationService extends BaseService {
    constructor() {
        super('/applications');
    }

    async getAll(params?: { enrich?: boolean }): Promise<Application[]> {
        return this.get<Application[]>('', { params });
    }

    async getById(id: string): Promise<Application> {
        return this.get<Application>(`/${id}`);
    }

    async create(data: CreateApplicationDto): Promise<Application> {
        return this.post<Application>('', data);
    }

    async update(id: string, data: Partial<CreateApplicationDto>): Promise<Application> {
        return this.patch<Application>(`/${id}`, data);
    }

    async submit(id: string): Promise<Application> {
        return this.patch<Application>(`/${id}/submit`);
    }
}

export const applicationService = new ApplicationService();
```

---

## ✅ Migration Checklist

### Phase 1: Configuration
- [ ] Update `env.config.ts` with new API base URL
- [ ] Update response interceptor in `AxiosBase.ts`
- [ ] Remove hardcoded URL replacement
- [ ] Verify API prefix (`/api` vs no prefix)

### Phase 2: Authentication
- [ ] Update `AuthService.ts` endpoints
- [ ] Test login flow
- [ ] Test signup flow
- [ ] Test logout flow
- [ ] Test password reset flow

### Phase 3: Core Services
- [ ] Update `ApplicationServices.ts`
- [ ] Update `CourseListServices.ts`
- [ ] Update `DashboardServices.ts`
- [ ] Test each service individually

### Phase 4: Public Services
- [ ] Update `UniversitiesService.ts`
- [ ] Update `EventService.ts`
- [ ] Update `CommunityService.ts`
- [ ] Remove ELMS-specific services

### Phase 5: Testing
- [ ] Test all authentication flows
- [ ] Test course browsing
- [ ] Test application submission
- [ ] Test community features
- [ ] Test event features

### Phase 6: Cleanup
- [ ] Remove ELMS-specific code
- [ ] Remove unused services
- [ ] Update type definitions
- [ ] Update documentation

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution:** Ensure backend CORS is configured for client origin

### Issue 2: 401 Unauthorized
**Solution:** 
- Verify token is being sent correctly
- Check token format (Bearer prefix)
- Verify token storage strategy

### Issue 3: Response Format Mismatch
**Solution:** 
- Verify response interceptor is working
- Check if response has `success` and `data` fields
- Add logging to debug response structure

### Issue 4: Endpoint Not Found (404)
**Solution:**
- Verify endpoint path matches backend routes
- Check API prefix configuration
- Verify HTTP method (GET, POST, etc.)

### Issue 5: Type Errors
**Solution:**
- Update TypeScript types to match new response format
- Remove old response type definitions
- Add new type definitions for acado-api responses

---

## 📚 Additional Resources

- [Acado-API Documentation](../acado-api/README.md)
- [API Endpoints Reference](../acado-api/README.md#api-endpoints)
- [Error Handling Guide](./ANALYSIS.md#error-handling-inconsistency)

---

**Last Updated:** 2024  
**Version:** 1.0

