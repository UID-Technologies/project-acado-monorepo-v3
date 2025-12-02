# 🎪 EVENTS PAGE ANALYSIS & API UPDATE

**Date:** December 2, 2025  
**Status:** 📊 Analysis Complete  
**Module:** Events Page Integration with acado-api

---

## 📋 EXECUTIVE SUMMARY

The Events page in `acado-client` currently uses **LEGACY ENDPOINTS** that need to be updated to use the new `acado-api` `/events` endpoint. This analysis covers all event-related pages and their API dependencies.

---

## 🔍 CURRENT IMPLEMENTATION

### Events Pages Found:

1. **Public Events Page** (`/events`)
   - **File:** `acado-client/src/features/app/public/Events.tsx`
   - **Service:** `fetchEvents('event')` from `public/EventService.ts`
   - **Endpoint:** `GET /get-competitons?type=event`
   - **Status:** ❌ Legacy

2. **Learner Events Page** (`/events-list`)
   - **File:** `acado-client/src/features/collaborate/events/index.tsx`
   - **Hook:** `useEvents(params)`
   - **Service:** `fetchEvents(params)` from `collaborate/EventService.ts`
   - **Endpoint:** `GET /competition-list?type=event`
   - **Status:** ❌ Legacy

3. **Learner Events Page Old** (`/events-list-old`)
   - **File:** `acado-client/src/features/app/learner/events/EventsPage.tsx`
   - **Hook:** `useEvents(params)`
   - **Service:** Same as above
   - **Status:** ❌ Legacy

4. **Event Details Pages**
   - **Public:** `acado-client/src/features/app/public/EventDetails.tsx`
   - **Learner:** `acado-client/src/features/app/learner/events/EventActivity.tsx`
   - **Endpoint:** `GET /competitins-details/:id`
   - **Status:** ❌ Legacy

5. **Home Page Events Section**
   - **File:** `acado-client/src/features/app/public/sections/Events.tsx`
   - **Hook:** `usePublicEvents()`
   - **Status:** ❌ Legacy

---

## 🎯 NEW ACADO-API ENDPOINTS

### Available in acado-api:

#### 1. GET /events
- **Controller:** `EventController.list()`
- **Route:** `/events` (registered in `routes.ts`)
- **Parameters:**
  - `status` - Filter by status (draft, active, completed, cancelled)
  - `mode` - Filter by mode (online, offline, hybrid)
  - `difficultyLevel` - Filter by difficulty (beginner, intermediate, advanced)
  - `subscriptionType` - Filter by type (free, paid)
  - `isPopular` - Filter popular events (boolean)
  - `search` - Search term

#### 2. GET /events/:id
- **Controller:** `EventController.getOne()`
- **Returns:** Complete event details with stages

#### 3. POST /events/:id/views
- **Controller:** `EventController.incrementViews()`
- **Purpose:** Track event views

#### 4. POST /events/:id/registrations
- **Controller:** `EventController.incrementRegistrations()`
- **Purpose:** Track event registrations

---

## 📊 ENDPOINT COMPARISON

### Legacy vs New API:

| Feature | Legacy Endpoint | New API Endpoint | Status |
|---------|----------------|------------------|--------|
| List Events | `GET /get-competitons?type=event` | `GET /events` | ❌ Need Update |
| List Events (Learner) | `GET /competition-list?type=event` | `GET /events` | ❌ Need Update |
| Event Details | `GET /competitins-details/:id` | `GET /events/:id` | ❌ Need Update |
| Event Categories | `GET /event-category` | ❌ Not Available | ⚠️ Missing |
| Event Category Groups | `GET /v1/event-category-group` | ❌ Not Available | ⚠️ Missing |

---

## 🔄 PARAMETER MAPPING

### Legacy Parameters:
- `type=event` - Filter by type
- `event_category_id` - Filter by category
- `ongoing_date` - Filter by date
- `is_assigned` - Filter assigned events

