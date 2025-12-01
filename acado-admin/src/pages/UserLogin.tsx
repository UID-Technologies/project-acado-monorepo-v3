import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AcadoLogo } from "@/components/AcadoLogo";
import { useAuth } from "@/hooks/useAuth";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAutoLoggingIn && isAuthenticated && user?.role === "learner") {
      const from = (location.state as any)?.from || "/user/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAutoLoggingIn, user, navigate, location]);

  // Check for auto-login with encrypted token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    const formIdParam = urlParams.get('formId');
    
    if (authParam) {
      setIsAutoLoggingIn(true);
      
      try {
        // Decode the authentication data
        const decodedJson = decodeURIComponent(atob(authParam));
        const authData = JSON.parse(decodedJson);

        // Ensure we have an SSO-style JWT for API auth (backend accepts decoded JWT with sub/exp)
        if (!authData.sso_token) {
          const header = { alg: 'HS256', typ: 'JWT' };
          const now = Math.floor(Date.now() / 1000);
          const payload = {
            sub: authData.user?.id || authData.userId || authData.email || 'learner',
            email: authData.user?.email || authData.email,
            iss: 'sso-mock',
            iat: now,
            exp: now + 60 * 60 * 24, // 24h
          };
          const base64url = (obj: any) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
          const token = `${base64url(header)}.${base64url(payload)}.dummy-signature`;
          authData.sso_token = token;
        }
        
        // Store in localStorage (userAuth format for learner/user)
        localStorage.setItem("userAuth", JSON.stringify(authData));
        // Also set token for APIs that read from token
        if (authData.token) {
          localStorage.setItem('token', authData.token);
        } else if (authData.sso_token) {
          localStorage.setItem('token', authData.sso_token);
        }
        
        console.log('✅ User auto-login successful:', {
          name: authData.name,
          email: authData.email,
          role: authData.role,
          universityName: authData.universityName ?? authData.organizationName ?? authData.organization_name,
          formId: formIdParam
        });
        
        toast({
          title: "Auto-Login Successful",
          description: `Welcome, ${authData.name || authData.email}!`,
        });
        
        // Clean URL and redirect
        window.history.replaceState({}, document.title, '/user/login');
        
        // Redirect to application form if formId is provided, otherwise dashboard
        setTimeout(() => {
          if (formIdParam) {
            window.location.href = `/user/apply/${formIdParam}`;
          } else {
            window.location.href = '/user/dashboard';
          }
        }, 800);
        
        return;
      } catch (error) {
        console.error('❌ Error processing auto-login:', error);
        setIsAutoLoggingIn(false);
        toast({
          title: "Auto-Login Failed",
          description: "Invalid authentication data. Please login manually.",
          variant: "destructive",
        });
        // Clean the URL
        window.history.replaceState({}, document.title, '/user/login');
      }
    }
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await login(email.trim(), password);

      if (session.user.role !== "learner") {
        toast({
          title: "Access Restricted",
          description: "Please use the admin login for this account.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your learner account.",
      });

      const from = (location.state as any)?.from || "/user/dashboard";
      setTimeout(() => navigate(from, { replace: true }), 150);
    } catch (error: any) {
      console.error("Learner login failed", error);
      toast({
        title: "Login Failed",
        description:
          error?.response?.data?.error || error?.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading screen during auto-login
  if (isAutoLoggingIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Logging you in...</h2>
          <p className="text-muted-foreground">Please wait while we authenticate your session</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/src/assets/auth-bg.png')`,
      }}
    >
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <AcadoLogo />
          </div>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to your account to continue your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link to="/user/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                Admin login
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Don't have an account?{" "}
            <Link to="/user/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserLogin;