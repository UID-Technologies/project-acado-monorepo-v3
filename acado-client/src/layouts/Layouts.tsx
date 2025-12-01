import { Suspense, useMemo } from 'react'
import Loading from '@/components/shared/Loading'
import type { CommonProps } from '@app/types/common'
import { useAuth } from '@app/providers/auth'
import { useThemeStore } from '@app/store/themeStore'
import PostLoginLayout from './PostLoginLayout'
import PreLoginLayout from './PreLoginLayout'
import { matchPath, useLocation } from 'react-router-dom'
import publicRoute from '@app/config/routes.config/publicRoute'
import PublicLayout from './PublicLayout'

const Layout = ({ children }: CommonProps) => {
    const layoutType = useThemeStore((state) => state.layout.type)

    const { authenticated } = useAuth();
    const location = useLocation();

    const isPublicRoute = useMemo(() => {
        return publicRoute.some(route => matchPath(route.path, location.pathname))
    }, [location.pathname])

    if (isPublicRoute) {
        return (
            <Suspense fallback={<Loading loading={true} />}>
                <PublicLayout>{children}</PublicLayout>
            </Suspense>
        )
    }

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            {authenticated ? (
                <PostLoginLayout layoutType={layoutType}>
                    {children}
                </PostLoginLayout>
            ) : (
                <PreLoginLayout>{children}</PreLoginLayout>
            )}
        </Suspense>
    )
}

export default Layout