### New API Parameters:
- `status` - Filter by status (draft, active, completed, cancelled)
- `mode` - Filter by mode (online, offline, hybrid)
- `difficultyLevel` - Filter by difficulty (beginner, intermediate, advanced)
- `subscriptionType` - Filter by type (free, paid)
- `isPopular` - Filter popular events
- `search` - Search term

---

## 📁 FILES THAT NEED UPDATES

### Priority 1 - Service Layer (CRITICAL) 🔴

#### 1. `acado-client/src/services/collaborate/EventService.ts`
**Current:**
```typescript
export async function fetchEvents(params?: URLSearchParams | null): Promise<Event[]> {
    const response = await ApiService.fetchDataWithAxios<EventApiResponse>({
        url: '/competition-list',
        method: 'get',
        params: params
    })
    return response.data
}
```

**Needs Update To:**
```typescript
export async function fetchEvents(params?: URLSearchParams | null): Promise<Event[]> {
    const response = await ApiService.fetchDataWithAxios<any>({
        url: '/events', // Updated endpoint
        method: 'get',
        params: params
    })
    return response?.data || response || [];
}
```

#### 2. `acado-client/src/services/public/EventService.ts`
**Current:**
```typescript
export async function fetchEvents(type?: string): Promise<Event[]> {
    if (type === 'scholarship') {
        // ... scholarship logic
    }
    const response = await ApiService.fetchDataWithAxios<ApiResponse>({
        url: `get-competitons${type ? `?type=${type}` : ''}`,
        method: 'get'
    });
    return response.data;
}
```

**Needs Update To:**
```typescript
export async function fetchEvents(type?: string): Promise<Event[]> {
    if (type === 'scholarship') {
        // ... scholarship logic
    }
    
    if (type === 'event') {
        // Use new events endpoint
        const response = await ApiService.fetchDataWithAxios<any>({
            url: 'events',
            method: 'get'
        });
        return response?.data || response || [];
    }
    
    // For other types (volunteering, etc.), use legacy endpoint
    const response = await ApiService.fetchDataWithAxios<ApiResponse>({
        url: `get-competitons${type ? `?type=${type}` : ''}`,
        method: 'get'
    });
    return response.data;
}
```

#### 3. `acado-client/src/services/learner/EventService.ts`
**Current:**
```typescript
export async function fetchEvent(type?: string): Promise<Event[]> {
    const response = await ApiService.fetchDataWithAxios<EventData>({
        url: `/competition-list${type ? `?type=${type}` : ''}`,
        method: 'get',
    })
    return response.data
}
```

**Needs Update To:**
```typescript
export async function fetchEvent(type?: string): Promise<Event[]> {
    if (type === 'event' || !type) {
        // Use new events endpoint
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/events',
            method: 'get',
        })
        return response?.data || response || [];
    }
    
    // For other types, use legacy endpoint
    const response = await ApiService.fetchDataWithAxios<EventData>({
        url: `/competition-list${type ? `?type=${type}` : ''}`,
        method: 'get',
    })
    return response.data
}
```

---

### Priority 2 - Event Details (HIGH) 🟠

#### Update `fetchEventById()` in all service files

Add events endpoint fallback (similar to scholarship):

```typescript
export async function fetchEventById(id: string | undefined): Promise<EventDetails> {
    if (!id) throw new Error("ID is required");
    try {
        // Try new events endpoint first
        try {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: `events/${id}`,
                method: 'get'
            });
            return response?.data || response;
        } catch (eventError) {
            // Try scholarship endpoint
            try {
                const response = await ApiService.fetchDataWithAxios<any>({
                    url: `scholarships/${id}`,
                    method: 'get'
                });
                return response?.data || response;
            } catch (scholarshipError) {
                // Fallback to legacy endpoint
                const response = await ApiService.fetchDataWithAxios<EventDetailsResponse>({
                    url: `competitins-details/${id}`,
                    method: 'get'
                });
                return response.data;
            }
        }
    } catch (error) {
        throw error as string;
    }
}
```

---

### Priority 3 - Missing Endpoints (MEDIUM) 🟡

#### Event Categories & Groups

**Currently Used:**
- `GET /v1/event-category-group` - Event category groups
- `GET /event-category` - Event categories

