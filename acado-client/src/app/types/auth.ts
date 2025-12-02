export type SignInCredential = {
    email: string
    password: string
}

export type googleOauthSignIn = {
    center_id: number | null,
    course_id: number | null,
    token: string,
}

// Acado API response format
export type AcadoApiUser = {
    id: string
    email: string
    name: string
    username?: string
    role: string
    organizationId?: string
    organizationName?: string
    universityIds?: string[]
    courseIds?: string[]
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export type SignInResponse = {
    status: number,
    error: string,
    data: {
        accessToken: string
        user: AcadoApiUser
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    name: string
    email: string
    password: string
    username?: string
    organizationId: string
    universityId: string
    courseIds?: string[]
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 0 | 1 | undefined

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string,
    error: string
}>

export type User = AcadoApiUser

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
