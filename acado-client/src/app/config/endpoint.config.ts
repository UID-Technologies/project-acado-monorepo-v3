export const apiPrefix = '/api'

const endpointConfig = {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    signUp: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    googleOauthSignIn: '/google-auth-login',
    refreshToken: '/auth/refresh',
    profile: '/auth/profile',
}

export default endpointConfig