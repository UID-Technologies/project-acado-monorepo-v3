import { lazy } from 'react'
import authRoute from './authRoute'
import publicRoute from './publicRoute'
import type { Routes } from '@app/types/routes'
import { LEARNER, FACULTY } from '@app/config/constants/roles.constant'
import { LAYOUT_COLLAPSIBLE_HIDE_SIDE_MENU } from '@app/config/constants/theme.constant'
import { learningRoutes } from './learning'
import { communityRoutes } from './community'

export const authRoutes: Routes = [...authRoute]
export const publicRoutes: Routes = [...publicRoute]

export const protectedRoutes: Routes = [
    ...learningRoutes,
    ...communityRoutes,
    {
        key: 'nav.dashboard.dashboard',
        path: '/dashboard',
        component: lazy(() => import('@learner/dashboard/DashboardPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.courses',
        path: '/courses-list',
        component: lazy(() => import('@learner/courses/List')),
        authority: [LEARNER],
        meta: {
            pageContainerType: 'gutterless'
        }
    },
    {
        key: 'nav.Explore.courses',
        path: '/courses-show/:course_id',
        component: lazy(() => import('@learner/courses/Details')),
        authority: [LEARNER],
    },
    {
        key: 'nav.dashboard.learning',
        path: '/learning?',
        component: lazy(() => import('@learner/learning/CourseDashboard')),
        authority: [LEARNER],
    },
    {
        key: 'nav.dashboard.application',
        path: '/application',
        component: lazy(() => import('@learner/application/ApplicationPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.interests',
        path: '/interests',
        component: lazy(() => import('@learner/interest/InterestPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.skills',
        path: '/skills',
        component: lazy(() => import('@learner/skills/SkillPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Social.news-letter',
        path: '/news-letter',
        component: lazy(() => import('@features/app/learner/news-letter/partials/NewsLetterPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Social.news-letter',
        path: '/newsLetterDetail/:id',
        component: lazy(() => import('@learner/news-letter/NewsLetterDetailPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Social.blogs',
        path: '/blogs',
        component: lazy(() => import('@learner/blog/BlogPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Social.blogs',
        path: '/blogDetail/:id',
        component: lazy(() => import('@learner/blog/BlogDetailPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Social.mentoring',
        path: '/mentoring',
        component: lazy(() => import('@learner/mentor/MentorPage')),
        authority: [LEARNER],
    },
    {
        key: 'MyPortal',
        path: '/my-portal',
        component: lazy(() => import('@learner/myportal/MyPortalPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Portfolio.assessment',
        path: '/assessment',
        component: lazy(() => import('@learner/self-assessment/SelfCommunity')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Portfolio.assessment',
        path: '/self-assessmentList/:id',
        component: lazy(() => import('@learner/self-assessment/SelfAssessmentList')),
        authority: [LEARNER],
    },
    {
        key: 'LMSCourses',
        path: '/lms-courses',
        component: lazy(() => import('@learner/lmsCourse/index')),
        authority: [LEARNER],
    },
    {
        key: 'freeCourseDetail',
        path: '/freeCourseDetail',
        component: lazy(() => import('@learner/lmsCourse/freeCourseDetails')),
        authority: [LEARNER],
    },
    {
        key: 'LMSCoursesDetails',
        path: '/lms-coursesDetails/:course_id',
        component: lazy(() => import('@learner/courses/LmsCourses')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.events',
        path: '/assignment/:id',
        component: lazy(() => import('@learner/assignment/AssignmentComponent')),
        authority: [LEARNER],
    },
    {
        key: 'AssessmentAttempt',
        path: '/assessmentAttempt',
        component: lazy(() => import('@features/app/learner/assessment/AssessmentInstruction')),
        authority: [LEARNER],
    },
    {
        key: 'AssessmentReview',
        path: '/assessmentReview/:id',
        component: lazy(() => import('@learner/assessment/AssessmentReviewPage')),
        authority: [LEARNER],
    },
    {
        key: 'AssessmentQuestion',
        path: '/assessmentQuestion/:id',
        component: lazy(() => import('@features/app/learner/assessment/AssessmentAttemptPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.dashboard.learning',
        path: '/course-module/:id',
        component: lazy(() => import('@features/app/learner/courses/my-learning/CourseShow')),
        authority: [LEARNER],
    },
    {
        key: 'nav.dashboard.learning',
        path: '/courses/:courseId/modules/:moduleId',
        component: lazy(() => import('@features/app/learner/courses/my-learning/ModuleDetails')),
        authority: [LEARNER],
    },
    {
        key: 'nav.dashboard.learning',
        path: '/program-content/:id',
        component: lazy(() => import('@features/app/learner/programs/ProgramContentPage')),
        authority: [LEARNER],
    },
    {
        key: 'AssessmentSummary',
        path: '/assessmentSummary/:id',
        component: lazy(() => import('@features/app/learner/assessment/AssessmentSummaryPage')),
        authority: [LEARNER],
    },
    {
        key: 'ZoomClass',
        path: '/zoomClass',
        component: lazy(() => import('@features/app/learner/zoomclass/ZoomClassPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.dashboard.calender',
        path: '/calender',
        component: lazy(() => import('@calendar/index')),
        authority: [LEARNER],
    },
    {
        key: 'nav.dashboard.calender',
        path: '/fac-calendar/:username',
        component: lazy(() => import('@features/app/faculty/calendar/index')),
        authority: [FACULTY],
        meta: {
            layout: 'blank'
        }
    },
    {
        key: 'nav.Help.privacy-policy',
        path: '/acado-privacy-policy',
        component: lazy(() => import('@features/app/public/policy/privacyPolicy')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Help.privacy-policy',
        path: '/term-and-conditions',
        component: lazy(() => import('@features/app/learner/term-conditions/index')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.events',
        path: '/events-list',
        component: lazy(() => import('@features/collaborate/events')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.events',
        path: '/events-list-old',
        component: lazy(() => import('@learner/events/EventsPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.events',
        path: '/event-activity/:id',
        component: lazy(() => import('@learner/events/EventActivity')),
        authority: [LEARNER],
    },
    // {
    //     key: 'nav.Explore.schlorship',
    //     path: '/schlorship-activity/:event_id',
    //     component: lazy(() => import('@learner/scholarship/schlorship-details')),
    //     authority: [LEARNER],
    // },
    {
        key: 'nav.Explore.volunteering',
        path: '/volunteering-details/:program_id',
        component: lazy(() => import('@learner/volunteering/volunteeringDetails')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.volunteering',
        path: '/volunteering-activity/:id',
        component: lazy(() => import('@learner/volunteering/VolunteerActivity')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.schlorship',
        path: '/schlorship-details/:program_id',
        component: lazy(() => import('@learner/scholarship/schlorship-details')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.schlorship',
        path: '/schlorship-activity/:id',
        component: lazy(() => import('@learner/scholarship/schlorship-activity')),
        authority: [LEARNER],
    },
    {
        key: 'notification',
        path: `/notification-popup`,
        component: lazy(() => import('@learner/notification/notification')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.volunteerOpportunities',
        path: '/volunteerOpportunities',
        component: lazy(() => import('@learner/volunteering/certificates')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.internshipDetails',
        path: '/internshipDetails/:id',
        component: lazy(() => import('@learner/internship/internshipDetails')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.events',
        path: '/event-activity/:event_id/content/:content_id',
        component: lazy(() => import('@learner/events/activities/Activity')),
        authority: [LEARNER],
        meta: {
            layout: LAYOUT_COLLAPSIBLE_HIDE_SIDE_MENU
        }
    },
    {
        key: 'nav.Explore.Universities',
        path: '/universities',
        component: lazy(() => import('@learner/universities/UniversitiesListing')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Social.reels',
        path: '/reels',
        component: lazy(() => import('@learner/reels/ReelsPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.Universities',
        path: 'universities-list',
        component: lazy(() => import('@learner/university/List')),
        authority: [LEARNER],
    },

    {
        key: 'brochure',
        path: '/brochure/lead-form',
        component: lazy(() => import('@learner/brochure/LeadCaptureForm')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.Universities',
        path: '/universities-show/:university_id',
        component: lazy(() => import('@learner/university/UniversityDetails')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Social.communities',
        path: '/communities',
        component: lazy(() => import('@learner/community/CommunityPage')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Social.communities',
        path: '/communities/:id',
        component: lazy(() => import('@learner/community/CommunityDetails')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Social.communities',
        path: '/communities/content/:id',
        component: lazy(() => import('@learner/community/Content')),
        authority: [LEARNER],
    },
    {
        key: 'UniversityCourseDetail',
        path: '/university-course-listing',
        component: lazy(() => import('@learner/courses/UniversityCourseDetails')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Explore.courses',
        path: '/continue-learning',
        component: lazy(() => import('@features/app/learner/courses/my-learning')),
        authority: [LEARNER],
    },
    {
        key: 'courses.module',
        path: '/complete-profile',
        component: lazy(() => import('@learner/profile')),
        authority: [LEARNER],

    },
    {
        key: 'singleMenuItem',
        path: '/single-menu-view',
        component: lazy(() => import('@features/demo/SingleMenuView')),
        authority: [LEARNER],
    },

    {
        key: 'collapseMenu.item1',
        path: '/collapse-menu-item-view-1',
        component: lazy(() => import('@features/demo/CollapseMenuItemView1')),
        authority: [],
    },
    {
        key: 'collapseMenu.item2',
        path: '/collapse-menu-item-view-2',
        component: lazy(() => import('@features/demo/CollapseMenuItemView2')),
        authority: [],
    },
    {
        key: 'groupMenu.single',
        path: '/group-single-menu-item-view',
        component: lazy(() =>
            import('@features/demo/GroupSingleMenuItemView')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/group-collapse-menu-item-view-1',
        component: lazy(() =>
            import('@features/demo/GroupCollapseMenuItemView1')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/group-collapse-menu-item-view-2',
        component: lazy(() =>
            import('@features/demo/GroupCollapseMenuItemView2')
        ),
        authority: [],
    },
    {
        key: 'access-denied',
        path: '/access-denied',
        component: lazy(() => import('@errors/AccessDenied')),
        authority: [],
    },
    // protfolio
    {
        key: 'Portfolio',
        path: '/portfolio',
        component: lazy(() => import('@features/app/common/profile-view')),
        authority: [],
    },
    {
        key: 'Portfolio',
        path: '/portfolio/:org_id/:uniqueIdentifier',
        component: lazy(() => import('@features/app/common/profile-view/openview')),
        authority: [],
    },
    // {
    //     key: 'Portfolio',
    //     path: '/portfolio/edit',
    //     component: lazy(() => import('@features/app/learner/features/portfolio/builder')),
    //     authority: [LEARNER],
    // },

    // {
    //     key: 'nav.Portfolio.profile',
    //     'path': '/portfolio/builder',
    //     component: lazy(() => import('@learner/features/portfolio/builder')),
    //     authority: [LEARNER],
    // },
    // resume
    // {
    //     key: 'nav.Portfolio.resume',
    //     path: '/resume',
    //     component: lazy(() => import('@learner/features/portfolio/Resume')),
    //     authority: [LEARNER],
    // },


    // Mail box
    // {
    //     key: 'nav.Help.mail-box',
    //     path: '/help/mail-box',
    //     component: lazy(() => import('@features/app/learner/features/mail-box')),
    //     authority: [LEARNER],
    // },

    {
        key: 'nav.Help.mail-box',
        path: '/help/mail-box',
        component: lazy(() => import('@features/app/common/queries')),
        authority: [LEARNER],
    },
    {
        key: 'nav.Help.mail-box',
        path: '/help/mail-box/new',
        component: lazy(() => import('@features/app/common/queries/CreateQuery')),
        authority: [LEARNER],
    },

    {
        key: 'nav.Help.customer-support',
        path: '/customer-support',
        component: lazy(() => import('@features/app/learner/features/support')),
        authority: [LEARNER],
    },
    // {
    //     key: 'nav.Help.customer-support',
    //     path: '/calender-modal',
    //     component: lazy(() => import('@features/app/learner/features/calendar/components/Modal')),
    //     authority: [LEARNER],
    // },

    // internship
    {
        key: 'nav.Internship',
        path: '/internship',
        component: lazy(() => import('@features/app/learner/internship')),
        authority: [LEARNER],
    },
    // scholarship
    {
        key: 'nav.Scholarship',
        path: '/learner-scholarship',
        component: lazy(() => import('@features/app/learner/scholarship/schlorship-page')),
        authority: [LEARNER],
    },
    // scholarship details
    {
        key: 'nav.Explore.schlorship',
        path: '/learner-schlorship-details/:program_id',
        component: lazy(() => import('@learner/scholarship/schlorship-details')),
        authority: [LEARNER],
    },
    // volunteering
    {
        key: 'nav.Volunteering',
        path: '/volunteering',
        component: lazy(() => import('@features/app/learner/volunteering')),
        authority: [LEARNER],
    },

    {
        key: 'nav.Help.policy',
        path: '/privacy-and-policy',
        component: lazy(() => import('@public/policy/privacyPolicy')),
        authority: [],
    },





    // Code - Collaborate.   ##################################################################################################



    // {
    //     key: 'nav.collaborate.onTheAgenda.masterclass',
    //     path: '/agenda/masterclass',
    //     component: lazy(() => import('@features/collaborate/agenda')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.collaborate.onTheAgenda.workshops',
    //     path: '/agenda/workshops',
    //     component: lazy(() => import('@features/collaborate/agenda')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.collaborate.onTheAgenda.industryVisits',
    //     path: '/agenda/industry-visits',
    //     component: lazy(() => import('@features/collaborate/agenda')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.collaborate.onTheAgenda.competitions',
    //     path: '/agenda/competitions',
    //     component: lazy(() => import('@features/collaborate/agenda')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.collaborate.onTheAgenda.immersionPrograms',
    //     path: '/agenda/immersion-programs',
    //     component: lazy(() => import('@features/collaborate/agenda')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.collaborate',
    //     path: '/agenda/details/:id',
    //     component: lazy(() => import('@features/collaborate/agenda/details')),
    //     authority: [LEARNER, FACULTY],
    // },

    // mustattend

    // {
    //     key: 'nav.collaborate.must-attend.community-meetups',
    //     path: '/must-attend/community-meetups',
    //     component: lazy(() => import('@features/collaborate/must-attend')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.collaborate.must-attend.flagship-events',
    //     path: '/must-attend/flagship-events',
    //     component: lazy(() => import('@features/collaborate/must-attend')),
    //     authority: [LEARNER, FACULTY],
    // },
    // {
    //     key: 'nav.collaborate.must-attend.internship-placement-drive',
    //     path: '/must-attend/internship-placement-drive',
    //     component: lazy(() => import('@features/collaborate/must-attend')),
    //     authority: [LEARNER, FACULTY],
    // },

    // {
    //     key: 'nav.collaborate',
    //     path: '/must-attend/details/:id',
    //     component: lazy(() => import('@features/collaborate/must-attend/details')),
    //     authority: [LEARNER, FACULTY],
    // },


    // event group

    // {
    //     key: 'nav.collaborate.event-groups',
    //     path: '/event-groups',
    //     component: lazy(() => import('@features/collaborate/event-groups')),
    //     authority: [LEARNER],
    // },

    //Not found
    {
        key: 'not-found',
        'path': '*',
        component: lazy(() => import('@errors/NotFound')),
        authority: [],
    },
]
