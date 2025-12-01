import { lazy } from 'react'
import type { Routes } from '@app/types/routes'
import { ADMIN, FACULTY, LEARNER } from '@app/config/constants/roles.constant'

export const communityRoutes: Routes = [
    {
        key: 'community.wall',
        path: `/community/wall`,
        component: lazy(() => import('@features/community')),
        authority: [LEARNER, ADMIN, FACULTY],
        meta: {
            pageContainerType: 'gutterless',
        }
    },
    {
        key: 'community.wall',
        path: '/community/wall/post/:postId',
        component: lazy(() => import('@features/community/pages/wall/post/details')),
        authority: [LEARNER, FACULTY, ADMIN],
        meta: {
            pageContainerType: 'gutterless'
        },
    },
    {
        key: 'community.mycommunities',
        path: '/community/mycommunities',
        component: lazy(() => import('@features/community/pages/mycommunities')),
        authority: [LEARNER, FACULTY, ADMIN],
        meta: {
            pageContainerType: 'gutterless'
        },
    },
    {
        key: 'community.discover',
        path: '/community/discover',
        component: lazy(() => import('@features/community/pages/discover')),
        authority: [LEARNER, FACULTY, ADMIN],
        meta: {
            pageContainerType: 'gutterless'
        },
    },
     {
        key: 'nav.communities.wall.post',
        path: '/community/details/:communityId',
        component: lazy(() => import('@features/community/components/details')),
        authority: [LEARNER, FACULTY, ADMIN],
        meta: {
            pageContainerType: 'gutterless'
        },
     
    },
    // community/mycommunities/203
    {
        key: 'community.mycommunities',
        path: '/community/mycommunities/:communityId',
        component: lazy(() => import('@features/community/pages/mycommunities/details')),
        authority: [LEARNER, FACULTY, ADMIN],
        meta: {
            pageContainerType: 'gutterless'
        },
    },
    // community/myposts/createpost
    {
        key: 'community.myposts.createpost',
        path: '/community/myposts/createpost',
        component: lazy(() => import('@features/community/pages/mycommunities/CreatePostPage')),
        authority: [LEARNER, FACULTY, ADMIN],
        meta: {
            pageContainerType: 'gutterless'
        },
    }
]
