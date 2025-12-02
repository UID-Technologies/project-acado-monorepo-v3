# ACADO Client - API Endpoints Reference

This document lists all API endpoints used in the `acado-client` application.

**Base URL Configuration:**
- Base URL: `envConfig.apiBaseUrl` (default: `https://elms.edulystventures.com`)
- API Prefix: `/api`
- Full Base URL: `${apiBaseUrl}/api`

---

## Authentication Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| POST | `/login` | User sign in | `services/auth/AuthService.ts` |
| POST | `/sign-out` | User sign out | `services/auth/AuthService.ts` |
| POST | `/joy/signup` | User sign up | `services/auth/AuthService.ts` |
| POST | `/forgot-password` | Request password reset | `services/auth/AuthService.ts` |
| POST | `/reset-password` | Reset password | `services/auth/AuthService.ts` |
| POST | `/google-auth-login` | Google OAuth sign in | `services/auth/AuthService.ts` |

---

## University & Organization Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| GET | `/university-list` | Get all universities/organizations | `services/public/UniversitiesService.ts` |
| GET | `/get-university-meta/{universityId}` | Get university details | `services/public/UniversitiesService.ts` |
| GET | `/wp/university/{universityId}/courses` | Get courses by university | `services/public/UniversitiesService.ts` |
| GET | `/wp/courses` | Get all courses | `services/public/UniversitiesService.ts` |
| POST | `/user-university-save` | Save user university mapping | `services/public/UniversitiesService.ts` |
| GET | `/user-university-mapped` | Get user's mapped universities | `services/public/UniversitiesService.ts` |
| GET | `/applied-university` | Get applied universities | `services/learner/AppliedUniversityService.ts` |
| GET | `/applied-university-course` | Get enrolled university courses | `services/learner/EnrolledUniversityService.ts` |

---

## Course Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| GET | `/wp/courses/` | Get all courses | `services/public/CoursesService.ts` |
| GET | `/wp/courses/{course_id}` | Get course by ID | `services/public/CoursesService.ts` |
| GET | `/get-course-category` | Get course categories | `services/public/CoursesService.ts` |
| GET | `/get-course-meta` | Get course metadata | `services/common/CourseService.ts` |
| GET | `/courses-list` | Get learner course list | `services/learner/CourseListServices.ts` |
| GET | `/applied-course` | Get applied courses | `services/learner/CourseListServices.ts` |
| GET | `/applied-course?limit=10000` | Get all applied courses | `services/learner/AppliedCourseListService.ts` |
| POST | `/user-course-lead` | Save course lead | `services/learner/CourseListServices.ts` |
| GET | `/v1/free-courses` | Get free courses | `services/public/LmsCourseService.ts` |
| GET | `/v1/get-course-details/{course_id}` | Get course details | `services/public/LmsCourseService.ts` |
| GET | `/v1/module-content-list/{module_id}` | Get module content list | `services/public/LmsCourseService.ts` |
| GET | `/v1/courses/continue-reading` | Get continue reading courses | `services/public/LmsCourseService.ts` |
| GET | `/learner/programs` | Get learner programs | `services/learner/ProgramListService.ts` |
| GET | `/learner/programs/{programId}` | Get program details | `services/learner/CourseModuleService.ts` |
| GET | `/learner/programs/modules/{moduleId}/0` | Get program module content | `services/learner/ProgramContentService.ts` |

---

