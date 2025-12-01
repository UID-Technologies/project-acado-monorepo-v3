import { lazy } from 'react'
import type { Routes } from '@app/types/routes'
import { ADMIN, FACULTY, LEARNER } from '@app/config/constants/roles.constant'
import { LAYOUT_BLANK } from '@app/config/constants/theme.constant'

export const learningRoutes: Routes = [
    {
        key: 'assessment',
        path: `/assessment/attempt/instructions/:courseId/:id`,
        component: lazy(() => import('@features/player/assessment/instructions')),
        authority: [LEARNER, ADMIN, FACULTY],
        meta: {
            layout: LAYOUT_BLANK,
        }
    },
    {
        key: 'assessment',
        path: `/assessment/:courseId/:id`,
        component: lazy(() => import('@features/player/assessment/start')),
        authority: [LEARNER, ADMIN, FACULTY],
        meta: {
            layout: LAYOUT_BLANK,
        }
    },
    {
        key: 'AssessmentReview',
        path: '/assessment/attempt/assessmentReview/:id',
        component: lazy(() => import('@features/player/assessment/components/AssessmentReviewPage')),
        authority: [LEARNER, ADMIN, FACULTY],
        meta: {
            layout: LAYOUT_BLANK,
        }
    },
]
