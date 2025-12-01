/**
 * Login Component with SSO Support
 * 
 * This component supports two authentication methods:
 * 1. SSO Auto-Login: Receives token and user data from SSO app via URL parameter
 * 2. Standard Login: Email/password form (can be disabled for SSO-only mode)
 * 
 * SSO Flow:
 * - SSO app redirects to: /login?auth={base64EncodedAuthData}
 * - Auth data format: { token: string, user: { id, email, name, role, ... } }
 * - Token is stored in localStorage and used for all API requests
 * 
 * To enable SSO-only mode:
 * - Set ENABLE_STANDARD_LOGIN = false
 * - This will hide the email/password form and only allow SSO login
 */

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AcadoLogo } from "@/components/AcadoLogo";
import authBg from "@/assets/auth-bg.png";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { setAccessToken } from "@/lib/tokenManager";
import { normalizeUser, type User } from "@/api/auth.api";

// Configuration: Set to false to disable standard login and enable SSO-only mode
const ENABLE_STANDARD_LOGIN = true;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, loginWithSSO, isAuthenticated, user } = useAuth();

  // SSO Auto-Login: Check for auth parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const authParam = searchParams.get('auth');
    
    if (authParam && !isAuthenticated) {
      handleSSOLogin(authParam);
    }
  }, [location.search]);

  // Handle SSO authentication
  const handleSSOLogin = async (encodedAuth: string) => {
    setSsoLoading(true);
    
    try {
      console.log('🔐 Processing SSO authentication...');
      
      // Decode the authentication data
      const decodedAuth = decodeURIComponent(atob(encodedAuth));
      const authData = JSON.parse(decodedAuth);
      
      console.log('✅ SSO auth data decoded:', authData);
      
      // Extract token and user data
      const { token, user: ssoUser } = authData;
      
      if (!token || !ssoUser) {
        throw new Error('Invalid SSO authentication data');
      }
      
      // Normalize SSO user data to match our User interface
      const normalizedUser: User = {
        id: String(ssoUser.id || ssoUser.organization_id || ''),
        email: ssoUser.email || '',
        name: ssoUser.name || '',
        username: ssoUser.email?.split('@')[0] || '',
        role: (ssoUser.role || 'learner') as any,
        userType: 'Admin' as any,
        isActive: ssoUser.status === 'active',
        organizationId: String(ssoUser.organization_id || ''),
        organizationName: ssoUser.organization_name || '',
        roles: ssoUser.user_roles || [ssoUser.role],
        universityIds: [],
        courseIds: []
      };
      
      console.log('✅ SSO user data normalized:', normalizedUser);
      
      // Update authentication state via AuthProvider
      loginWithSSO(token, normalizedUser);
      
      // Show success toast
      toast({
        title: "SSO Login Successful",
        description: `Welcome ${normalizedUser.name}! Role: ${normalizedUser.role}`,
      });
      
      // Redirect based on role to appropriate dashboard
      const userRole = normalizedUser.role?.toLowerCase();
      let redirectPath = '/';
      
      if (userRole === 'admin') {
        redirectPath = '/university/dashboard';  // University Admin Dashboard
      } else if (userRole === 'superadmin') {
        redirectPath = '/';  // SuperAdmin Dashboard (root path)
      } else if (userRole === 'learner') {
        redirectPath = '/user/dashboard';  // Student/Learner Dashboard
      } else {
        // Default to home/dashboard for unknown roles
        redirectPath = '/';
      }
      
      console.log(`✅ Redirecting to dashboard: ${redirectPath} for role: ${userRole}`);
      
      // Navigate to appropriate dashboard using React Router
      // This maintains the SPA experience and allows the auth state to work properly
      navigate(redirectPath, { replace: true });
      
    } catch (error) {
      console.error('❌ SSO login error:', error);
      
      toast({
        title: "SSO Login Failed",
        description: error instanceof Error ? error.message : "Failed to process SSO authentication",
        variant: "destructive",
      });
      
      // Remove failed auth parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      setSsoLoading(false);
    }
  };

  // Redirect if already authenticated (normal login flow)
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user?.role?.toLowerCase();
      
      let redirectPath = '/';
      if (userRole === 'admin') {
        redirectPath = '/university/dashboard';  // University Admin Dashboard
      } else if (userRole === 'superadmin') {
        redirectPath = '/';  // SuperAdmin Dashboard
      } else if (userRole === 'learner') {
        redirectPath = '/user/dashboard';  // Student/Learner Dashboard
      } else {
        redirectPath = (location.state as any)?.from || '/';
      }
      
      console.log(`🔄 Already authenticated, redirecting to: ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.name}! Role: ${response.user.role}`,
      });

      // Navigate to dashboard based on role
      // Superadmin -> / (SuperAdmin Dashboard)
      // Admin -> /university/dashboard (University Admin Dashboard)
      // Learner -> /user/dashboard (Student/Learner Dashboard)
      const userRole = response.user.role?.toLowerCase();
      let redirectPath = '/';
      
      if (userRole === 'admin') {
        redirectPath = '/university/dashboard';
      } else if (userRole === 'superadmin') {
        redirectPath = '/';
      } else if (userRole === 'learner') {
        redirectPath = '/user/dashboard';
      } else {
        // For other roles, use the return URL or default to /
        redirectPath = (location.state as any)?.from || '/';
      }
      
      console.log(`✅ Login successful, redirecting to dashboard: ${redirectPath}`);
      
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          "Invalid email or password";
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Google Sign-In",
      description: "Google authentication requires Supabase integration",
    });
  };

  // Show loading screen during SSO authentication
  if (ssoLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur border-border/50 p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Authenticating via SSO...</h2>
            <p className="text-muted-foreground text-center">
              Please wait while we securely log you in.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Auth form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-8 py-6">
          <Link to="/" className="inline-block">
            <AcadoLogo className="h-8" />
          </Link>
        </header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-8">
          <Card className="w-full max-w-md bg-card/50 backdrop-blur border-border/50 p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
                <p className="text-muted-foreground mt-2">
                  Please enter your credentials to sign in!
                </p>
              </div>

              {ENABLE_STANDARD_LOGIN ? (
                <>
                  {/* Standard Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-background/50 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:text-primary-hover transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      variant="gradient"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account yet?{" "}
                    <Link to="/signup" className="text-primary hover:text-primary-hover transition-colors font-medium">
                      Sign up
                    </Link>
                  </p>
                </>
              ) : (
                /* SSO-Only Mode */
                <div className="text-center space-y-4 py-8">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">SSO Login Required</h2>
                  <p className="text-muted-foreground">
                    Please use the SSO portal to log in to this application.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = import.meta.env.VITE_SSO_URL || 'http://localhost:3000'}
                  >
                    Go to SSO Portal
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:block lg:w-1/2 relative bg-card">
        <img
          src={authBg}
          alt="Education illustration"
          className="absolute inset-0 h-full w-full object-contain p-12"
        />
      </div>
    </div>
  );
};

export default Login;