## Community Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| POST | `/user-joy-category` | Get user communities | `services/public/CommunityService.ts` |
| GET | `/joy/content?category_id={id}` | Get community content | `services/public/CommunityService.ts` |
| GET | `/get-post` | Get posts | `services/learner/CommunityService.ts` |
| POST | `/user-view-tracking` | Track post views/likes | `services/learner/CommunityService.ts` |
| GET | `/get-comments-list/{postId}` | Get post comments | `services/learner/CommunityService.ts` |
| POST | `/user-comment-tracking` | Add comment to post | `services/learner/CommunityService.ts` |
| GET | `/courses/user-mapping?category_ids={ids}` | Join community | `services/learner/CommunityJoinService.ts` |
| GET | `/joy/content/delete/{id}` | Delete community post | `features/community/services/PostService.ts` |
| GET | `/joy/contents/{id}` | Get post details | `features/community/services/CommunityService.ts` |
| POST | `/create-post` | Create community post | `features/community/services/CommunityService.ts` |
| POST | `/update-post/{postId}` | Update community post | `features/community/services/CommunityService.ts` |
| GET | `/v1/org-popular-community-by-id` | Get popular community by ID | `features/community/services/CommunityService.ts` |
| GET | `/get-industry-domain` | Get industry domains | `features/community/services/CommunityService.ts` |
| GET | `/get-sub-domain` | Get sub-domains | `features/community/services/CommunityService.ts` |
| GET | `/competition-list` | Get competition/event list | `features/community/services/CommunityService.ts` |
| POST | `/user-joy-category?sort_by=member` | Get trending communities | `features/community/services/CommunityService.ts` |
| POST | `/v1/joy-content-repost` | Repost content | `features/community/services/CommunityService.ts` |
| POST | `/v1/repost-update/{id}` | Update repost | `features/community/services/CommunityService.ts` |
| GET | `/v1/popin-tag-post` | Get popin tag posts | `features/community/services/CommunityService.ts` |
| GET | `/v1/industry-latest-post` | Get industry latest posts | `features/community/services/CommunityService.ts` |
| GET | `/v1/community-peoples/{id}` | Get community members | `features/community/services/CommunityService.ts` |
| POST | `/joy/category` | Create community | `features/community/services/CommunityService.ts` |
| POST | `/joy/category/{community_id}` | Update community | `features/community/services/CommunityService.ts` |
| GET | `/joy/category/delete/{id}` | Delete community | `features/community/services/CommunityService.ts` |
| GET | `/v1/org-popular-community` | Get popular org communities | `features/community/services/CommunityService.ts` |
| GET | `/v1/get-recommended-community` | Get recommended communities | `features/community/services/CommunityService.ts` |
| GET | `/getCities` | Get cities | `features/community/services/CommunityService.ts` |
| GET | `/v1/user-community-analytics` | Get user community analytics | `features/community/services/CommunityService.ts` |
| POST | `/user-joy-category-unmap/{id}` | Leave community | `features/community/services/CommunityService.ts` |
| POST | `/v1/user-community-report` | Report community | `features/community/services/CommunityService.ts` |
| POST | `/v1/user-community-mute` | Mute community | `features/community/services/CommunityService.ts` |

---

## Event & Competition Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| GET | `/get-competitons` | Get competitions | `services/public/EventService.ts` |
| GET | `/get-competitons?type={type}` | Get competitions by type | `services/public/EventService.ts` |
| GET | `/get-competitons?type=volunteering` | Get volunteering events | `services/public/EventService.ts` |
| GET | `/competitins-details/{id}` | Get competition details | `services/public/EventService.ts` |
| GET | `/learner-competition-detail/{id}` | Get learner competition details | `services/public/EventService.ts` |
| GET | `/learner-competition-detail/{id}?is_applied=1` | Get applied competition details | `services/public/EventService.ts` |
| GET | `/competition-list` | Get competition list | `services/learner/EventService.ts` |
| GET | `/competition-list?type=scholarship` | Get scholarship events | `services/learner/EventService.ts` |
| GET | `/competition-list?type=volunteering` | Get volunteering events | `services/learner/EventService.ts` |
| GET | `/learner/content/{id}` | Get learner content | `services/learner/EventService.ts` |
| GET | `/learner-competition-detail/{event_id}` | Get event details | `services/learner/EventDetailsService.ts` |
| GET | `/learner-competition-detail/{event_id}` | Get event activities | `services/learner/EventActivityServices.ts` |

---

## Assessment & Assignment Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| GET | `/joy/content?category_id={id}&content_type=15` | Get self assessment | `services/public/SelfAssessmentService.ts` |
| GET | `/assessment-detail/{contentId}` | Get assessment details | `services/public/QuestionAttemptService.ts` |
| POST | `/assessment-submit` | Submit assessment | `services/public/AssessmentSubmitService.ts` |
| GET | `/assessment-review/{contentId}` | Review assessment | `services/public/AssessmentReviewService.ts` |
| POST | `/assessment-onfinish` | Finish assessment | `services/public/AssessmentFinishService.ts` |
| GET | `/assessment-instructions/{program_content_id}` | Get assessment instructions | `services/learning/AssesmentService.ts` |
| GET | `/assessment-result/{contentId}` | Get assessment result | `services/learning/AssesmentService.ts` |
| GET | `/assignment/{program_content_id}` | Get assignment list | `services/learner/AssignmentListService.ts` |
| GET | `/assignmentdetails/{program_content_id}` | Get assignment details | `services/learner/AssignmentDetailsService.ts` |
| POST | `/assignmentsubmit` | Submit assignment | `services/learner/AssignmentSubmitService.ts` |

---

