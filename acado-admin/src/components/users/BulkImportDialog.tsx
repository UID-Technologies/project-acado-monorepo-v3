import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UserStatus, UserType } from '@/types/user';

export interface BulkImportUserInput {
  name: string;
  email: string;
  username: string;
  password: string;
  userType: UserType;
  status: UserStatus;
  university?: string;
  mobileNo?: string;
  studentIdStaffId?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (users: BulkImportUserInput[]) => Promise<void>;
}

export const BulkImportDialog: React.FC<BulkImportDialogProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const { toast } = useToast();
  const [csvData, setCsvData] = useState('');
  const [importing, setImporting] = useState(false);

  const formatExample = [
    'Name,Email,Username,Password,User Type,Status,University,Mobile No,Student/Staff ID,Date of Birth,Gender',
    'John Doe,john@example.com,john,Password123,Learner,active,Acado University,+1-555-000-0000,STU-001,1995-06-15,Male',
    'Jane Smith,jane@example.com,jane,Password123,Faculty,active,Jamk University,+1-555-111-2222,FAC-101,1988-09-20,Female',
  ].join('\n');

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast({
        title: 'No data provided',
        description: 'Please paste the CSV data before importing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setImporting(true);
      const lines = csvData.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must include header and at least one row of data.');
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const requiredHeaders = ['name', 'email', 'username', 'password', 'user type', 'status'];
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
      }

      const users: BulkImportUserInput[] = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const getValue = (header: string) => {
          const index = headers.indexOf(header);
          return index !== -1 ? values[index] || '' : '';
        };

        const userType = getValue('user type') as UserType;
        const status = getValue('status') as UserStatus;

        if (!['Learner', 'Faculty', 'Staff'].includes(userType)) {
          throw new Error(`Invalid user type "${userType}" in row: ${line}`);
        }
        if (!['active', 'inactive'].includes(status)) {
          throw new Error(`Invalid status "${status}" in row: ${line}`);
        }

        return {
          name: getValue('name'),
          email: getValue('email'),
          username: getValue('username'),
          password: getValue('password'),
          userType,
          status,
          university: getValue('university') || undefined,
          mobileNo: getValue('mobile no') || undefined,
          studentIdStaffId: getValue('student/staff id') || undefined,
          dateOfBirth: getValue('date of birth') || undefined,
          gender: getValue('gender') as 'Male' | 'Female' | 'Other' | undefined,
        };
      });

      await onImport(users);
      setCsvData('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Bulk import error:', error);
      toast({
        title: 'Import failed',
        description: error.message || 'Invalid CSV format.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Users</DialogTitle>
          <DialogDescription>
            Paste CSV data below to import multiple users at once. Make sure the headers match the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>CSV Format</Label>
            <Textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder={formatExample}
              rows={12}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold">Required Headers:</p>
            <p className="text-sm text-muted-foreground">
              Name, Email, Username, Password, User Type (Learner/Faculty/Staff), Status (active/inactive)
            </p>
            <p className="text-sm font-semibold">Optional Headers:</p>
            <p className="text-sm text-muted-foreground">
              University, Mobile No, Student/Staff ID, Date of Birth (YYYY-MM-DD), Gender (Male/Female/Other)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={importing}>
            {importing ? 'Importing...' : 'Import Users'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

