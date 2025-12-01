import envConfig from './env.config'

export type AppConfig = {
    appUrl?: string
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
    enableMock: boolean
    debug?: boolean
    errorMessages?: {
        default: string
        networkError: string
        unauthorized: string
        forbidden: string
        notFound: string
        internalServerError: string
        badRequest: string
    },
    googleAuth: {
        clientId: string,
        clientSecret: string,
        redirectUri: string
    },
    content: {
        pdf: {
            watermark: {
                show: boolean;
                items: Array<{
                    text: string;
                    style?: React.CSSProperties;
                }>;
            };
        }
    }
}

const appConfig: AppConfig = {
    appUrl: envConfig.appUrl,
    apiPrefix: '/api',
    authenticatedEntryPath: '/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    accessTokenPersistStrategy: 'cookies',
    enableMock: envConfig.enableMock,
    debug: envConfig.debug,
    errorMessages: {
        default: 'Something went wrong, Please try again later',
        networkError: 'Network Error',
        unauthorized: 'Unauthorized',
        forbidden: 'Forbidden',
        notFound: 'Not Found',
        internalServerError: 'Internal Server Error, Please try again later',
        badRequest: 'Bad Request',
    },
    googleAuth: envConfig.googleAuth,
    content: {
        pdf: {
            watermark: {
                show: true,
                items: [{
                    text: 'Acado',
                    style: {
                        color: 'rgba(0, 0, 0, 0.03)',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        transform: 'rotate(-45deg)',
                        userSelect: 'none',
                    }
                },
                {
                    text: 'This PDF is for educational purposes only and<br/> should not be used for any unauthorized or illegal activities.',
                    style: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        fontSize: `10px`,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        userSelect: 'none',
                        position: 'absolute',
                        bottom: '10px',
                        textAlign: 'center',
                        width: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }
                },
                ],
            }
        }
    }
}
export default appConfig
