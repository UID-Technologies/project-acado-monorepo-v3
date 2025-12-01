import { Navigate, Outlet } from 'react-router-dom'
import appConfig from '@app/config/app.config'
import { useAuth } from '@app/providers/auth'

const { authenticatedEntryPath } = appConfig

const AuthRoute = () => {
    const { authenticated } = useAuth()
    return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default AuthRoute