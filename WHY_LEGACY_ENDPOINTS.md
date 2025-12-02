# ❓ WHY SOME ENDPOINTS ARE STILL ON LEGACY

**Date:** December 2, 2025  
**Question:** Why are Volunteering and Categories still running on legacy endpoints?

---

## 📋 ANSWER

These endpoints are still on legacy because **they don't exist in acado-api yet**!

---

## 🔍 DETAILED EXPLANATION

### 1. ❌ **VOLUNTEERING - NOT IN ACADO-API**

**What the client uses:**
- `GET /get-competitons?type=volunteering`
- `GET /competition-list?type=volunteering`

**What exists in acado-api:**
- ❌ **NO volunteering module**
- ❌ **NO /volunteering endpoint**
- ❌ **NO Volunteering model**

**Why it's still legacy:**
The `acado-api` doesn't have a volunteering module yet. Looking at the modules directory:

```
acado-api/src/modules/
  ✅ event/           (EXISTS - migrated)
  ✅ scholarship/     (EXISTS - migrated)
  ❌ volunteering/    (DOESN'T EXIST)
```

**Solution:**
- Keep using legacy endpoint for now
- Create volunteering module in acado-api (future task)
- Then migrate client to use new endpoint

---

### 2. ❌ **EVENT CATEGORIES - NOT IN ACADO-API**

**What the client uses:**
- `GET /event-category` - List of event categories
- `GET /v1/event-category-group` - Event category groups

**What exists in acado-api:**
- ✅ `/masterCategories` - Master categories (for forms/fields)
- ✅ `/course-categories` - Course categories
- ❌ **NO event-specific categories**
- ❌ **NO event category groups**

**Why it's still legacy:**
The `acado-api` has **master categories** and **course categories**, but **NOT event categories**. These are different:

```
Master Categories:     For form fields (Personal Info, Education, etc.)
Course Categories:     For courses (Engineering, Business, etc.)
Event Categories:      For events (Hackathon, Workshop, Competition, etc.) ❌ MISSING
```

**Solution:**
- Keep using legacy endpoint for now
- Add event categories to acado-api (future task)
- Then migrate client to use new endpoint

---

## 📊 MIGRATION STATUS TABLE

| Module | acado-api Endpoint | Client Status | Reason |
|--------|-------------------|---------------|--------|
| **Events** | ✅ `/events` | ✅ Migrated | Endpoint exists |
| **Scholarships** | ✅ `/scholarships` | ✅ Migrated | Endpoint exists |
| **Courses** | ✅ `/courses` | ✅ Migrated | Endpoint exists |
| **Universities** | ✅ `/universities` | ✅ Migrated | Endpoint exists |
| **Volunteering** | ❌ Not available | ⚠️ Legacy | **Module doesn't exist** |
| **Event Categories** | ❌ Not available | ⚠️ Legacy | **Endpoint doesn't exist** |
| **Event Category Groups** | ❌ Not available | ⚠️ Legacy | **Endpoint doesn't exist** |

---

## 🎯 WHAT THIS MEANS

### For Volunteering:

**Current State:**
```typescript
// Client calls:
GET /get-competitons?type=volunteering

// acado-api has:
❌ No /volunteering endpoint
❌ No Volunteering model
❌ No volunteering module
```

**Impact:**
- Volunteering pages still work (using legacy API)
- Can't migrate until acado-api has volunteering support
- Not a problem - just technical debt

---

### For Event Categories:

**Current State:**
```typescript
// Client calls:
GET /event-category
GET /v1/event-category-group

// acado-api has:
✅ /masterCategories (different purpose)
✅ /course-categories (different purpose)
❌ No event-specific categories
```

**Impact:**
- Event filtering by category still works (using legacy API)
- Category dropdown loads from legacy API
- Can't migrate until acado-api has event categories
- Not a problem - just technical debt

---

## 💡 SHOULD WE MIGRATE THEM NOW?

### Short Answer: **NO** ❌

### Why Not?

1. **Volunteering Module Doesn't Exist**
   - Would need to create entire module in acado-api
   - Includes: Model, Controller, Service, Routes, DTO
   - Estimated time: 4-6 hours
   - Out of scope for current task

2. **Event Categories Don't Exist**
   - Would need to create event category system
   - Different from master categories and course categories
   - Includes: Model, Controller, Service, Routes
   - Estimated time: 3-4 hours
   - Out of scope for current task

3. **Legacy Endpoints Work Fine**
   - No urgent need to migrate
   - Users don't see any difference
   - Can migrate later when needed

---

## 🔄 MIGRATION ROADMAP

### ✅ Phase 1: Core Modules (COMPLETED)
- Events → `/events` ✅
- Scholarships → `/scholarships` ✅
- Courses → `/courses` ✅
- Universities → `/universities` ✅

### 📅 Phase 2: Supporting Modules (FUTURE)
- Create Volunteering module in acado-api
- Create Event Categories in acado-api
- Migrate client to use new endpoints

### 📅 Phase 3: Advanced Features (FUTURE)
- Event registrations/applications
- Event activity tracking
- Event analytics
- Advanced filtering

---

## 🎯 CURRENT WORKAROUND

The code is **already set up** to handle this:

### Smart Routing in Services:

```typescript
export async function fetchEvents(type?: string): Promise<Event[]> {
    // Migrated types → Use new API
    if (type === 'event') {
        return await fetchFromNewAPI('/events');
    }
    if (type === 'scholarship') {
        return await fetchFromNewAPI('/scholarships');
    }
    
    // Non-migrated types → Use legacy API
    if (type === 'volunteering') {
        return await fetchFromLegacyAPI('/get-competitons?type=volunteering');
    }
    
    // Default → Legacy
    return await fetchFromLegacyAPI('/get-competitons');
}
```

This means:
- ✅ Events work with new API
- ✅ Scholarships work with new API
- ✅ Volunteering works with legacy API (until migrated)
- ✅ No errors, no issues
- ✅ Seamless user experience

---

## 📝 WHEN WILL THEY BE MIGRATED?

### Volunteering:

**Prerequisites:**
1. Create Volunteering model in acado-api
2. Create Volunteering controller
3. Create Volunteering service
4. Create Volunteering routes
5. Add sample data

**Then:**
- Update client services (same pattern as events/scholarships)
- Test volunteering pages
- Done!

**Estimated Total Time:** 6-8 hours

---

### Event Categories:

**Prerequisites:**
1. Decide on category structure (separate from master/course categories?)
2. Create EventCategory model (if separate)
3. Create EventCategoryGroup model
4. Create controllers and services
5. Add sample data

**Then:**
- Update client services
- Test category filtering
- Done!

**Estimated Total Time:** 4-6 hours

---

## ✅ CONCLUSION

**They're on legacy because:**
1. ❌ Volunteering module doesn't exist in acado-api
2. ❌ Event category system doesn't exist in acado-api
3. ✅ Legacy endpoints work fine for now
4. ✅ Can migrate later when needed

**This is NOT a bug or oversight** - it's a **planned technical debt** that will be addressed when those modules are added to acado-api.

---

## 🎯 RECOMMENDATION

**Keep them on legacy for now** because:
- ✅ They work fine
- ✅ No user impact
- ✅ Creating those modules is out of scope
- ✅ Can migrate later when needed
- ✅ Focus on what's already migrated (events, scholarships, courses)

---

**Summary:** They're on legacy because the endpoints **literally don't exist** in acado-api yet! 🎯

