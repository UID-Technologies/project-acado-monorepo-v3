import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usersApi } from '@/api/users.api';
import { universitiesApi } from '@/api/universities.api';
import { emailApi } from '@/api/email.api';
import { CreateUserPayload, UpdateUserPayload, UserStatus, UserType, User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface UniversityOption {
  id: string;
  name: string;
}

const defaultFormState = {
  name: '',
  email: '',
  username: '',
  password: '',
  userType: 'Learner' as UserType,
  status: 'active' as UserStatus,
  universityId: '',
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

const AddEditUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEditMode = Boolean(userId);
  const { toast } = useToast();

  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [formData, setFormData] = useState({ ...defaultFormState });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const uniResponse = await universitiesApi.getUniversities();
        if (!isMounted) return;
        // Backend returns array directly
        setUniversities((uniResponse || []).map((uni) => ({ id: uni.id, name: uni.name })));
      } catch (error: any) {
        console.error('Failed to load universities for user form:', error);
        if (isMounted) {
          setUniversities([]);
          toast({
            title: 'Unable to load universities',
            description: extractErrorMessage(error, 'Please try again later.'),
          });
        }
      }

      if (isEditMode && userId) {
        try {
          const existingUser = await usersApi.getUser(userId);
          if (!isMounted) return;
          setUser(existingUser);
          setFormData({
            name: existingUser.name,
            email: existingUser.email,
            username: existingUser.username,
            password: '',
            userType: existingUser.userType,
            status: existingUser.status,
            universityId: existingUser.universityId || '',
            mobileNo: existingUser.mobileNo || '',
            studentIdStaffId: existingUser.studentIdStaffId || '',
            address: existingUser.address || '',
            country: existingUser.country || '',
            state: existingUser.state || '',
            city: existingUser.city || '',
            pinCode: existingUser.pinCode || '',
            dateOfBirth: existingUser.dateOfBirth || '',
            gender: existingUser.gender || 'Male',
          });
        } catch (error: any) {
          console.error('Failed to load user for editing:', error);
          if (isMounted) {
            toast({
              title: 'Failed to load user',
              description: error?.message || 'Returning to user list.',
              variant: 'destructive',
            });
            navigate('/users');
            return;
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isEditMode, navigate, toast, userId]);

  const mergedUniversities = useMemo(() => {
    if (!isEditMode || !user || !user.universityId) {
      return universities;
    }

    const exists = universities.some((uni) => uni.id === user.universityId);
    if (exists) {
      return universities;
    }

    return [
      ...universities,
      {
        id: user.universityId,
        name: user.universityName || user.university || 'University',
      },
    ];
  }, [isEditMode, universities, user]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Name is required',
        description: 'Please enter the user name.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Email is required',
        description: 'Please enter the user email.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.username.trim()) {
      toast({
        title: 'Username is required',
        description: 'Please enter the username.',
        variant: 'destructive',
      });
      return;
    }

    if (!isEditMode && !formData.password.trim()) {
      toast({
        title: 'Password is required',
        description: 'Please set a password for the user.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.universityId.trim()) {
      toast({
        title: 'University is required',
        description: 'Please assign the user to a university.',
        variant: 'destructive',
      });
      return;
    }

    const payloadBase: Partial<CreateUserPayload & UpdateUserPayload> = {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      userType: formData.userType,
      status: formData.status,
      universityId: formData.universityId,
      mobileNo: formData.mobileNo || undefined,
      studentIdStaffId: formData.studentIdStaffId || undefined,
      address: formData.address || undefined,
      country: formData.country || undefined,
      state: formData.state || undefined,
      city: formData.city || undefined,
      pinCode: formData.pinCode || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender || undefined,
    };

    try {
      setSaving(true);
      if (isEditMode && userId) {
        const updatePayload: UpdateUserPayload = { ...payloadBase };
        if (formData.password.trim()) {
          updatePayload.password = formData.password.trim();
        }
        await usersApi.updateUser(userId, updatePayload);
        toast({
          title: 'User updated',
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        const createPayload: CreateUserPayload = {
          ...(payloadBase as CreateUserPayload),
          password: formData.password.trim(),
        };
        const newUser = await usersApi.createUser(createPayload);
        
        // Send welcome email to the new user
        try {
          const universityName = universities.find(u => u.id === formData.universityId)?.name;
          await emailApi.sendWelcome(formData.email, {
            recipientName: formData.name,
            loginLink: `${window.location.origin}/login`,
            organizationName: universityName || 'ACEDO',
          });
          console.log('✅ Welcome email sent to:', formData.email);
        } catch (emailError: any) {
          console.error('❌ Failed to send welcome email:', emailError);
          // Don't fail user creation if email fails
          toast({
            title: 'User added (Email warning)',
            description: `User created successfully, but welcome email failed to send.`,
            variant: 'default',
          });
        }
        
        toast({
          title: 'User added',
          description: `${formData.name} has been added successfully.`,
        });
      }

      navigate('/users');
    } catch (error: any) {
      console.error('Failed to save user:', error);
      toast({
        title: 'Failed to save user',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">{isEditMode ? 'Loading user...' : 'Preparing form...'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')} disabled={saving}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isEditMode ? 'Edit User' : 'Add New User'}</h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? 'Update user information and access.' : 'Fill in the details to create a new user account.'}
            </p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => document.getElementById('user-form-submit')?.click()} disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save User'}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Enter username"
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={isEditMode ? 'Leave blank to keep current password' : 'Enter password'}
                  required={!isEditMode}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User Type</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => handleChange('userType', value)}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Learner">Learner</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile Number</Label>
                <Input
                  id="mobileNo"
                  value={formData.mobileNo}
                  onChange={(e) => handleChange('mobileNo', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentIdStaffId">Student/Staff ID</Label>
                <Input
                  id="studentIdStaffId"
                  value={formData.studentIdStaffId}
                  onChange={(e) => handleChange('studentIdStaffId', e.target.value)}
                  placeholder="Enter ID"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  University <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.universityId}
                  onValueChange={(value) => handleChange('universityId', value)}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {mergedUniversities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="Enter country"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Enter state"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter city"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN/ZIP Code</Label>
                <Input
                  id="pinCode"
                  value={formData.pinCode}
                  onChange={(e) => handleChange('pinCode', e.target.value)}
                  placeholder="Enter pin/zip code"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter address"
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value as 'Male' | 'Female' | 'Other')}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <button id="user-form-submit" type="submit" className="hidden" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditUser;
