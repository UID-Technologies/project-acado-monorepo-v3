import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usersApi } from '@/api/users.api';
import { emailApi } from '@/api/email.api';
import { CreateUserPayload, UserStatus, UserType } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const defaultFormState = {
  name: '',
  email: '',
  username: '',
  password: '',
  userType: 'Learner' as UserType,
  status: 'active' as UserStatus,
  mobileNo: '',
  studentIdStaffId: '',
  address: '',
  country: '',
  state: '',
  city: '',
  pinCode: '',
  dateOfBirth: '',
  gender: 'Male' as 'Male' | 'Female' | 'Other',
};

const UniversityAddUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({ ...defaultFormState });
  const [saving, setSaving] = useState(false);

  // Get admin's university info
  const adminUniversityId = currentUser?.universityIds?.[0];
  const adminUniversityName = currentUser?.universityName;

  useEffect(() => {
    if (!adminUniversityId) {
      toast({
        title: 'No University Assigned',
        description: 'Your account is not associated with any university.',
        variant: 'destructive',
      });
      navigate('/university/users');
    }
  }, [adminUniversityId, navigate, toast]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminUniversityId || !adminUniversityName) {
      toast({
        title: 'Error',
        description: 'No university assigned to your account.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.username.trim()) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in name, email, and username.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const createPayload: CreateUserPayload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim(),
        password: formData.password,
        userType: formData.userType,
        status: formData.status,
        universityId: adminUniversityId, // Auto-set to admin's university
        universityName: adminUniversityName,
        mobileNo: formData.mobileNo.trim() || undefined,
        studentIdStaffId: formData.studentIdStaffId.trim() || undefined,
        address: formData.address.trim() || undefined,
        country: formData.country.trim() || undefined,
        state: formData.state.trim() || undefined,
        city: formData.city.trim() || undefined,
        pinCode: formData.pinCode.trim() || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
      };

      console.log('Creating user:', createPayload);
      const newUser = await usersApi.createUser(createPayload);

      // Send welcome email
      try {
        await emailApi.sendWelcome(formData.email, {
          recipientName: formData.name,
          loginLink: `${window.location.origin}/login`,
          organizationName: adminUniversityName,
        });
        console.log('✅ Welcome email sent to:', formData.email);
      } catch (emailError: any) {
        console.error('❌ Failed to send welcome email:', emailError);
        toast({
          title: 'User Created (Email Warning)',
          description: 'User created successfully, but welcome email failed to send.',
          variant: 'default',
        });
      }

      toast({
        title: 'User Created',
        description: `${formData.name} has been successfully added.`,
      });

      navigate('/university/users');
    } catch (error: any) {
      console.error('Failed to create user:', error);
      toast({
        title: 'Failed to create user',
        description: error?.response?.data?.error || error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!adminUniversityId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/university/users')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
          <p className="text-muted-foreground mt-1">
            Create a new user for {adminUniversityName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              All users will be automatically assigned to {adminUniversityName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="johndoe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">
                  User Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value: UserType) => handleChange('userType', value)}
                >
                  <SelectTrigger id="userType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Learner">Learner</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: UserStatus) => handleChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mobileNo">Mobile Number</Label>
                  <Input
                    id="mobileNo"
                    value={formData.mobileNo}
                    onChange={(e) => handleChange('mobileNo', e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentIdStaffId">Student/Staff ID</Label>
                  <Input
                    id="studentIdStaffId"
                    value={formData.studentIdStaffId}
                    onChange={(e) => handleChange('studentIdStaffId', e.target.value)}
                    placeholder="ID12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: 'Male' | 'Female' | 'Other') => handleChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pinCode">PIN/Zip Code</Label>
                  <Input
                    id="pinCode"
                    value={formData.pinCode}
                    onChange={(e) => handleChange('pinCode', e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/university/users')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default UniversityAddUser;

