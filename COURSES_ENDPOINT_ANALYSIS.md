# COURSES PAGE ENDPOINT ANALYSIS - acado-client
**Date:** December 2, 2025  
**Analyzed by:** Senior Full Stack Developer

---

## 🎯 EXECUTIVE SUMMARY

The Courses page in `acado-client` uses **LEGACY ENDPOINTS** that **DO NOT EXIST** in the new `acado-api`.  
This is causing CORS errors because the client is trying to connect to `elms.edulystventures.com` instead of the local API.

**Root Cause:** Complete API endpoint mismatch between legacy ELMS system and new acado-api architecture.

---

## 🚨 CRITICAL ISSUES FOUND

### 1. ENDPOINT MISMATCH - COURSES LIST
- **Client Expects:** `GET /api/v1/free-courses`
- **API Provides:** `GET /api/courses`

**Parameters Used by Client:**
- `org_id` (university filter)
- `country_id` (location filter)  
- `cat_id` (category filter)
- `query` (search term)
- `page` (pagination)
- `items` (items per page)

**Parameters Supported by API:**
- `universityId` (not `org_id`)
- `locationId` (not `country_id`)
- `categoryId` (not `cat_id`)
- `search` (not `query`)
- `page`
- `limit` (not `items`)

---

### 2. ENDPOINT MISMATCH - COURSE DETAILS
- **Client Expects:** `GET /api/v1/get-course-details/:id`
- **API Provides:** `GET /api/courses/:id`

---

### 3. ENDPOINT MISMATCH - UNIVERSITIES LIST
- **Client Expects:** `GET /api/university-list`
- **API Provides:** `GET /api/universities`

---

### 4. ENDPOINT MISMATCH - UNIVERSITY DETAILS
- **Client Expects:** `GET /api/get-university-meta/:id`
- **API Provides:** `GET /api/universities/:id`

---

### 5. ENDPOINT MISMATCH - COURSE CATEGORIES
- **Client Expects:** `GET /api/get-course-category`
- **API Provides:** `GET /api/course-categories`

---

### 6. ENDPOINT MISMATCH - UNIVERSITY COURSES
- **Client Expects:** `GET /api/v1/free-courses?org_id=:id`
- **API Provides:** `GET /api/universities/:id/courses`

---

## 📁 FILES THAT NEED UPDATES

### Priority 1 - Core Services (CRITICAL) 🔴

#### 1. `acado-client/src/services/public/LmsCourseService.ts`
- **Line 22:** Change `/v1/free-courses` → `/courses`
- **Add parameter mapping:** Transform `org_id` → `universityId`, `cat_id` → `categoryId`, `query` → `search`, `items` → `limit`

#### 2. `acado-client/src/services/elms/UniversityService.ts`
- **Line 8:** Change `university-list` → `universities`
- **Line 20:** Change `get-university-meta` → `universities`
- **Line 32:** Change `/v1/free-courses?org_id=` → `/universities/:id/courses`

#### 3. `acado-client/src/services/public/CoursesService.ts`
- **Line 34:** Change `get-course-category` → `course-categories`

---

### Priority 2 - API Response Adapters (HIGH) 🟠

#### 4. `acado-client/src/app/types/public/lmsCourses.ts`
- Update response types to match `acado-api` structure
- Verify pagination format matches
- Check course object structure

#### 5. `acado-client/src/app/types/elms/university.ts`
- Update response types to match `acado-api` structure
- Verify university object structure

---

### Priority 3 - Component Updates (MEDIUM) 🟡

#### 6. `acado-client/src/features/app/public/Courses.tsx`
- **Lines 28-33:** Update parameter names in `useMemo` hook
  - `org_id` → `universityId`
  - `country_id` → `locationId`
  - `cat_id` → `categoryId`
  - `query` → `search`
  - `items` → `limit`

#### 7. `acado-client/src/features/app/learner/courses/List.tsx`
- **Lines 28-33:** Same parameter updates as above

---

## 💡 RECOMMENDED SOLUTION

### ✅ Option A: Update Client to Match New API (RECOMMENDED)

**Advantages:**
- Clean, maintainable code
- No technical debt
- Better performance
- Follows REST standards

**Steps:**
1. Create parameter adapter/mapper utility
2. Update all service files with new endpoints
3. Update response type definitions
4. Test all course-related features
5. Remove legacy code

**Estimated Time:** 4-6 hours

---

### ⚠️ Option B: Add Backward Compatibility Routes in API

