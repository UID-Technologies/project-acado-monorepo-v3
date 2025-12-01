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
import { User, UserType, UserStatus, CreateUserPayload } from '@/types/user';
import { BulkImportDialog, BulkImportUserInput } from '@/components/users/BulkImportDialog';
import { ChangeRoleDialog } from '@/components/users/ChangeRoleDialog';
import { useToast } from '@/hooks/use-toast';
import { universitiesApi } from '@/api/universities.api';
import { usersApi } from '@/api/users.api';
import { emailApi } from '@/api/email.api';
import axiosInstance from '@/lib/axios';
import { extractErrorMessage } from '@/utils/errorUtils';

interface UniversityOption {
  id: string;
  name: string;
}

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<UserType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [universityFilter, setUniversityFilter] = useState<'all' | string>('all');
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
    setLoading(true);
    try {
      const response = await usersApi.getUsers({
        search: searchQuery || undefined,
        userType: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        universityId: universityFilter !== 'all' ? universityFilter : undefined,
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
  }, [universityFilter, searchQuery, statusFilter, typeFilter, toast]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    await usersApi.deleteUser(userId);
    await fetchUsers();
    toast({
      title: 'User deleted',
      description: `${user?.name || 'User'} has been deactivated.`,
      variant: 'destructive',
    });
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const nextStatus: UserStatus = user.status === 'active' ? 'inactive' : 'active';
    await usersApi.updateUser(userId, { status: nextStatus });
    await fetchUsers();

    toast({
      title: nextStatus === 'active' ? 'User activated' : 'User deactivated',
      description: `${user.name} is now ${nextStatus}.`,
    });
  };

  const handleResetPassword = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not found',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Call backend to generate reset token and send email
      await axiosInstance.post('/auth/forgot-password', {
        email: user.email.trim().toLowerCase(),
      });

      console.log('✅ Password reset email sent to:', user.email);
      toast({
        title: 'Password reset email sent',
        description: `Reset link has been sent to ${user.email}`,
      });
    } catch (error: any) {
      console.error('❌ Failed to send reset password email:', error);
      toast({
        title: 'Failed to send email',
        description: extractErrorMessage(error, 'Please try again later'),
        variant: 'destructive',
      });
    }
  };

  const handleSendCredentials = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not found',
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
        organizationName: universityName || 'ACEDO',
      });

      console.log('✅ Credentials email sent to:', user.email);
      toast({
        title: 'Credentials sent',
        description: `Login credentials have been sent to ${user.email}`,
      });
    } catch (error: any) {
      console.error('❌ Failed to send credentials email:', error);
      toast({
        title: 'Failed to send email',
        description: extractErrorMessage(error, 'Please try again later'),
        variant: 'destructive',
      });
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserType) => {
    try {
      await usersApi.updateUser(userId, { userType: newRole });
      
      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, userType: newRole } : u
        )
      );

      const user = users.find((u) => u.id === userId);
      console.log('✅ User role changed:', { userId, newRole });
      
      toast({
        title: 'Role changed',
        description: `${user?.name}'s role has been updated to ${newRole}.`,
      });
    } catch (error: any) {
      console.error('❌ Failed to change user role:', error);
      throw error; // Re-throw to be handled by dialog
    }
  };

  const openChangeRoleDialog = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUserForRole(user);
      setIsChangeRoleOpen(true);
    }
  };

  const handleBulkImport = async (importedUsers: BulkImportUserInput[]) => {
    const payloads: CreateUserPayload[] = importedUsers.map((user) => {
      const universityMatch = universities.find(
        (uni) => uni.name.toLowerCase() === (user.university || '').toLowerCase()
      );

      if (!universityMatch) {
        throw new Error(`Unknown university "${user.university || 'N/A'}" for user ${user.name}`);
      }

      return {
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
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
      };
    });

    await usersApi.bulkImportUsers(payloads);
    await fetchUsers();
    toast({
      title: 'Bulk import successful',
      description: `${payloads.length} users imported successfully.`,
    });
  };

  const filteredUsers = useMemo(() => users, [users]);

  const exportUsers = () => {
    const csv = [
      ['Name', 'Email', 'Username', 'User Type', 'Status', 'University', 'Mobile No', 'Student/Staff ID', 'Date of Birth', 'Gender'].join(','),
      ...filteredUsers.map((u) => [
        u.name,
        u.email,
        u.username,
        u.userType,
        u.status,
        u.universityName || '',
        u.mobileNo || '',
        u.studentIdStaffId || '',
        u.dateOfBirth || '',
        u.gender || '',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({
      title: 'Export successful',
      description: 'Users exported to CSV file.',
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <div className="border rounded-lg">
          <div className="p-12 text-center text-muted-foreground">
            No users found. Add your first user to get started.
          </div>
        </div>
      );
    }

    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Student/Staff ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.universityName || 'No University'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.userType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.studentIdStaffId || '-'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/users/${user.id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openChangeRoleDialog(user.id)}>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                        {user.status === 'active' ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                        <KeyRound className="h-4 w-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendCredentials(user.id)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Credentials
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage users across all universities</p>
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
        <Select value={universityFilter} onValueChange={(value) => setUniversityFilter(value as 'all' | string)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="University" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Universities</SelectItem>
            {universities.map((uni) => (
              <SelectItem key={uni.id} value={uni.id}>
                {uni.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as UserType | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="User Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Learner">Learner</SelectItem>
            <SelectItem value="Faculty">Faculty</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate('/users/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
        <Button variant="outline" onClick={() => setIsBulkImportOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Bulk Import
        </Button>
        <Button variant="outline" onClick={exportUsers}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {renderContent()}

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

export default Users;

