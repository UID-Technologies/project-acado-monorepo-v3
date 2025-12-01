type EnvConfig = {
    apiBaseUrl: string
    appUrl: string
    debug: boolean
    enableMock: boolean
    googleAuth: {
        clientId: string
        clientSecret: string
        redirectUri: string
    }
    firebase: {
        apiKey: string
        authDomain: string
        projectId: string
        storageBucket: string
        messagingSenderId: string
        appId: string
        measurementId: string
    }
}

const fallbackOrigin =
    typeof window !== 'undefined' && window.location ? window.location.origin : ''

const envConfig: EnvConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://elms.edulystventures.com',
    appUrl: import.meta.env.VITE_APP_URL ?? fallbackOrigin,
    debug: (import.meta.env.VITE_APP_DEBUG ?? 'true') === 'true',
    enableMock: (import.meta.env.VITE_ENABLE_MOCK ?? 'false') === 'true',
    googleAuth: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
        clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET ?? '',
        redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI ?? fallbackOrigin,
    },
    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
        appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
    },
}

export default envConfig

