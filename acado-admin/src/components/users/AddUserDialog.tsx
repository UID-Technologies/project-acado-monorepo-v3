import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserStatus, UserType, CreateUserPayload, UpdateUserPayload } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface UniversityOption {
  id: string;
  name: string;
}

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    user: (CreateUserPayload | UpdateUserPayload) & { password?: string }
  ) => Promise<void>;
  editUser?: User | null;
  universities: UniversityOption[];
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

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editUser,
  universities,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ ...defaultFormState });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (editUser) {
        setFormData({
          name: editUser.name,
          email: editUser.email,
          username: editUser.username,
          password: '',
          userType: editUser.userType,
          status: editUser.status,
          universityId: editUser.universityId || '',
          mobileNo: editUser.mobileNo || '',
          studentIdStaffId: editUser.studentIdStaffId || '',
          address: editUser.address || '',
          country: editUser.country || '',
          state: editUser.state || '',
          city: editUser.city || '',
          pinCode: editUser.pinCode || '',
          dateOfBirth: editUser.dateOfBirth || '',
          gender: editUser.gender || 'Male',
        });
      } else {
        setFormData({ ...defaultFormState });
      }
    }
  }, [open, editUser]);

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

    if (!editUser && !formData.password.trim()) {
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
        description: 'Please select a university for the user.',
        variant: 'destructive',
      });
      return;
    }

    const payload: (CreateUserPayload | UpdateUserPayload) & { password?: string } = {
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

    if (!editUser || formData.password.trim()) {
      payload.password = formData.password.trim();
    }

    try {
      setIsSubmitting(true);
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Failed to save user',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isSubmitting && onOpenChange(value)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {editUser ? 'Update the user details below.' : 'Fill in the details to create a new user.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={editUser ? 'Leave blank to keep current password' : 'Enter password'}
                  required={!editUser}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User Type</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => handleChange('userType', value)}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentIdStaffId">Student/Staff ID</Label>
                <Input
                  id="studentIdStaffId"
                  value={formData.studentIdStaffId}
                  onChange={(e) => handleChange('studentIdStaffId', e.target.value)}
                  placeholder="Enter ID"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                University <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.universityId}
                onValueChange={(value) => handleChange('universityId', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="Enter country"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Enter state"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN/ZIP Code</Label>
                <Input
                  id="pinCode"
                  value={formData.pinCode}
                  onChange={(e) => handleChange('pinCode', e.target.value)}
                  placeholder="Enter pin/zip code"
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value as 'Male' | 'Female' | 'Other')}
                  disabled={isSubmitting}
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

