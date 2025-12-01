import ProtectedRoute from './ProtectedRoute'
import AuthorityGuard from './AuthorityGuard'
import AppRoute from './AppRoute'
import PageContainer from '@/components/template/PageContainer'
import { protectedRoutes, authRoutes, publicRoutes } from '@app/config/routes.config'
import { useAuth } from '@app/providers/auth'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { LayoutType } from '@app/types/theme'
import AuthRoute from './AuthRoute'
import PublicRoute from './PublicRoute'
// import { useEventCategoryGroups } from '@app/hooks/data/collaborate/useEvents'
// import { useMemo } from 'react'
// import { LEARNER } from '@app/config/constants/roles.constant'
// import type { Routes as RouteType } from '@app/types/routes'

// const EventGroupsPage = lazy(() => import('@features/collaborate/event-groups'))

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const AllRoutes = (props: AllRoutesProps) => {
    const { user } = useAuth();

    // const { data: eventCategoryGroups = [] } = useEventCategoryGroups();
    // const eventCategoryGroup = eventCategoryGroups.find((group) => group.group_name === "Events");

    // 🔹 Helper slug
    // const makeSlug = (name: string) =>
    //     name.toLowerCase().replace(/\s+/g, '-')

    // 🔹 Build dynamic routes with stable component ref
    // const dynamicEventCategoryRoutes: RouteType = useMemo(
    //     () =>
    //         (eventCategoryGroup?.event_categories || []).map((category) => ({
    //             key: `event-category-${category.id}`,
    //             path: `/event-groups/${makeSlug(category.name)}`,
    //             component: EventGroupsPage,
    //             authority: [LEARNER],
    //             // eslint-disable-next-line react-hooks/exhaustive-deps
    //         })), [eventCategoryGroup?.id]
    // )

    // 🔹 Merge static + dynamic once
    // const mergedProtectedRoutes = useMemo(() => [...protectedRoutes, ...dynamicEventCategoryRoutes], [dynamicEventCategoryRoutes])

    return (
        <Routes>
            <Route path="/" element={<PublicRoute />}>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
            <Route path="/" element={<ProtectedRoute />}>
                {/* <Route path="/" element={<Navigate replace to={authenticatedEntryPath} />} /> */}
                {protectedRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <AuthorityGuard
                                userAuthority={user.authority}
                                authority={route.authority}
                            >
                                <PageContainer {...props} {...route.meta}>
                                    <AppRoute
                                        routeKey={route.key}
                                        component={route.component}
                                        {...route.meta}
                                    />
                                </PageContainer>
                            </AuthorityGuard>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
            <Route path="/" element={<AuthRoute />}>
                {authRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
        </Routes>
    )
}

export default AllRoutes