## Portfolio Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| POST | `/add_portfolio_profile` | Add portfolio profile | `services/learner/PortfolioService.ts` |
| GET | `/user-portfolio` | Get user portfolio | `services/learner/PortfolioService.ts` |
| POST | `/addResume` | Add resume | `services/learner/PortfolioService.ts` |
| POST | `/addBanner` | Add banner | `services/learner/PortfolioService.ts` |
| POST | `/portfolio_image_upload` | Upload portfolio image | `services/learner/PortfolioService.ts` |
| POST | `/addPortfolioSocial` | Add portfolio social links | `services/learner/PortfolioService.ts` |
| POST | `/addProfessional` | Add professional experience | `services/learner/PortfolioService.ts` |
| POST | `/deletePortfolio` | Delete portfolio | `services/learner/PortfolioService.ts` |
| GET | `/skills-list` | Get skills list | `services/learner/PortfolioService.ts` |
| GET | `/skills-mapping-list` | Get skills mapping list | `services/learner/PortfolioService.ts` |
| POST | `/add-skill-mapping` | Add skill mapping | `services/learner/PortfolioService.ts` |
| POST | `/delete-skill-mapping` | Delete skill mapping | `services/learner/PortfolioService.ts` |

---

## Query & Support Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| POST | `/create-query` | Create query | `services/learner/QueryService.ts` |
| POST | `/get-query?page={page}` | Get queries | `services/common/QueryService.ts` |
| POST | `/get-query?page={page}&is_sent=0` | Get draft queries | `services/common/QueryService.ts` |
| GET | `/query-reply` | Get query replies | `services/common/QueryService.ts` |
| POST | `/user-query-reply` | Reply to query | `services/common/QueryService.ts` |
| POST | `/drop-query` | Drop query | `services/common/QueryService.ts` |
| POST | `/resend-query` | Resend query | `services/common/QueryService.ts` |

---

## Dashboard & Analytics Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| POST | `/g-dashboard` | Get dashboard data | `services/learner/DashboardServices.ts` |
| GET | `/application-dashboard` | Get application dashboard | `services/learner/ApplicationServices.ts` |
| GET | `/quick-actions` | Get quick actions | `services/learner/QuickActionService.ts` |

---

## Content & Media Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| POST | `/create-post` | Create post | `services/learner/CreateContentService.ts` |
| GET | `/get-post?post_type=news` | Get news posts | `services/learner/NewsServices.ts` |
| GET | `/get-post?post_type=blog` | Get blog posts | `services/learner/BlogServices.ts` |
| GET | `/reels?from=1&count=20` | Get reels | `services/learner/ReelsService.ts` |
| GET | `/v1/generate-ai-image?title={prompt}&items=20` | Generate AI images | `services/generative/GenerativeService.ts` |
| POST | `/v1/generate-ai-text` | Generate AI text | `services/generative/GenerativeService.ts` |
| GET | `/v1/generate-ai-video?prompt={prompt}` | Generate AI video | `services/generative/GenerativeService.ts` |

---

## User & Profile Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| GET | `/get-mentor-list` | Get mentor list | `services/learner/MentorListService.ts` |
| POST | `/user-interete-saved` | Get user interests | `services/learner/InterestAreaServices.ts` |
| POST | `/user-course-category-map` | Map user course category | `services/learner/InterestAreaServices.ts` |
| GET | `/job-list-wow` | Get internship/job list | `services/learner/InternshipService.ts` |

---

## Notification Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| GET | `/joy/notifications` | Get notifications | `services/learner/NotificationsServices.ts` |

---

## Brochure & Lead Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| POST | `/save-brochure-log` | Save brochure lead | `services/public/BrochureLeadService.ts` |

---

## Country & Location Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| GET | `/get-country-list` | Get country list | `services/public/CountryService.ts` |

---

## Error Logging Endpoints

| Method | Endpoint | Description | Service File |
|--------|----------|-------------|--------------|
| POST | `/save-error-report` | Save error log | `services/logErrorService.ts` |

---

## Notes

1. **Base URL**: All endpoints are relative to `${apiBaseUrl}/api` where `apiBaseUrl` defaults to `https://elms.edulystventures.com`
2. **Authentication**: Most endpoints require authentication via Bearer token in the Authorization header
3. **Response Format**: Most endpoints return data in the format: `{ status, data, error }`
4. **Query Parameters**: Many endpoints support query parameters for filtering and pagination
5. **File Uploads**: Some endpoints (like portfolio image upload, post creation) accept `FormData` for file uploads

---

## Endpoint Categories Summary

- **Authentication**: 6 endpoints
- **University & Organization**: 8 endpoints
- **Course**: 13 endpoints
- **Community**: 30+ endpoints
- **Event & Competition**: 10 endpoints
- **Assessment & Assignment**: 9 endpoints
- **Portfolio**: 11 endpoints
- **Query & Support**: 6 endpoints
- **Dashboard & Analytics**: 3 endpoints
- **Content & Media**: 6 endpoints
- **User & Profile**: 4 endpoints
- **Notification**: 1 endpoint
- **Brochure & Lead**: 1 endpoint
- **Country & Location**: 1 endpoint
- **Error Logging**: 1 endpoint

**Total: ~110+ unique endpoints**

