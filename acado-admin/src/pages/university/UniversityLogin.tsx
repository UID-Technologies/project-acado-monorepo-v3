import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const UniversityLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated and is admin
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user?.role?.toLowerCase();
      if (userRole === 'admin') {
        navigate('/university', { replace: true });
      } else if (userRole === 'superadmin') {
        // Superadmin should use main portal
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      
      console.log('✅ University login successful:', response);
      
      // Check if user has admin role
      const userRole = response.user?.role?.toLowerCase();
      
      if (userRole !== 'admin') {
        // User is not an admin, logout and redirect
        setError('Access denied. Only university administrators (admin role) can access this portal.');
        await logout();
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              error: 'This portal is only for university administrators. Please use the main login page.' 
            } 
          });
        }, 2000);
        return;
      }
      
      toast({
        title: "Login successful",
        description: `Welcome ${response.user.name}!`,
      });
      
      // Navigate to university dashboard
      setTimeout(() => {
        navigate('/university', { replace: true });
      }, 100);
    } catch (err: any) {
      console.error('❌ University login error:', err);
      const errorMessage = err?.response?.data?.error || 
                          err?.message || 
                          'Invalid credentials. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">University Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the university admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              <div className="font-medium mb-1">Demo Credentials:</div>
              <div>Admin: admin@example.com / admin123</div>
              <div>Editor: editor@example.com / editor123</div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UniversityLogin;