/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@app/config/app.config'
import { useSessionUser, useToken } from '@app/store/authStore'
import { apiSignIn, apiSignOut, apiSignUp } from '@services/auth/AuthService'
import { REDIRECT_URL_KEY } from '@app/config/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import cookiesStorage from '@services/storage/cookiesStorage'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
} from '@app/types/auth'
import type { ReactNode } from 'react'
import type { NavigateFunction } from 'react-router-dom'
import { setProfileEditKey } from '@features/app/common/profile-view/config'
import { useEventCategoryGroups } from '@app/hooks/data/collaborate/useEvents'
import { useForms } from '@app/hooks/data/useCourses'
import { useQueryClient } from '@tanstack/react-query'


type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

const IsolatedNavigator = forwardRef<IsolatedNavigatorRef>((_, ref) => {
    const navigate = useNavigate()

    useImperativeHandle(
        ref,
        () => {
            return {
                navigate,
            }
        },
        [navigate],
    )

    return <></>
})

function AuthProvider({ children }: AuthProviderProps) {

    const queryClient = useQueryClient();
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser);
    const setSessionSignedIn = useSessionUser(
        (state) => state.setSessionSignedIn,
    )
    const { token, setToken } = useToken();
    const { data: eventCategoryGroups = [] } = useEventCategoryGroups();


    // const { data: forms = [] } = useForms();
    
    // alert(forms)

    const authenticated = Boolean(token && signedIn)

    const navigatorRef = useRef<IsolatedNavigatorRef>(null)
    const navigate = useNavigate()

    // Track login attempts and disable state
    const [loginAttempts, setLoginAttempts] = useState(0)
    const [isDisabled, setIsDisabled] = useState(false)
    const [timer, setTimer] = useState(30) // 30 seconds timer
    const MAX_ATTEMPTS = 5

    const redirect = () => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY);

        const redirectURLFromStore = localStorage.getItem(REDIRECT_URL_KEY);
        if(redirectURLFromStore){
            localStorage.removeItem(REDIRECT_URL_KEY);
            console.log('redirectURLFromStore', redirectURLFromStore);
            navigatorRef.current?.navigate(redirectURLFromStore);
            return;
        }

        navigatorRef.current?.navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
    }

    const handleSignIn = (tokens: Token, user?: User) => {
        queryClient.clear();
        setToken(tokens.accessToken)
        setProfileEditKey(user?.profile_svc_editkey ?? '')
        setSessionSignedIn(true);
        localStorage.setItem('eventCategoryGroups', JSON.stringify(eventCategoryGroups));
        if (user) {
            setUser(user);
        }
        setLoginAttempts(0);
    }

    const handleSignOut = () => {
        queryClient.clear()
        setToken('')
        setUser({} as User)
        setSessionSignedIn(false)
        window.localStorage.clear()
        cookiesStorage.clear()
    }

    const signIn = async (values: SignInCredential): AuthResult => {
        if (loginAttempts >= MAX_ATTEMPTS) {
            return {
                status: 0,
                message: 'Too many failed attempts. Please try again later.',
                error: 'Too many failed attempts. Please try again later.',
            }
        }

        try {
            const resp = await apiSignIn(values)
            console.log('resp', resp)
            if (resp) {
                if (resp?.status === 0) {
                    setLoginAttempts((prev) => prev + 1)
                    if (loginAttempts + 1 >= MAX_ATTEMPTS) {
                        setIsDisabled(true)
                        let countdown = 30
                        setTimer(countdown)
                        const interval = setInterval(() => {
                            countdown -= 1
                            setTimer(countdown)
                            if (countdown <= 0) {
                                clearInterval(interval)
                                setLoginAttempts(0)
                                setIsDisabled(false)
                            }
                        }, 1000)
                    }
                    return {
                        status: 0,
                        message: 'Invalid credentials',
                        error: resp.error,
                    }
                }

                if (!(resp?.data?.token && resp?.data?.user)) {
                    setLoginAttempts((prev) => prev + 1)
                    if (loginAttempts + 1 >= MAX_ATTEMPTS) {
                        setIsDisabled(true)
                        let countdown = 30
                        setTimer(countdown)
                        const interval = setInterval(() => {
                            countdown -= 1
                            setTimer(countdown)
                            if (countdown <= 0) {
                                clearInterval(interval)
                                setLoginAttempts(0)
                                setIsDisabled(false)
                            }
                        }, 1000)
                    }
                    return {
                        status: 0,
                        message: 'Invalid credentials',
                        error: resp.error,
                    }
                }

                handleSignIn({ accessToken: resp?.data?.token }, resp?.data?.user)
                redirect();
                return {
                    status: 1,
                    message: '',
                    error: '',
                }
            }
            return {
                status: 0,
                message: 'Unable to sign in',
                error: '',
            }
        } catch (errors: any) {
            setLoginAttempts((prev) => prev + 1)
            if (loginAttempts + 1 >= MAX_ATTEMPTS) {
                setIsDisabled(true)
                let countdown = 30
                setTimer(countdown)
                const interval = setInterval(() => {
                    countdown -= 1
                    setTimer(countdown)
                    if (countdown <= 0) {
                        clearInterval(interval)
                        setLoginAttempts(0)
                        setIsDisabled(false)
                    }
                }, 1000)
            }
            return {
                status: 0,
                message: errors?.response?.data?.message || errors.toString(),
                error: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential): AuthResult => {
        try {
            const resp = await apiSignUp(values)
            if (resp) {
                if (resp?.status === 0) {
                    return {
                        status: 0,
                        message: resp.error,
                        error: resp.error,
                    }
                }

                if (!(resp?.data?.token && resp?.data?.user)) {
                    return {
                        status: 0,
                        message: resp.error,
                        error: resp.error,
                    }
                }

                handleSignIn({ accessToken: resp.data.token }, resp.data.user)
                redirect()
                return {
                    status: 1,
                    message: '',
                    error: '',
                }
            }
            return {
                status: 0,
                message: 'Unable to sign up',
                error: '',
            }
        } catch (errors: any) {
            return {
                status: 0,
                message: errors?.response?.data?.message || errors.toString(),
                error: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut()
            handleSignOut()
            navigate('/sign-in')
        } finally {
            handleSignOut()
            navigate('/sign-in')
        }
    }

    const oAuthSignIn = (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        })
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                signOut,
                oAuthSignIn,
                isDisabled, // Pass the disabled state
                timer, // Pass the timer state
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

IsolatedNavigator.displayName = 'IsolatedNavigator'

export default AuthProvider