**Status:** ⚠️ **NOT AVAILABLE in acado-api**

**Options:**
1. **Keep using legacy endpoint** (temporary)
2. **Create new endpoints in acado-api** (recommended)
3. **Disable category filtering** (not recommended)

**Recommendation:** Keep using legacy endpoints for now, migrate later when category management is added to acado-api.

---

## 🔄 RESPONSE STRUCTURE COMPARISON

### Legacy Response:
```json
{
  "data": [
    {
      "id": 123,
      "name": "Event Title",
      "description": "...",
      "image": "...",
      "start_date": "2025-01-01",
      "end_date": "2025-01-31",
      "com_status": {
        "program_status": "Ongoing",
        "program_time": "..."
      },
      // ... legacy fields
    }
  ]
}
```

### New acado-api Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Event Title",
      "description": "...",
      "logo": "...",
      "registrationStartDate": "2025-01-01T00:00:00.000Z",
      "registrationEndDate": "2025-01-31T00:00:00.000Z",
      "eventDate": "2025-02-01T00:00:00.000Z",
      "eventTime": "10:00 AM",
      "mode": "online",
      "status": "active",
      "difficultyLevel": "intermediate",
      "subscriptionType": "free",
      "isPopular": true,
      "stages": [...],
      "registrations": 150,
      "views": 500
    }
  ]
}
```

### Field Mapping Required:

| Legacy Field | New API Field | Notes |
|-------------|---------------|-------|
| `name` | `title` | Rename |
| `image` | `logo` | Rename |
| `start_date` | `registrationStartDate` | Different meaning |
| `end_date` | `registrationEndDate` | Different meaning |
| `com_status.program_status` | `status` | Map: Ongoing→active, Completed→completed |
| `type` | (removed) | Now separate collections (events, scholarships) |

---

## ⚠️ CRITICAL ISSUES

### 1. Data Structure Mismatch

The legacy and new API have **significantly different** data structures:

**Legacy:**
- Uses `name` for title
- Has `com_status` object with `program_status`
- Mixes events, scholarships, volunteering in one endpoint
- Uses simple date strings

**New API:**
- Uses `title` for title
- Has direct `status` field
- Separate endpoints for each type
- Uses ISO date format
- Has structured `stages` array
- Has `eligibility` and `registrationSettings` objects

### 2. Component Dependencies

Many components expect the **legacy data structure**:
- Event cards expect `event.name`, `event.image`, `event.com_status`
- Filtering logic expects `com_status.program_status`
- Date formatting expects simple date strings

### 3. Missing Endpoints

- Event categories (`/event-category`)
- Event category groups (`/v1/event-category-group`)

These are used for filtering and navigation but don't exist in acado-api yet.

---

## 💡 RECOMMENDED SOLUTION

### Option A: Full Migration with Adapter (RECOMMENDED) ✅

**Pros:**
- Clean, maintainable code
- Uses new API fully
- Better data structure
- Future-proof

**Cons:**
- Requires data adapter
- More complex implementation
- Need to handle field mapping

**Steps:**
1. Create event response adapter
2. Map legacy fields to new fields
3. Update all service files
4. Test thoroughly
5. Keep category endpoints on legacy (temporary)

**Estimated Time:** 6-8 hours

---

### Option B: Gradual Migration (QUICK FIX) ⚡

**Pros:**
- Quick implementation
- Less risk
- Easier testing

**Cons:**
- Maintains technical debt
- Mixed legacy/new code
- Confusing for developers

**Steps:**
1. Update `fetchEvents()` to route to `/events` for type='event'
2. Keep response adapter simple
3. Keep components unchanged
4. Migrate categories later

**Estimated Time:** 2-3 hours

---

### Option C: Keep Legacy (NOT RECOMMENDED) ❌

**Pros:**
- No changes needed
- No risk

**Cons:**
- Doesn't use new API
- Defeats the purpose
- Technical debt grows

---

## 📝 IMPLEMENTATION PLAN (Option A)

### Phase 1: Create Event Response Adapter (2 hours)

Create `acado-client/src/utils/eventResponseAdapter.ts`:

```typescript
/**
 * Adapts new acado-api event response to legacy format
 */
