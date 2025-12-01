import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, Loader2, Search, Users } from 'lucide-react';

import { organizationsApi } from '@/api/organizations.api';

interface Organization {
  id: string;
  name: string;
  type: 'University' | 'Corporate' | 'Non-Profit';
  onboardingStage: 'Profile Created' | 'Documents Submitted' | 'Approved' | 'Live';
  contacts?: {
    primary?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    secondary?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  };
  suspended: boolean;
  createdAt: string | Date;
}

type OrganizationStatus = 'Active' | 'Pending' | 'Suspended';

const statusVariantMap: Record<OrganizationStatus, 'default' | 'secondary' | 'destructive'> = {
  Active: 'default',
  Pending: 'secondary',
  Suspended: 'destructive',
};

const Organizations: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrganizationStatus | 'All'>('All');

  const {
    data: organizations = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationsApi.list,
    retry: 1
  });

  const errorMessage = useMemo(() => {
    if (!isError) return '';
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    const apiMessage = axiosError?.response?.data?.error || axiosError?.response?.data?.message;
    if (axiosError?.response?.status === 401) {
      return 'You are not authorized to view organizations. Please log in again.';
    }
    if (axiosError?.response?.status === 403) {
      return 'Your account does not have permission to view organizations.';
    }
    if (axiosError?.response?.status === 404) {
      return 'Organizations endpoint not found. Please ensure the backend service has been updated.';
    }
    return apiMessage || axiosError?.message || 'Unable to load organizations. Please try again later.';
  }, [error, isError]);

  const organizationsWithStatus = useMemo(() => {
    return organizations.map((org) => {
      const status: OrganizationStatus = org.suspended
        ? 'Suspended'
        : org.onboardingStage === 'Live'
        ? 'Active'
        : 'Pending';

      return {
        ...org,
        status
      };
    });
  }, [organizations]);

  const filteredOrganizations = useMemo(() => {
    return organizationsWithStatus.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : org.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [organizationsWithStatus, search, statusFilter]);

  const renderRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={7}>
            <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading organizations...
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={7}>
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-destructive">{errorMessage}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (!isLoading && !isError && organizations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7}>
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-foreground">No organizations yet</p>
                <p className="text-sm text-muted-foreground">
                  Add your first organization to kick-start onboarding.
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  Refresh
                </Button>
                <Button size="sm" onClick={() => navigate('/organization/new')}>
                  Add organization
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (filteredOrganizations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7}>
            <div className="py-10 text-center text-sm text-muted-foreground">
              No organizations match your filters.
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return filteredOrganizations.map((org) => {
      const primaryContact = org.contacts?.primary;
      const secondaryContact = org.contacts?.secondary;
      const contactEmail = primaryContact?.email ?? secondaryContact?.email ?? '—';
      const createdDate = org.createdAt ? new Date(org.createdAt).toLocaleDateString() : '—';

      return (
        <TableRow key={org.id} className="hover:bg-muted/50">
          <TableCell className="space-y-1.5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <Link
                  to={`/organization/${org.id}`}
                  className="block text-base font-semibold text-foreground hover:text-primary"
                >
                  {org.name}
                </Link>
                <p className="text-xs text-muted-foreground break-all">{org.id}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={statusVariantMap[org.status]}>{org.status}</Badge>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {org.onboardingStage}
            </div>
          </TableCell>
          <TableCell>
            <p className="text-sm text-muted-foreground">{contactEmail}</p>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {createdDate}
            </div>
          </TableCell>
          <TableCell>
            <div className="inline-flex items-center gap-2 rounded-full border border-muted-foreground/20 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 text-primary/80" />
              <span>{org.type}</span>
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground">
            Manage onboarding, monitor engagement, and access organization details.
          </p>
        </div>
        <Button onClick={() => navigate('/organization/new')}>
          <span className="mr-2 text-lg leading-none">+</span>
          Add Organization
        </Button>
      </header>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search organizations by name or ID"
              className="pl-10"
            />
          </div>
          <div className="flex">
            <select
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as Organization['status'] | 'All')}
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Onboarding Stage</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderRows()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Organizations;


