import { apiGoogleOauthSignIn as GoogleAuthService } from '@services/AuthService';

import type {
    googleOauthSignIn
} from '@app/types/auth'

type OAuthResponse = {
    token: string,
    user: {
        id: number,
        organization_id: number,
        name: string,
        email: string,
        department: string,
        designation: string,
        mobile_no: number,
        is_trainer: number,
        profile_image: string,
        role: string,
        avatar: string
    }
}

type OAuthResponseData = {
    status: number,
    data: OAuthResponse
    error: string
}

async function placeholderFunction(): Promise<OAuthResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                token: 'placeholder_token',
                user: {
                    id: 1,
                    name: 'Placeholder User',
                    email: 'user@example.com',
                    department: 'Placeholder Department',
                    organization_id: 1,
                    designation: 'Placeholder Designation',
                    mobile_no: 1234567890,
                    is_trainer: 0,
                    profile_image: 'https://ui-avatars.com/api/?name=Placeholder+User&background=random&color=fff',
                    role: 'Learner',
                    avatar: 'https://ui-avatars.com/api/?name=Placeholder+User&background=random&color=fff'
                }
            });
        }, 500);
    });
}

export async function apiGoogleOauthSignIn(data: googleOauthSignIn): Promise<OAuthResponse> {
    const response = (await GoogleAuthService(data)) as OAuthResponseData;
    // set authority array in user object add learner
    if (response?.data?.user) {
        response.data.user.role = 'Learner';
        // and profile_image set to avatar if not present
        if (!response.data.user.profile_image) {
            response.data.user.avatar = response?.data?.user?.profile_image;
        }
        else {
            response.data.user.avatar = 'https://ui-avatars.com/api/?name=' + response.data.user.name + '&background=random&color=fff';
        }
    }

    return {
        token: response.data.token,
        user: response.data.user,
    };
}

export async function apiGithubOauthSignIn(): Promise<OAuthResponse> {
    return await placeholderFunction();
}
