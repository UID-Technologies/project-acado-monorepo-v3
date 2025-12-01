import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  authApi,
  type AuthResponse,
  type RegisterData,
  type User,
} from "@/api/auth.api";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  subscribeToAccessToken,
} from "@/lib/tokenManager";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (payload: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthResponse | null>;
  loginWithSSO: (token: string, user: User) => void;
  hasRole: (roles: string | string[]) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isLearner: () => boolean;
  canCreate: () => boolean;
  canDelete: () => boolean;
  canPublish: () => boolean;
  switchRole: (role: "superadmin" | "admin" | "learner") => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted;
};

const persistUser = (user: User | null) => {
  if (user) {
    window.localStorage.setItem("user", JSON.stringify(user));
    if (user.role === "learner") {
      const universityId = user.universityId ?? user.organizationId ?? null;
      const universityName = user.universityName ?? user.organizationName ?? undefined;

      window.localStorage.setItem(
        "userAuth",
        JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
          universityId,
          universityName,
        })
      );
    } else {
      window.localStorage.removeItem("userAuth");
    }
  } else {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("userAuth");
  }
};

const useSessionInitializer = (
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void
) => {
  const mounted = useIsMounted();

  return useCallback(async () => {
    try {
      // Check if we have SSO credentials in localStorage
      const storedUser = window.localStorage.getItem('user');
      const storedToken = getAccessToken();
      
      if (storedUser && storedToken) {
        // We have stored credentials from SSO, use them directly
        if (!mounted) return null;
        
        const user = JSON.parse(storedUser) as User;
        setUser(user);
        console.log('✅ Restored SSO session from localStorage:', { 
          email: user.email, 
          role: user.role 
        });
        
        if (mounted) {
          setLoading(false);
        }
        
        return { accessToken: storedToken, user };
      }
      
      // No stored credentials, user needs to login via SSO
      if (mounted) {
        setUser(null);
        setLoading(false);
      }
      return null;
    } catch (error) {
      console.error('❌ Session initialization error:', error);
      clearAccessToken();
      if (mounted) {
        setUser(null);
        persistUser(null);
        setLoading(false);
      }
      return null;
    }
  }, [mounted, setLoading, setUser]);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessTokenState] = useState<string | null>(getAccessToken());

  useEffect(() => {
    const unsubscribe = subscribeToAccessToken(setAccessTokenState);
    return unsubscribe;
  }, []);

  const initialize = useSessionInitializer(setUser, setLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await authApi.login({ email, password });
      if (session.accessToken) {
        setAccessToken(session.accessToken);
      }
      setUser(session.user);
      persistUser(session.user);
      return session;
    },
    []
  );

  const register = useCallback(
    async (payload: RegisterData) => {
      const session = await authApi.register(payload);
      if (session.accessToken) {
        setAccessToken(session.accessToken);
      }
      setUser(session.user);
      persistUser(session.user);
      return session;
    },
    []
  );

  // Refresh is not used with SSO - tokens come directly from SSO app
  const refresh = useCallback(async () => {
    console.log('⚠️ Refresh not available with SSO auth');
    return null;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAccessToken();
      setUser(null);
      persistUser(null);
      navigate("/login", {
        replace: true,
        state: { from: location },
      });
    }
  }, [location, navigate]);

  const hasRole = useCallback(
    (roles: string | string[]) => {
      if (!user) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      const userRoles = (user.roles ?? [user.role]).map((role) => role.toLowerCase());
      return roleArray.some((role) => userRoles.includes(role.toLowerCase()));
    },
    [user]
  );

  const isSuperAdmin = useCallback(() => user?.role === "superadmin", [user]);
  const isAdmin = useCallback(() => user?.role === "admin", [user]);
  const isLearner = useCallback(() => user?.role === "learner", [user]);

  const canCreate = useCallback(() => {
    const role = user?.role;
    return role === "superadmin" || role === "admin";
  }, [user]);

  const canDelete = useCallback(() => {
    const role = user?.role;
    return role === "superadmin" || role === "admin";
  }, [user]);

  const canPublish = useCallback(() => {
    const role = user?.role;
    return role === "superadmin" || role === "admin";
  }, [user]);

  const switchRole = useCallback(
    (role: "superadmin" | "admin" | "learner") => {
      if (!user) return;
      const updatedRoles = Array.from(new Set([role, ...(user.roles ?? [user.role])]));
      setUser({
        ...user,
        role,
        roles: updatedRoles,
      });
    },
    [user]
  );

  const loginWithSSO = useCallback(
    (token: string, ssoUser: User) => {
      // Store token in token manager
      setAccessToken(token);
      
      // Update user state
      setUser(ssoUser);
      
      // Persist user data
      persistUser(ssoUser);
      
      console.log('✅ SSO authentication state updated:', { 
        user: ssoUser.email, 
        role: ssoUser.role,
        hasToken: !!token 
      });
    },
    []
  );

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      refresh,
      loginWithSSO,
      hasRole,
      isSuperAdmin,
      isAdmin,
      isLearner,
      canCreate,
      canDelete,
      canPublish,
      switchRole,
    }),
    [
      accessToken,
      canCreate,
      canDelete,
      canPublish,
      hasRole,
      isAdmin,
      isLearner,
      isSuperAdmin,
      loading,
      login,
      loginWithSSO,
      logout,
      refresh,
      register,
      switchRole,
      user,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