**Advantages:**
- Quick fix
- No client changes needed
- Gradual migration possible

**Disadvantages:**
- Maintains technical debt
- Duplicate code in API
- Confusing for future developers

**Steps:**
1. Add legacy routes in `acado-api` that redirect to new endpoints
2. Add parameter mapping middleware
3. Maintain both old and new endpoints temporarily
4. Plan deprecation timeline

**Estimated Time:** 2-3 hours (but creates future maintenance burden)

---

## 📊 PARAMETER MAPPING TABLE

| Client Parameter | API Parameter | Description          | Type   |
|-----------------|---------------|----------------------|--------|
| `org_id`        | `universityId`| University filter    | string |
| `country_id`    | `locationId`  | Location filter      | string |
| `cat_id`        | `categoryId`  | Category filter      | string |
| `query`         | `search`      | Search term          | string |
| `items`         | `limit`       | Items per page       | number |
| `page`          | `page`        | Page number          | number |

---

## 🔄 RESPONSE STRUCTURE COMPARISON

### Legacy ELMS API Response:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "last_page": 10,
    "total": 100
  }
}
```

### New acado-api Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Required Adapter:** Map `last_page` → `totalPages`, handle `success` wrapper

---

## ✅ NEXT STEPS

1. ✅ Create `.env` file with `VITE_API_BASE_URL=http://localhost:5000`
2. ⚠️ Update service files to use new endpoints
3. ⚠️ Update parameter names in components
4. ⚠️ Create parameter mapping utility
5. ⚠️ Update response type definitions
6. ⚠️ Test courses page functionality

---

## 🧪 TESTING CHECKLIST

- [ ] Courses list loads correctly
- [ ] Search functionality works
- [ ] University filter works
- [ ] Category filter works
- [ ] Location filter works
- [ ] Pagination works correctly
- [ ] Course details page loads
- [ ] University courses list works
- [ ] Error handling works
- [ ] Loading states display properly

---

## 🔧 IMPLEMENTATION PLAN

### Phase 1: Service Layer Updates (2 hours)
1. Create parameter mapper utility
2. Update `LmsCourseService.ts`
3. Update `UniversityService.ts`
4. Update `CoursesService.ts`

### Phase 2: Type Definitions (1 hour)
1. Update `lmsCourses.ts` types
2. Update `university.ts` types
3. Create response adapters if needed

### Phase 3: Component Updates (1 hour)
1. Update `Courses.tsx` parameters
2. Update `List.tsx` parameters
3. Update any other course-related components

### Phase 4: Testing (2 hours)
1. Unit tests for parameter mapping
2. Integration tests for API calls
3. E2E tests for courses page
4. Fix any bugs found

---

## 📝 CODE EXAMPLES

### Parameter Mapper Utility

```typescript
// acado-client/src/utils/apiParamMapper.ts
export function mapLegacyToNewParams(legacyParams: URLSearchParams): URLSearchParams {
  const newParams = new URLSearchParams();
  
  const mapping: Record<string, string> = {
    'org_id': 'universityId',
    'country_id': 'locationId',
    'cat_id': 'categoryId',
    'query': 'search',
    'items': 'limit',
  };
  
  legacyParams.forEach((value, key) => {
    const newKey = mapping[key] || key;
    newParams.append(newKey, value);
  });
  
  return newParams;
}
```

### Updated Service Example

```typescript
// acado-client/src/services/public/LmsCourseService.ts
import { mapLegacyToNewParams } from '@/utils/apiParamMapper';

export async function fetchFreeCourses(params?: URLSearchParams): Promise<CoursesApiResponse> {
  try {
    const mappedParams = params ? mapLegacyToNewParams(params) : undefined;
    const response = await ApiService.fetchDataWithAxios<CoursesApiResponse>({
      url: `/courses`, // Changed from /v1/free-courses
      method: 'get',
      params: mappedParams,
    });
    return response;
  } catch (error) {
    throw error as string;
  }
}
```

---

## 🎯 DECISION REQUIRED

**Which option do you prefer?**

**A) Update client to match new API** (Recommended - Clean solution)  
**B) Add backward compatibility in API** (Quick fix - Technical debt)

Please confirm your choice, and I'll proceed with the implementation immediately.

---

## 📞 SUPPORT

If you encounter any issues during implementation:
1. Check the parameter mapping table
2. Verify API endpoints in `acado-api/src/loaders/routes.ts`
3. Test with Postman/Thunder Client first
4. Check browser network tab for actual request/response

---

**Analysis Complete** ✅
