import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { AcadoLogo } from '@/components/AcadoLogo';
import authBg from '@/assets/auth-bg.png';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axios';

const ResetPassword = () => {
  console.log('🔄 ResetPassword component rendering...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    console.log('🔍 ResetPassword page loaded:', { token, email });
    // Validate that token and email exist
    if (!token || !email) {
      console.warn('⚠️ Missing token or email in URL');
      setIsInvalidLink(true);
    } else {
      console.log('✅ Token and email found in URL');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast({
        title: 'Password required',
        description: 'Please enter a new password',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords don\'t match',
        description: 'Please make sure both passwords are the same',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Call backend API to reset password
      await axiosInstance.post('/auth/reset-password', {
        token,
        email,
        password,
      });

      console.log('✅ Password reset successful');
      setIsSuccess(true);

      toast({
        title: 'Password reset successful!',
        description: 'You can now login with your new password',
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      toast({
        title: 'Failed to reset password',
        description: error?.response?.data?.error || error?.message || 'Please try again or request a new reset link',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug: Log current state
  console.log('ResetPassword render state:', {
    token: token ? 'present' : 'missing',
    email: email ? 'present' : 'missing',
    isInvalidLink,
    isSuccess,
    isSubmitting,
  });

  if (isInvalidLink) {
    console.log('⚠️ Showing invalid link message');
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <Card className="w-full max-w-md relative z-10 shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-4">
            <div className="flex justify-center mb-2">
              <AcadoLogo width={120} />
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Reset Link</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-2" />
              <p className="text-sm text-red-800 dark:text-red-200">
                This password reset link is invalid or has expired
              </p>
            </div>

            <div className="space-y-2">
              <Link to="/forgot-password" className="block">
                <Button className="w-full">
                  Request new reset link
                </Button>
              </Link>

              <Link to="/login" className="block">
                <Button variant="ghost" className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('✅ Rendering reset password form');
  
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl">
        <CardHeader className="space-y-3 text-center pb-4">
          <div className="flex justify-center mb-2">
            <AcadoLogo width={120} />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {isSuccess
              ? 'Your password has been reset successfully'
              : 'Create a new password for your account'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  Password reset successful!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Redirecting to login page...
                </p>
              </div>

              <Link to="/login" className="block">
                <Button className="w-full">
                  Go to login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" value={email || ''} autoComplete="username" style={{ display: 'none' }} readOnly />
              
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset password'
                )}
              </Button>

              <Link to="/login" className="block">
                <Button variant="ghost" className="w-full" disabled={isSubmitting}>
                  Back to login
                </Button>
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;

