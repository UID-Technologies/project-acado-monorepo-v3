const ACCESS_TOKEN_STORAGE_KEY = 'acado_access_token';

const readStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

const persistToken = (token: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors (e.g., private mode)
  }
};

let accessTokenValue: string | null = readStoredToken();

type TokenListener = (token: string | null) => void;

const listeners = new Set<TokenListener>();

export const getAccessToken = () => accessTokenValue ?? null;

export const setAccessToken = (token: string | null) => {
  accessTokenValue = token;
  persistToken(token);
  listeners.forEach((listener) => listener(accessTokenValue));
};

export const clearAccessToken = () => {
  setAccessToken(null);
};

export const subscribeToAccessToken = (listener: TokenListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};