export function adaptEventResponse(newEvent: any): LegacyEvent {
  return {
    id: newEvent.id,
    name: newEvent.title, // Map title → name
    description: newEvent.description,
    image: newEvent.logo || newEvent.thumbnailUrl, // Map logo → image
    start_date: newEvent.registrationStartDate,
    end_date: newEvent.registrationEndDate,
    event_date: newEvent.eventDate,
    event_time: newEvent.eventTime,
    com_status: {
      program_status: mapStatus(newEvent.status), // Map active → Ongoing
      program_time: newEvent.eventTime
    },
    mode: newEvent.mode,
    difficulty_level: newEvent.difficultyLevel,
    subscription_type: newEvent.subscriptionType,
    is_popular: newEvent.isPopular,
    // ... map other fields
  };
}

function mapStatus(apiStatus: string): string {
  const mapping = {
    'active': 'Ongoing',
    'completed': 'Completed',
    'draft': 'Upcoming',
    'cancelled': 'Cancelled'
  };
  return mapping[apiStatus] || apiStatus;
}
```

### Phase 2: Update Service Files (1 hour)

Update 3 service files:
1. `collaborate/EventService.ts`
2. `public/EventService.ts`
3. `learner/EventService.ts`

### Phase 3: Update Event Details (1 hour)

Update `fetchEventById()` to try:
1. `/events/:id` (new)
2. `/scholarships/:id` (new)
3. `/competitins-details/:id` (legacy fallback)

### Phase 4: Testing (2 hours)

Test all event pages:
- Public events page
- Learner events page
- Event details
- Event filtering
- Event search
- Event cards display

### Phase 5: Handle Missing Endpoints (2 hours)

For event categories:
- Keep using legacy endpoints temporarily
- Add TODO comments
- Plan migration when categories added to acado-api

---

## 🔄 DETAILED ENDPOINT MAPPING

| Legacy Endpoint | New Endpoint | Parameters | Status |
|----------------|--------------|------------|--------|
| `GET /get-competitons?type=event` | `GET /events` | status, mode, difficulty, etc. | ✅ Available |
| `GET /competition-list?type=event` | `GET /events` | Same as above | ✅ Available |
| `GET /competitins-details/:id` | `GET /events/:id` | - | ✅ Available |
| `GET /event-category` | ❌ Not available | - | ⚠️ Missing |
| `GET /v1/event-category-group` | ❌ Not available | - | ⚠️ Missing |
| `GET /learner-competition-detail/:id` | `GET /events/:id` | - | ✅ Available |

---

## 🎨 DATA STRUCTURE MAPPING

### Event Object Mapping:

```typescript
// Legacy Event
interface LegacyEvent {
  id: number;
  name: string;
  description: string;
  image: string;
  start_date: string;
  end_date: string;
  com_status: {
    program_status: 'Ongoing' | 'Completed' | 'Upcoming';
    program_time: string;
  };
  // ... other fields
}

// New API Event
interface NewEvent {
  id: string;
  title: string;
  description: string;
  logo?: string;
  registrationStartDate: Date;
  registrationEndDate: Date;
  eventDate: Date;
  eventTime: string;
  mode: 'online' | 'offline' | 'hybrid';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  subscriptionType: 'free' | 'paid';
  isPopular: boolean;
  stages: EventStage[];
  registrations?: number;
  views?: number;
  // ... other fields
}
```

---

## 🧪 TESTING CHECKLIST

### Prerequisites:
- [ ] `acado-api` running on `http://localhost:5000`
- [ ] MongoDB populated with event sample data
- [ ] `acado-client` restarted after changes

### Test Cases:

#### Public Events Page (`/events`)
- [ ] Navigate to `/events`
- [ ] Verify events list loads
- [ ] Check status filter dropdown works
- [ ] Verify event cards display correctly
- [ ] Click on event card → details page loads
- [ ] Check console - should see: `GET /events`

