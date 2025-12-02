import { lazy } from 'react'
import type { Routes } from '@app/types/routes'

const publicRoute: Routes = [
    {
        key: '/',
        path: '/',
        component: lazy(() => import('@public/Home')),
        authority: [],
        meta: {
            pageContainerType: 'gutterless',
        }
    },
    {
        key: 'courses',
        path: '/courses',
        component: lazy(() => import('@public/Courses')),
        authority: [],
    },

    {
        key: 'LMSCourses',
        path: '/lms-courses',
        component: lazy(() => import('@public/lmsCourse/index')),
        authority: [],
    },
    {
        key: 'LMSCoursesDetails',
        path: '/lms-coursesDetails/:course_id',
        component: lazy(() => import('@public/Course/Show')),
        authority: [],
    },
    // events
    {
        key: 'events',
        path: '/events',
        component: lazy(() => import('@public/Events')),
        authority: [],
    },
    {
        key: 'brochure',
        path: '/brochure/lead-capture',
        component: lazy(() => import('@public/brochure/LeadCaptureForm')),
        authority: [],
    },
    {
        key: 'events-details',
        path: '/events/:event_id',
        component: lazy(() => import('@public/EventDetails')),
        authority: [],
    },

    {
        key: 'nav.Explore.schlorshipPublic',
        path: '/schlorship-details/:program_id',
        component: lazy(() => import('@public/scholarship/schlorship-details')),
        authority: [],
    },
    {
        key: 'nav.Explore.schlorshipActivity',
        path: '/schlorship-activity/:id',
        component: lazy(() => import('@public/scholarship/schlorship-activity')),
        authority: [],
    },
    // scholarship
    {
        key: 'scholarship',
        path: '/scholarship',
        component: lazy(() => import('@public/Scholarship')),
        authority: [],
    },
    // volunteering
    {
        key: 'volunteering',
        path: '/volunteer',
        component: lazy(() => import('@public/volunteering')),
        authority: [],
    },
    // how to apply
    {
        key: 'how-to-apply',
        path: '/how-to-apply',
        component: lazy(() => import('@public/HowToApply')),
        authority: [],
    },
    // community
    {
        key: 'community',
        path: '/community',
        component: lazy(() => import('@public/Community')),
        authority: [],
    },
    // universities
    {
        key: 'universities',
        path: '/universities',
        component: lazy(() => import('@public/University/Universities')),
        authority: [],
    },
    {
        key: 'university-details',
        path: '/universities/:university_id',
        component: lazy(() => import('@public/University/Details')),
        authority: [],
    },
    {
        key: 'nav.Help.policy',
        path: '/privacy-policy',
        component: lazy(() => import('@public/policy/privacyPolicy')),
        authority: [],
    },
    {
        key: 'nav.Help.terms',
        path: '/terms-conditions',
        component: lazy(() => import('@public/policy/Termsandconditions')),
        authority: [],
    },
    // CourseShow
    {
        key: 'course-show-public',
        path: '/course/:course_id',
        component: lazy(() => import('@public/Course/WPShow')),
        authority: [],
    },
    {
        key: 'course-show-smak',
        path: '/smak/course/:course_id',
        component: lazy(() => import('@public/Course/Show')),
        authority: [],
    },
    {
        key: 'user-form',
        path: '/user-form',
        component: lazy(() => import('@public/Form')),
        authority: [],
    }
]

export default publicRoute
