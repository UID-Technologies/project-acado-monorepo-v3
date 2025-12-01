import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserType } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: (userId: string, newRole: UserType) => Promise<void>;
}

const roleDescriptions: Record<UserType, string> = {
  Learner: 'Students or individuals taking courses',
  Faculty: 'Teaching staff and professors',
  Staff: 'Administrative and support staff',
  Admin: 'Administrative users with management privileges',
};

const roleColors: Record<UserType, string> = {
  Learner: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Faculty: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Staff: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Admin: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

export const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({
  open,
  onOpenChange,
  user,
  onConfirm,
}) => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserType>('Learner');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && open) {
      setSelectedRole(user.userType);
    }
  }, [user, open]);

  const handleConfirm = async () => {
    if (!user) return;

    if (selectedRole === user.userType) {
      toast({
        title: 'No changes',
        description: 'The selected role is the same as the current role.',
        variant: 'default',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(user.id, selectedRole);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Failed to change role',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const allRoles: UserType[] = ['Learner', 'Faculty', 'Staff', 'Admin'];

  return (
    <Dialog open={open} onOpenChange={(value) => !isSubmitting && onOpenChange(value)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Change User Role
          </DialogTitle>
          <DialogDescription>
            Modify the role for <strong>{user.name}</strong>. This will affect their permissions and access level.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Role */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Role</Label>
            <div className="flex items-center gap-2">
              <Badge className={roleColors[user.userType]}>
                {user.userType}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {roleDescriptions[user.userType]}
              </span>
            </div>
          </div>

          {/* User Details */}
          <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
            <div className="text-sm">
              <span className="text-muted-foreground">Email:</span>{' '}
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Username:</span>{' '}
              <span className="font-medium">{user.username}</span>
            </div>
            {user.universityName && (
              <div className="text-sm">
                <span className="text-muted-foreground">University:</span>{' '}
                <span className="font-medium">{user.universityName}</span>
              </div>
            )}
          </div>

          {/* New Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">New Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserType)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{role}</span>
                      <span className="text-xs text-muted-foreground ml-4">
                        {roleDescriptions[role]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole !== user.userType && (
              <div className="flex items-start gap-2 mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Changing to <strong>{selectedRole}</strong> will update the user's access permissions immediately.
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || selectedRole === user.userType}
          >
            {isSubmitting ? 'Updating...' : 'Change Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

