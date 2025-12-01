export type SignInCredential = {
    email: string
    password: string
}

export type googleOauthSignIn = {
    center_id: number | null,
    course_id: number | null,
    token: string,
}

export type SignInResponse = {
    status: number,
    error: string,
    data: {
        token: string,
        user: {
            userId?: string | null
            avatar?: string | null
            userName?: string | null
            authority?: string[]
            // api
            id: number | null,
            organization_id: number,
            name: string,
            email: string,
            status: string,
            department: string,
            designation: string,
            mec_regd_id: string,
            sso_token: string,
            role: string,
            mobile_no: number,
            locale: string,
            username: string,
            is_trainer: number,
            is_ignite_user: number,
            profile_image: string,
            language_id: number,
            english_name: string,
            is_primary_language: number,
            show_interest: number,
            category_ids: string,
            default_video_url_on_category: string,
            wp_center_id: number | null,
            wp_course_id: number | null,
            is_kyc_verifed?: number
            abc_id?: string
            aadhaar_number?: string
            profile_svc_editkey?: string
            show_course_reg?: string
            permanent_address?: string
            isPersonalEmailVerified?: number
            isPersonalPhoneVerified?: number
            isUserConsentTaken?: number
            isUserWhatsappConsentTaken?: number
            alternate_email?: string
            enrollment_number?: string
            date_of_birth?: string
            gender?: string
            father_email_verified?: number
            father_mobile_verified?: number
            mother_email_verified?: number
            mother_mobile_verified?: number
            guardian_email_verified?: number
            guardian_mobile_verified?: number
            is_interest_save?: boolean
            org_logo?: string
            org_name?: string
            user_org_type?: 'industry' | 'coe' | 'institute' | 'university'
        }
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    name: string
    email: string
    password: string
    // extra fields
    dob: string
    profilePic: string,
    first_name: string,
    last_name: string,
    gender: string,
    mobile_no: string,
    alternate_mobile_no: string,
    email_address: string,
    date_of_birth: string,
    db_code: string,
    username: string,
    locale: string,
    created_timezone: string,
    wp_center_id: number | null,
    wp_course_id: number | null,
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

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    authority?: string[]
    // api
    id: number | null,
    organization_id: number,
    name: string,
    email: string,
    status: string,
    department: string,
    designation: string,
    mec_regd_id: string,
    sso_token: string,
    role: string,
    mobile_no: number,
    locale: string,
    username: string,
    is_trainer: number,
    is_ignite_user: number,
    profile_image: string,
    language_id: number,
    english_name: string,
    is_primary_language: number,
    show_interest: number,
    category_ids: string,
    default_video_url_on_category: string,
    wp_center_id: number | null,
    wp_course_id: number | null,
    is_kyc_verifed?: number
    abc_id?: string
    aadhaar_number?: string
    profile_svc_editkey?: string
    show_course_reg?: string
    permanent_address?: string
    isPersonalEmailVerified?: number
    isPersonalPhoneVerified?: number
    isUserConsentTaken?: number
    isUserWhatsappConsentTaken?: number
    alternate_email?: string
    enrollment_number?: string
    date_of_birth?: string
    gender?: string
    father_email_verified?: number
    father_mobile_verified?: number
    mother_email_verified?: number
    mother_mobile_verified?: number
    guardian_email_verified?: number
    guardian_mobile_verified?: number
    is_interest_save?: boolean
    org_logo?: string
    org_name?: string
    user_org_type?: 'industry' | 'coe' | 'institute' | 'university'
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
