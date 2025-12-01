import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Upload, Download, MoreHorizontal, Mail, KeyRound, Trash2, Edit, Power, PowerOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, UserType, UserStatus } from '@/types/user';
import { BulkImportDialog, BulkImportUserInput } from '@/components/users/BulkImportDialog';
import { ChangeRoleDialog } from '@/components/users/ChangeRoleDialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { universitiesApi } from '@/api/universities.api';
import { usersApi } from '@/api/users.api';
import { emailApi } from '@/api/email.api';
import axiosInstance from '@/lib/axios';

interface UniversityOption {
  id: string;
  name: string;
}

const UniversityUserManagement = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<UserType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get admin's university ID - automatically filter by this
  const adminUniversityId = currentUser?.universityIds?.[0];
  const adminUniversityName = currentUser?.universityName;

  const fetchUniversities = useCallback(async () => {
    try {
      const response = await universitiesApi.getUniversities();
      // Backend returns array directly
      const options = (response || []).map((uni) => ({ id: uni.id, name: uni.name }));
      setUniversities(options);
    } catch (error) {
      console.warn('Failed to load universities list for users page', error);
      setUniversities([]);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!adminUniversityId) {
      toast({
        title: 'No University Assigned',
        description: 'Your account is not associated with any university.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching users for university:', adminUniversityId);
      const response = await usersApi.getUsers({
        search: searchQuery || undefined,
        userType: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        universityId: adminUniversityId, // Always filter by admin's university
        // Removed: pageSize (pagination removed)
      });
      // Backend returns array directly
      setUsers(response || []);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      toast({
        title: 'Failed to load users',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [adminUniversityId, searchQuery, statusFilter, typeFilter, toast]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [fetchUsers, currentUser]);

  const handleDeleteUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    await usersApi.deleteUser(userId);
    await fetchUsers();
    toast({
      title: 'User Deleted',
      description: `${user?.name || 'User'} has been removed from the system.`,
    });
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    await usersApi.updateUser(user.id, { status: newStatus });
    await fetchUsers();
    toast({
      title: newStatus === 'active' ? 'User Activated' : 'User Deactivated',
      description: `${user.name || user.email} is now ${newStatus}.`,
    });
  };

  const handleResetPassword = async (user: User) => {
    try {
      await axiosInstance.post('/auth/forgot-password', { email: user.email });
      toast({
        title: 'Password Reset Email Sent',
        description: `A password reset link has been sent to ${user.email}`,
      });
    } catch (error: any) {
      console.error('Failed to send password reset email:', error);
      toast({
        title: 'Failed to send reset email',
        description: error?.response?.data?.message || 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleSendCredentials = async (user: User) => {
    if (!user.email) {
      toast({
        title: 'Email not available',
        description: 'This user does not have an email address configured.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const universityName = universities.find(u => u.id === user.universityId)?.name;
      const loginLink = `${window.location.origin}/login`;
      
      await emailApi.sendWelcome(user.email, {
        recipientName: user.name,
        loginLink,
        organizationName: universityName || adminUniversityName || 'ACEDO',
      });

      toast({
        title: 'Credentials Sent',
        description: `Login credentials have been sent to ${user.email}`,
      });
    } catch (error: any) {
      console.error('Failed to send credentials:', error);
      toast({
        title: 'Failed to send credentials',
        description: error?.response?.data?.message || 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserType) => {
    try {
      await usersApi.updateUser(userId, { userType: newRole });
      await fetchUsers();
      toast({
        title: 'Role Updated',
        description: `User role has been changed to ${newRole}.`,
      });
    } catch (error: any) {
      console.error('Failed to change user role:', error);
      throw error;
    }
  };

  const openChangeRoleDialog = (user: User) => {
    setSelectedUserForRole(user);
    setIsChangeRoleOpen(true);
  };

  const handleBulkImport = async (userDataList: BulkImportUserInput[]) => {
    if (!adminUniversityId) {
      toast({
        title: 'Import Failed',
        description: 'No university assigned to your account.',
        variant: 'destructive',
      });
      return;
    }

    const errors: string[] = [];
    const createdUsers: string[] = [];

    for (const user of userDataList) {
      const universityMatch = universities.find(
        (u) => u.name.toLowerCase() === user.universityName?.toLowerCase()
      );

      if (!universityMatch || universityMatch.id !== adminUniversityId) {
        errors.push(`Row ${userDataList.indexOf(user) + 1}: University "${user.universityName}" does not match your assigned university.`);
        continue;
      }

      try {
        await usersApi.createUser({
          name: user.name,
          email: user.email,
          username: user.username,
          password: user.password,
          userType: user.userType,
          status: user.status,
          universityId: universityMatch.id,
          universityName: universityMatch.name,
          mobileNo: user.mobileNo,
          studentIdStaffId: user.studentIdStaffId,
          address: user.address,
          country: user.country,
          state: user.state,
          city: user.city,
          pinCode: user.pinCode,
          dateOfBirth: user.dateOfBirth || undefined,
          gender: user.gender || undefined,
        });
        createdUsers.push(user.email);
      } catch (error: any) {
        errors.push(`Row ${userDataList.indexOf(user) + 1}: ${error.response?.data?.error || error.message}`);
      }
    }

    await fetchUsers();

    if (errors.length > 0) {
      toast({
        title: 'Bulk Import Completed with Errors',
        description: `${createdUsers.length} users created. ${errors.length} errors. Check console for details.`,
        variant: 'default',
      });
      console.error('Bulk import errors:', errors);
    } else {
      toast({
        title: 'Bulk Import Successful',
        description: `Successfully created ${createdUsers.length} users.`,
      });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || user.userType === typeFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [users, searchQuery, typeFilter, statusFilter]);

  const getRoleBadgeVariant = (userType: UserType) => {
    switch (userType) {
      case 'Learner':
        return 'default';
      case 'Faculty':
        return 'secondary';
      case 'Staff':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users for {adminUniversityName || 'your university'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBulkImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button onClick={() => navigate('/university/users/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as UserType | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Learner">Learner</SelectItem>
            <SelectItem value="Faculty">Faculty</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.userType)}>
                      {user.userType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/users/${user.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openChangeRoleDialog(user)}>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                          {user.status === 'active' ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendCredentials(user)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Credentials
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BulkImportDialog
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onImport={handleBulkImport}
      />

      <ChangeRoleDialog
        open={isChangeRoleOpen}
        onOpenChange={setIsChangeRoleOpen}
        user={selectedUserForRole}
        onConfirm={handleChangeRole}
      />
    </div>
  );
};

export default UniversityUserManagement;
