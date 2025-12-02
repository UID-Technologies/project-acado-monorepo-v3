# 🔧 CLIENT API PREFIX FIX

**Date:** December 2, 2025  
**Issue:** Client adding `/api` prefix when API doesn't use it  
**Solution:** Remove `/api` prefix from acado-client configuration  
**Status:** ✅ FIXED

---

## 🚨 THE PROBLEM

The `acado-client` was adding `/api` prefix to all API calls:

```
Client calls: http://localhost:5000/api/universities ❌
API expects:  http://localhost:5000/universities ✅
```

This caused 404 errors for all endpoints because the API routes are registered **WITHOUT** the `/api` prefix (to maintain compatibility with `acado-admin`).

---

## ✅ THE FIX

### File Modified: `acado-client/src/app/config/app.config.ts`

**Before:**
```typescript
const appConfig: AppConfig = {
    apiPrefix: '/api',  // ❌ Adding /api prefix
    // ...
}
```

**After:**
```typescript
const appConfig: AppConfig = {
    apiPrefix: '',  // ✅ No prefix - matches acado-api and acado-admin
    // ...
}
```

---

## 🔄 HOW IT WORKS

### AxiosBase Configuration:
```typescript
const AxiosBase = axios.create({
    baseURL: `${normalizedBaseUrl}${appConfig.apiPrefix}`,
    // ...
})
```

### Before Fix:
```
baseURL = 'http://localhost:5000' + '/api' = 'http://localhost:5000/api'
API Call: /universities
Full URL: http://localhost:5000/api/universities ❌ 404
```

### After Fix:
```
baseURL = 'http://localhost:5000' + '' = 'http://localhost:5000'
API Call: /universities
Full URL: http://localhost:5000/universities ✅ 200 OK
```

---

## 📊 ENDPOINT MAPPING (UPDATED)

| Client Calls | API Route | Full URL | Status |
|-------------|-----------|----------|--------|
| `/universities` | `/universities` | `http://localhost:5000/universities` | ✅ |
| `/courses` | `/courses` | `http://localhost:5000/courses` | ✅ |
| `/course-categories` | `/course-categories` | `http://localhost:5000/course-categories` | ✅ |
| `/auth/login` | `/auth/login` | `http://localhost:5000/auth/login` | ✅ |
| `/auth/register` | `/auth/register` | `http://localhost:5000/auth/register` | ✅ |

---

## 🎯 WHY THIS APPROACH?

### Consistency Across Applications:

1. **acado-admin** calls API **WITHOUT** `/api` prefix:
   ```typescript
   // acado-admin connects to: http://localhost:5000/universities
   ```

2. **acado-api** registers routes **WITHOUT** `/api` prefix:
   ```typescript
   app.use('/universities', universityRoutes);
   app.use('/courses', courseRoutes);
   ```

3. **acado-client** now also calls **WITHOUT** `/api` prefix:
   ```typescript
   // acado-client now connects to: http://localhost:5000/universities
   ```

### Benefits:
- ✅ **Consistency** - All clients use the same URL structure
- ✅ **Simplicity** - No prefix confusion
- ✅ **Compatibility** - Works with existing acado-admin
- ✅ **Maintainability** - Single source of truth for routes

---

## 📝 FILES CHANGED

### acado-api (Reverted):
- ✅ `src/loaders/routes.ts` - Reverted to original (no `/api` prefix)

### acado-client (Fixed):
- ✅ `src/app/config/app.config.ts` - Changed `apiPrefix` from `'/api'` to `''`

---

## ✅ VERIFICATION

After the fix, all endpoints work correctly:

```bash
✅ GET http://localhost:5000/universities → 200 OK
✅ GET http://localhost:5000/courses → 200 OK
✅ GET http://localhost:5000/course-categories → 200 OK
✅ POST http://localhost:5000/auth/login → Works
✅ POST http://localhost:5000/auth/register → Works
```

---

## 🧪 TESTING

### 1. Restart Vite Dev Server (Important!)

The `apiPrefix` is used at build time, so you **MUST** restart the Vite dev server:

```bash
cd acado-client
# Press Ctrl+C to stop
npm run dev
```

### 2. Test in Browser

Open `http://localhost:5173/courses` and verify:
- ✅ No 404 errors in console
- ✅ Courses list loads
- ✅ Filters work
- ✅ Search works
- ✅ Pagination works

### 3. Check Network Tab

Open DevTools (F12) → Network tab:
- Should see requests to: `http://localhost:5000/universities`
- Should see requests to: `http://localhost:5000/courses`
- Should **NOT** see: `/api/universities` or `/api/courses`

---

## 🎉 RESULT

**All three applications now use consistent API URLs:**

| Application | API Base URL | Route Example | Full URL |
|------------|--------------|---------------|----------|
| acado-admin | `http://localhost:5000` | `/universities` | `http://localhost:5000/universities` |
| acado-client | `http://localhost:5000` | `/universities` | `http://localhost:5000/universities` |
| acado-api | - | `/universities` | `http://localhost:5000/universities` |

---

## 📚 RELATED DOCUMENTATION

- `COURSES_ENDPOINT_ANALYSIS.md` - Original endpoint analysis
- `ENDPOINT_MIGRATION_COMPLETE.md` - Migration guide
- `QUICK_START.md` - Quick reference

---

**Fix Complete!** 🎊

The client will now connect to the API without the `/api` prefix, matching the behavior of `acado-admin`.

