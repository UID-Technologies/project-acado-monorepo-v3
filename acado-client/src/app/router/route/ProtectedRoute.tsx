import appConfig from '@app/config/app.config'
import { REDIRECT_URL_KEY } from '@app/config/constants/app.constant'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@app/providers/auth'
import cookiesStorage from '@services/storage/cookiesStorage'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
    const { authenticated } = useAuth()
    const { pathname } = useLocation()
   
    const getPathName = pathname === '/' ? '' : `?${REDIRECT_URL_KEY}=${location.pathname}`

    if(getPathName && !authenticated){
        localStorage.setItem(REDIRECT_URL_KEY, location.pathname);
    }

    if (!authenticated) {
        cookiesStorage.removeItem('token')
    }

    console.log('ProtectedRoute authenticated', getPathName);


    if (!authenticated) {
        return (
            <Navigate
                replace
                to={`${unAuthenticatedEntryPath}${getPathName}`}
            />
        )
    }

    return <Outlet />
}

export default ProtectedRoute
