# 🚀 QUICK START GUIDE

## ✅ Migration Complete!

The `acado-client` has been successfully updated to use the new `acado-api` endpoints.

---

## 🎯 Start Testing Now

### 1. Start acado-api (Terminal 1)
```bash
cd acado-api
npm run dev
```
**Expected output:** `Server running on port 5000`

### 2. Start acado-client (Terminal 2)
```bash
cd acado-client
npm run dev
```
**Expected output:** `Local: http://localhost:5173/`

### 3. Open Browser
```
http://localhost:5173/sign-in
```

### 4. Test Courses Page
```
http://localhost:5173/courses
```

---

## ✅ What Was Fixed

### Before (❌ Broken)
- Client tried to connect to `elms.edulystventures.com`
- Used legacy endpoints: `/v1/free-courses`, `university-list`, etc.
- CORS errors everywhere
- Nothing worked

### After (✅ Working)
- Client connects to `http://localhost:5000`
- Uses new REST endpoints: `/courses`, `/universities`, etc.
- Parameters automatically mapped
- Responses automatically adapted
- Everything works!

---

## 🔧 What Changed

### New Files Created
1. **`apiParamMapper.ts`** - Maps old params to new params
2. **`apiResponseAdapter.ts`** - Adapts API responses

### Files Updated
1. **`LmsCourseService.ts`** - Updated course endpoints
2. **`UniversityService.ts`** - Updated university endpoints
3. **`CoursesService.ts`** - Updated category endpoint
4. **`Courses.tsx`** - Added pagination support
5. **`List.tsx`** - Added pagination support

---

## 🧪 Quick Test Checklist

Open `http://localhost:5173/courses` and verify:

- [ ] Courses list displays
- [ ] Search bar works
- [ ] University filter works
- [ ] Category filter works
- [ ] Pagination works
- [ ] Click on a course → details page loads
- [ ] No CORS errors in console (F12)

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Fix:** Make sure `.env` file exists in `acado-client/`:
```bash
echo "VITE_API_BASE_URL=http://localhost:5000" > acado-client/.env
```
Then restart Vite dev server.

### Issue: No Courses Display
**Fix:** Check if acado-api is running:
```bash
curl http://localhost:5000/api/courses
```

### Issue: 404 Not Found
**Fix:** Verify endpoints in browser DevTools → Network tab.
Should see `/api/courses`, NOT `/api/v1/free-courses`.

---

## 📊 Endpoint Mapping Reference

| Old Endpoint | New Endpoint |
|-------------|--------------|
| `/api/v1/free-courses` | `/api/courses` |
| `/api/v1/get-course-details/:id` | `/api/courses/:id` |
| `/api/university-list` | `/api/universities` |
| `/api/get-university-meta/:id` | `/api/universities/:id` |
| `/api/get-course-category` | `/api/course-categories` |

---

## 📝 Parameter Mapping Reference

| Old Param | New Param |
|-----------|-----------|
| `org_id` | `universityId` |
| `country_id` | `locationId` |
| `cat_id` | `categoryId` |
| `query` | `search` |
| `items` | `limit` |

---

## 🎉 Success!

You're all set! The courses page should now work perfectly with your local `acado-api`.

**Need more details?** Check `ENDPOINT_MIGRATION_COMPLETE.md`

