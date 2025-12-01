import Button from '@/components/ui/Button'
import { useAuth } from '@app/providers/auth'
import { useGoogleLogin } from '@react-oauth/google'
import appConfig from '@app/config/app.config'
import React, { useState } from 'react'
import type {
    googleOauthSignIn
} from '@app/types/auth'
import {
    apiGoogleOauthSignIn,
    apiGithubOauthSignIn,
} from '@services/OAuthServices'
import { setProfileEditKey } from '@features/app/common/profile-view/config'


type OauthSignInProps = {
    setMessage?: (message: string) => void
    disableSubmit?: boolean
}

const OauthSignIn = ({ setMessage, disableSubmit }: OauthSignInProps) => {
    const { oAuthSignIn } = useAuth()

    const [isSubmitting, setIsSubmitting] = useState(false)

    // const handleGoogleSignIn = async () => {
    //     if (!disableSubmit) {
    //         oAuthSignIn(async ({ redirect, onSignIn }) => {
    //             try {
    //                 const resp = await apiGoogleOauthSignIn()
    //                 if (resp) {
    //                     const { token, user } = resp
    //                     onSignIn({ accessToken: token }, user)
    //                     redirect()
    //                 }
    //             } catch (error) {
    //                 setMessage?.((error as string)?.toString() || '')
    //             }
    //         })
    //     }
    // }


    const handleSignIn = useGoogleLogin({
        flow: 'auth-code',
        scope: 'openid profile email',
        onSuccess: (codeResponse) => {
            console.log("sucess", codeResponse)
            const authCode = codeResponse.code;
            fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    code: authCode,
                    client_id: appConfig.googleAuth.clientId,
                    client_secret: appConfig.googleAuth.clientSecret,
                    redirect_uri: appConfig.googleAuth.redirectUri,
                    grant_type: 'authorization_code',
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch access token');
                        setIsSubmitting(false);
                    }
                    return response.json();
                })
                .then(async (tokenData) => {
                    const accessToken = tokenData.access_token; // Scope Acess token
                    const loginToken = tokenData.id_token; // Login token 
                    console.log('Access Token:', accessToken);
                    try {
                        const data = {
                            token: loginToken
                        }
                        oAuthSignIn(async ({ redirect, onSignIn }) => {
                            try {
                                const resp = await apiGoogleOauthSignIn(data)
                                if (resp) {
                                    const { token, user } = resp
                                    onSignIn({ accessToken: token }, user)
                                    setProfileEditKey(resp?.user?.profile_svc_editkey ?? '')
                                    redirect();
                                    setIsSubmitting(false);
                                }
                            } catch (error) {
                                setMessage?.((error as string)?.toString() || '')
                            }
                        })
                    } catch (error) {
                        setMessage?.((error as string)?.toString() || '')
                        setIsSubmitting(false);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching access token:', error);
                    setIsSubmitting(false);
                });
        },
        onError: (error) => {
            console.error('Login Failed:', error);
            setIsSubmitting(false);
        },
    });


    return (
        <div className="flex items-center gap-2">
            <Button
                className="flex-1"
                type="button"
                onClick={() => {
                    handleSignIn(),
                        setIsSubmitting(true)
                }}
                loading={isSubmitting}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px]"
                        src="/img/others/google.png"
                        alt="Google sign in"
                    />
                    <span>Google</span>
                </div>
            </Button>
            {/* <Button
                className="flex-1"
                type="button"
                onClick={handleGithubSignIn}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px]"
                        src="/img/others/github.png"
                        alt="Google sign in"
                    />
                    <span>Github</span>
                </div>
            </Button> */}
        </div>
    )
}

export default OauthSignIn