#### Learner Events Page (`/events-list`)
- [ ] Login as learner
- [ ] Navigate to `/events-list`
- [ ] Verify events list loads
- [ ] Test category filter (if working)
- [ ] Test search functionality
- [ ] Click on event → activity page loads
- [ ] Check console - should see: `GET /events`

#### Event Details
- [ ] Click on any event
- [ ] Verify details page loads
- [ ] Check all event information displays
- [ ] Verify stages/activities load (if applicable)
- [ ] Check console - should see: `GET /events/:id`

#### Home Page Events Section
- [ ] Navigate to home page (`/`)
- [ ] Scroll to events section
- [ ] Verify ongoing events display
- [ ] Verify "View All" link works

---

## ⚠️ RISKS & MITIGATION

### Risk 1: Data Structure Incompatibility

**Risk:** Components expect legacy fields that don't exist in new API  
**Impact:** HIGH - Could break event display  
**Mitigation:** Create comprehensive adapter to map all fields  
**Status:** ⚠️ Requires careful implementation

### Risk 2: Missing Category Endpoints

**Risk:** Event filtering by category won't work  
**Impact:** MEDIUM - Users can't filter by category  
**Mitigation:** Keep using legacy category endpoints temporarily  
**Status:** ✅ Acceptable workaround

### Risk 3: Date Format Differences

**Risk:** Date parsing might fail  
**Impact:** MEDIUM - Dates might display incorrectly  
**Mitigation:** Add date format conversion in adapter  
**Status:** ✅ Can be handled

### Risk 4: Status Mapping

**Risk:** Status values are different (Ongoing vs active)  
**Impact:** MEDIUM - Filtering and display might break  
**Mitigation:** Map status values in adapter  
**Status:** ✅ Can be handled

---

## 📊 COMPONENT IMPACT ANALYSIS

### Components Using Event Data:

1. **Event Cards** - Expect `name`, `image`, `com_status`
   - **Impact:** HIGH
   - **Action:** Need adapter

2. **Event Filters** - Expect `com_status.program_status`
   - **Impact:** HIGH
   - **Action:** Need adapter

3. **Event Details** - Expect legacy structure
   - **Impact:** HIGH
   - **Action:** Need adapter

4. **Event Lists** - Expect array of legacy events
   - **Impact:** HIGH
   - **Action:** Need adapter

---

## 🎯 DECISION REQUIRED

**Which approach do you prefer?**

### A) Full Migration with Adapter (Recommended)
- ✅ Clean solution
- ✅ Uses new API
- ⏱️ 6-8 hours
- ⚠️ Requires thorough testing

### B) Gradual Migration (Quick Fix)
- ⚡ Fast implementation
- ⚠️ Technical debt
- ⏱️ 2-3 hours
- ✅ Lower risk

### C) Keep Legacy (Not Recommended)
- ❌ No benefits
- ❌ Defeats purpose
- ⏱️ 0 hours
- ❌ Technical debt

---

## 📝 NEXT STEPS

1. **Choose migration approach** (A or B)
2. **Create event response adapter** (if Option A)
3. **Update service files**
4. **Test event pages**
5. **Handle missing category endpoints**
6. **Document changes**

---

## 📄 RELATED DOCUMENTATION

- `SCHOLARSHIP_API_UPDATE.md` - Scholarship migration (completed)
- `ENDPOINT_MIGRATION_COMPLETE.md` - Courses migration (completed)
- `CLIENT_API_PREFIX_FIX.md` - API prefix fix (completed)

---

## 🎯 RECOMMENDATION

**I recommend Option B (Gradual Migration)** because:

1. ✅ **Quick to implement** - Can be done in 2-3 hours
2. ✅ **Lower risk** - Minimal changes to components
3. ✅ **Backward compatible** - Fallback to legacy if needed
4. ✅ **Consistent with scholarship** - Same pattern already implemented
5. ✅ **Easy to test** - Smaller scope

We can always enhance it later with a full adapter if needed.

---

**Analysis Complete!** 📊

Please let me know which option you prefer, and I'll proceed with the implementation immediately.

