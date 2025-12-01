import appConfig from "@app/config/app.config";

export const ENVIRONMENT_TYPE: 'local' | 'live' = 'local';

export const SVC_API_BASE_URL = 'https://profiles.edulystventures.com/api';

export const SHARE_PROFILE_URL = `${appConfig.appUrl}/portfolio`;
// export const SHARE_PROFILE_URL = `http://localhost:5173/portfolio`;

const LocalKey = 'c3894d1a2d795f3c15446f87fd6768d9b98a91979e21d8b20e7cd121cd9e5926';

export const getFrontendKey = (): { FRONTEND_KEY: string | null } => {
  if (ENVIRONMENT_TYPE === 'local') {
    return { FRONTEND_KEY: LocalKey };
  } else {
    try {
      const sessionUser = localStorage.getItem('sessionUser');
      if (sessionUser) {
        const user = JSON.parse(sessionUser);
        return { FRONTEND_KEY: user?.state?.user?.FrontendOpenApiKey ?? null };
      }
    } catch (err) {
      console.error('Error parsing sessionUser from localStorage:', err);
    }
    return { FRONTEND_KEY: null };
  }
};

export const setProfileEditKey = (EditKey: string): void => {
  localStorage.setItem('editKey', EditKey);
};