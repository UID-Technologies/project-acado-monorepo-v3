import authRoute from '@app/config/routes.config/authRoute'
import publicRoute from '@app/config/routes.config/publicRoute'
import { useLocation } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import PublicLayout from './PublicLayout'
import type { CommonProps } from '@app/types/common'

const PreLoginLayout = ({ children }: CommonProps) => {
    const location = useLocation()

    const { pathname } = location

    // const isAuthPath = authRoute.some((route) => route.path === pathname)
    // const isPublicPath = publicRoute.some((route) => route.path === pathname)
    const isAuthPath = authRoute.some((route) => matchRoute(route.path, pathname));
    const isPublicPath = publicRoute.some((route) => matchRoute(route.path, pathname));

    return (
        <>

            {isAuthPath ?
                <div className="flex flex-auto flex-col h-[100vh]">
                    <AuthLayout>{children}</AuthLayout>
                </div>
                : isPublicPath ?
                    <div className="flex flex-auto flex-col">
                        <PublicLayout>{children}</PublicLayout>
                    </div>
                    : children}

        </>

    )
}


const matchRoute = (routePath: string, pathname: string) => {
    const routeRegex = new RegExp(
        `^${routePath.replace(/:[^/]+/g, '([^/]+)')}$`
    );
    return routeRegex.test(pathname);
};

export default PreLoginLayout
