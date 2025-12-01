import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Globe,
  Users,
  ShieldCheck,
  ShieldAlert,
  Send,
  FileText,
  UserPlus,
  Pencil,
} from 'lucide-react';
import {
  organizationsApi,
  type OrganizationDetailsResponse,
  type Organization,
  type OrganizationContact,
  type AddOrganizationAdminPayload,
  type UpdateOrganizationLocationPayload,
  type UpdateOrganizationInfoPayload,
  type UpdateOrganizationContactsPayload,
  type UpdateOrganizationStagePayload,
} from '@/api/organizations.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const statusVariantMap: Record<'Active' | 'Pending' | 'Suspended', 'default' | 'secondary' | 'destructive'> = {
  Active: 'default',
  Pending: 'secondary',
  Suspended: 'destructive',
};

const onboardingStageOptions: Organization['onboardingStage'][] = [
  'Profile Created',
  'Documents Submitted',
  'Approved',
  'Live',
];

const formatDateTime = (value?: string | Date) => {
  if (!value) return '—';
  return new Date(value).toLocaleString();
};

const SkeletonCard: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className }) => (
  <Card className={cn('border-dashed', className)}>
    <CardContent className="space-y-3 p-6">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="h-4 w-full animate-pulse rounded bg-muted/60"
        />
      ))}
    </CardContent>
  </Card>
);

const OrganizationDetails: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<
    'info' | 'location' | 'primaryContact' | 'secondaryContact' | 'communications' | 'support' | null
  >(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [adminForm, setAdminForm] = useState<AddOrganizationAdminPayload>({
    name: '',
    email: '',
    phone: '',
    password: '',
    sendWelcomeEmail: true,
  });
  const [stageSelection, setStageSelection] = useState<Organization['onboardingStage']>('Profile Created');

  const getErrorMessage = (
    err: AxiosError<{ error?: string; message?: string }> | null | undefined,
    fallback: string
  ) => {
    if (!err) return fallback;
    const data = (err.response?.data ?? {}) as { error?: string; message?: string };
    return data.error ?? data.message ?? err.message ?? fallback;
  };

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<
    OrganizationDetailsResponse,
    AxiosError,
    OrganizationDetailsResponse,
    [string, string | undefined]
  >({
    queryKey: ['organization', organizationId],
    queryFn: ({ queryKey }) => organizationsApi.get(queryKey[1] ?? ''),
    enabled: Boolean(organizationId),
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      const message = getErrorMessage(error, 'Failed to load organization details.');
      toast({
        title: 'Unable to load organization',
        description: message,
        variant: 'destructive',
      });
    }
  }, [isError, error, toast]);

  const addAdminMutation = useMutation({
    mutationFn: (payload: AddOrganizationAdminPayload) => {
      if (!organizationId) {
        throw new Error('Organization identifier missing');
      }
      return organizationsApi.addAdmin(organizationId, payload);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      setIsAddAdminOpen(false);
      setAdminForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        sendWelcomeEmail: true,
      });
      toast({
        title: 'Admin added successfully',
        description: result.temporaryCredentials
          ? `Temporary credentials generated:\nEmail: ${result.temporaryCredentials.email}\nPassword: ${result.temporaryCredentials.password}`
          : 'A welcome email has been sent to the new admin.',
      });
    },
    onError: (err: AxiosError<{ error?: string; message?: string }>) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to add organization admin.';
      toast({
        title: 'Unable to add admin',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (suspended: boolean) => {
      if (!organizationId) {
        throw new Error('Organization identifier missing');
      }
      return organizationsApi.updateStatus(organizationId, { suspended });
    },
    onSuccess: (_response, suspended) => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      toast({
        title: suspended ? 'Organization suspended' : 'Organization reinstated',
        description: suspended
          ? 'The organization has been moved to a suspended state.'
          : 'The organization is now active again.',
      });
    },
    onError: (err: AxiosError<{ error?: string; message?: string }>) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update organization status.';
      toast({
        title: 'Unable to update status',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: (payload: UpdateOrganizationLocationPayload) => {
      if (!organizationId) {
        throw new Error('Organization identifier missing');
      }
      return organizationsApi.updateLocation(organizationId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      toast({
        title: 'Location updated',
        description: 'Organization location has been updated successfully.',
      });
      setEditingSection(null);
      setEditValues({});
    },
    onError: (err: AxiosError<{ error?: string; message?: string }>) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update organization location.';
      toast({
        title: 'Unable to update location',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const updateInfoMutation = useMutation({
    mutationFn: (payload: UpdateOrganizationInfoPayload) => {
      if (!organizationId) {
        throw new Error('Organization identifier missing');
      }
      return organizationsApi.updateInfo(organizationId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      toast({
        title: 'Organization updated',
        description: 'Organization information has been updated successfully.',
      });
      setEditingSection(null);
      setEditValues({});
    },
    onError: (err: AxiosError<{ error?: string; message?: string }>) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update organization information.';
      toast({
        title: 'Unable to update organization',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const updateContactsMutation = useMutation({
    mutationFn: (payload: UpdateOrganizationContactsPayload) => {
      if (!organizationId) {
        throw new Error('Organization identifier missing');
      }
      return organizationsApi.updateContacts(organizationId, payload);
    },
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      const target =
        variables.primary && variables.secondary
          ? 'Contacts'
          : variables.primary
          ? 'Primary contact'
          : 'Secondary contact';
      toast({
        title: `${target} updated`,
        description: 'Contact details have been saved successfully.',
      });
      setEditingSection(null);
      setEditValues({});
    },
    onError: (err: AxiosError<{ error?: string; message?: string }>) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update organization contacts.';
      toast({
        title: 'Unable to update contacts',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: (payload: UpdateOrganizationStagePayload) => {
      if (!organizationId) {
        throw new Error('Organization identifier missing');
      }
      return organizationsApi.updateOnboardingStage(organizationId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      toast({
        title: 'Stage updated',
        description: 'Onboarding stage has been updated successfully.',
      });
    },
    onError: (err: AxiosError<{ error?: string; message?: string }>) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update onboarding stage.';
      toast({
        title: 'Unable to update stage',
        description: message,
        variant: 'destructive',
      });
    },
  });

  if (!organizationId) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Organization identifier is missing.
          </CardContent>
        </Card>
      </div>
    );
  }

  const organization = data?.organization;
  const primaryAdmin = data?.primaryAdmin;

  useEffect(() => {
    if (organization?.onboardingStage) {
      setStageSelection(organization.onboardingStage);
    }
  }, [organization?.onboardingStage]);

  const derivedStatus: 'Active' | 'Pending' | 'Suspended' = organization
    ? organization.suspended
      ? 'Suspended'
      : organization.onboardingStage === 'Live'
      ? 'Active'
      : 'Pending'
    : 'Pending';

  const highlightItems = useMemo(() => {
    if (!organization) return [];
    const items: Array<{ icon: React.ElementType; label: string; value: string }> = [
      {
        icon: ShieldCheck,
        label: 'Stage',
        value: organization.onboardingStage,
      },
      {
        icon: Building2,
        label: 'Type',
        value: organization.type,
      },
      {
        icon: FileText,
        label: 'Short Name',
        value: organization.shortName || '—',
      },
    ];

    if (organization.communications?.onboardingEmails?.length) {
      items.push({
        icon: Send,
        label: 'Onboarding Emails',
        value: String(organization.communications.onboardingEmails.length),
      });
    }

    return items;
  }, [organization]);

  const renderContacts = (contact?: OrganizationContact) => {
    if (!contact) {
      return <p className="text-sm text-muted-foreground">No contact information available.</p>;
    }

    return (
      <div className="space-y-2 text-sm">
        <p className="font-medium text-foreground">{contact.name || 'Unnamed contact'}</p>
        {contact.email && (
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
              {contact.email}
            </a>
          </p>
        )}
        {contact.phone && (
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{contact.phone}</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-left">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Organization Details</h1>
            <p className="text-sm text-muted-foreground">
              Review profile, contacts, and onboarding setup.
            </p>
          </div>
        </div>
        {organization && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={statusVariantMap[derivedStatus]}>{derivedStatus}</Badge>
                <Badge variant="outline">{organization.type}</Badge>
              </div>
            </div>
            <div
              className={cn(
                'rounded-xl border p-4 transition-colors sm:p-5',
                organization.suspended
                  ? 'border-destructive/40 bg-destructive/10'
                  : 'border-emerald-300/40 bg-emerald-500/5 dark:border-emerald-500/20 dark:bg-emerald-500/10'
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border',
                      organization.suspended
                        ? 'border-destructive/30 bg-destructive/15 text-destructive'
                        : 'border-emerald-300/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                    )}
                  >
                    {organization.suspended ? (
                      <ShieldAlert className="h-5 w-5" />
                    ) : (
                      <ShieldCheck className="h-5 w-5" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {organization.suspended ? 'Organization Suspended' : 'Organization Active'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {organization.suspended
                        ? 'Access is currently blocked for all users linked to this organization.'
                        : 'Keep the organization active to allow admins and learners to sign in.'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated status on{' '}
                      <span className="font-medium text-foreground">
                        {formatDateTime(organization.updatedAt)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {suspendMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  <Switch
                    checked={organization.suspended}
                    disabled={suspendMutation.isPending}
                    aria-label={
                      organization.suspended ? 'Reinstate organization' : 'Suspend organization'
                    }
                    onCheckedChange={(checked) => {
                      const nextState = checked;
                      const confirmed = window.confirm(
                        nextState
                          ? 'Suspend this organization? They will lose access until reinstated.'
                          : 'Reinstate this organization and restore access?'
                      );
                      if (!confirmed) return;
                      suspendMutation.mutate(nextState);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="grid gap-6 lg:grid-cols-3">
          <SkeletonCard className="lg:col-span-2" lines={6} />
          <SkeletonCard lines={4} />
        </div>
      )}

      {isError && !isLoading && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-destructive">
              {getErrorMessage(error, 'Unable to load organization details.')}
            </p>
            <Button variant="outline" onClick={() => navigate('/organization/list')}>
              Return to list
            </Button>
          </CardContent>
        </Card>
      )}

      {organization && !isLoading && !isError && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <Card>
              <CardContent className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
                {highlightItems.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </span>
                    <p className="text-lg font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
              <Card className="border-primary/20 shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Onboarding Stage
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <form
                    className="flex flex-wrap items-center gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (!organizationId || stageSelection === organization.onboardingStage) {
                        return;
                      }
                      updateStageMutation.mutate({ onboardingStage: stageSelection });
                    }}
                  >
                    <Select
                      value={stageSelection}
                      onValueChange={(value) =>
                        setStageSelection(value as Organization['onboardingStage'])
                      }
                      disabled={updateStageMutation.isPending}
                    >
                      <SelectTrigger
                        id="stage-update-select"
                        className="h-10 min-w-[200px] flex-1"
                      >
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {onboardingStageOptions.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="submit"
                      size="sm"
                      className="flex-shrink-0 px-6"
                      disabled={
                        updateStageMutation.isPending ||
                        stageSelection === organization.onboardingStage
                      }
                    >
                      {updateStageMutation.isPending ? 'Saving…' : 'Save'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {organization.name}
              </CardTitle>
              {organization.description && (
                <CardDescription>{organization.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Organization Info
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditValues({
                          name: organization.name,
                          type: organization.type,
                          website: organization.website ?? '',
                          description: organization.description ?? '',
                        });
                        setEditingSection('info');
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit organization info</span>
                    </Button>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    {organization.website && (
                      <p className="flex items-center gap-2 break-words">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {organization.website}
                        </a>
                      </p>
                    )}
                    <p>
                      <span className="font-medium text-foreground">Created: </span>
                      {new Date(organization.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Updated: </span>
                      {new Date(organization.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Location
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditValues({
                          city: organization.location?.city ?? '',
                          state: organization.location?.state ?? '',
                          country: organization.location?.country ?? '',
                        });
                        setEditingSection('location');
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit location</span>
                    </Button>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    {organization.location ? (
                      <>
                        <div className="rounded-lg border bg-muted/40 p-4">
                          <p className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{organization.location.city || 'City not set'}</span>
                          </p>
                          <Separator className="my-3" />
                          <dl className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <dt className="text-muted-foreground">State/Province</dt>
                              <dd className="font-medium text-foreground">{organization.location.state || '—'}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Country</dt>
                              <dd className="font-medium text-foreground">{organization.location.country || '—'}</dd>
                            </div>
                          </dl>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground">No location details provided.</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Primary Contact
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditValues({
                          name: organization.contacts?.primary?.name ?? '',
                          email: organization.contacts?.primary?.email ?? '',
                          phone: organization.contacts?.primary?.phone ?? '',
                        });
                        setEditingSection('primaryContact');
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit primary contact</span>
                    </Button>
                  </div>
                  <div className="mt-3">
                    {renderContacts(organization.contacts?.primary)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Secondary Contact
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditValues({
                          name: organization.contacts?.secondary?.name ?? '',
                          email: organization.contacts?.secondary?.email ?? '',
                          phone: organization.contacts?.secondary?.phone ?? '',
                        });
                        setEditingSection('secondaryContact');
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit secondary contact</span>
                    </Button>
                  </div>
                  <div className="mt-3">
                    {renderContacts(organization.contacts?.secondary)}
                  </div>
                </div>
              </div>

              <Separator />
            </CardContent>
          </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Team
                      </CardTitle>
                      <CardDescription>
                        Key contacts associated with this organization.
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setIsAddAdminOpen(true)}
                      disabled={addAdminMutation.isPending || !organizationId}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Admin
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Invite admins to manage this organization’s onboarding journey.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">Primary Admin</h3>
                    <div className="mt-3 space-y-2 text-sm">
                      {primaryAdmin ? (
                        <>
                          <p className="text-base font-medium text-foreground">{primaryAdmin.name || 'Admin user'}</p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${primaryAdmin.email}`} className="text-primary hover:underline">
                              {primaryAdmin.email}
                            </a>
                          </p>
                          {primaryAdmin.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{primaryAdmin.phone}</span>
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No admin user linked to this organization yet.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription>Important timeline events for this organization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium text-foreground">Profile created</p>
                      <p className="text-muted-foreground">{formatDateTime(organization.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                    <div>
                      <p className="font-medium text-foreground">Last updated</p>
                      <p className="text-muted-foreground">{formatDateTime(organization.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Onboarding status</p>
                      <p className="text-muted-foreground">
                        Currently in <span className="font-semibold">{organization.onboardingStage}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invite Organization Admin</DialogTitle>
            <DialogDescription>
              Create an admin account for this organization. You can provide a password or let the
              system generate one.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!organizationId) return;
              addAdminMutation.mutate({
                name: adminForm.name.trim(),
                email: adminForm.email.trim(),
                phone: adminForm.phone?.trim() || undefined,
                password: adminForm.password?.trim() || undefined,
                sendWelcomeEmail: adminForm.sendWelcomeEmail,
              });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="admin-name">Full Name</Label>
                <Input
                  id="admin-name"
                  placeholder="e.g., Priya Sharma"
                  value={adminForm.name}
                  onChange={(event) => setAdminForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="admin-email">Work Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.org"
                  value={adminForm.email}
                  onChange={(event) =>
                    setAdminForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-phone">Phone (optional)</Label>
                <Input
                  id="admin-phone"
                  placeholder="+91 98765 43210"
                  value={adminForm.phone ?? ''}
                  onChange={(event) =>
                    setAdminForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password (optional)</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Leave blank to auto-generate"
                  value={adminForm.password ?? ''}
                  onChange={(event) =>
                    setAdminForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium text-foreground">Send Welcome Email</p>
                <p className="text-sm text-muted-foreground">
                  Email the admin their login instructions when the account is created.
                </p>
              </div>
              <Switch
                checked={adminForm.sendWelcomeEmail ?? true}
                onCheckedChange={(checked) =>
                  setAdminForm((prev) => ({ ...prev, sendWelcomeEmail: checked }))
                }
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddAdminOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addAdminMutation.isPending}>
                {addAdminMutation.isPending ? 'Inviting...' : 'Invite Admin'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingSection !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSection(null);
            setEditValues({});
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSection === 'info' && 'Edit Organization Info'}
              {editingSection === 'location' && 'Edit Location'}
              {editingSection === 'primaryContact' && 'Edit Primary Contact'}
              {editingSection === 'secondaryContact' && 'Edit Secondary Contact'}
              {editingSection === 'communications' && 'Edit Communications Preferences'}
              {editingSection === 'support' && 'Edit Support Settings'}
            </DialogTitle>
            <DialogDescription>
              {editingSection === 'info' &&
                'Update the headline information shown across the admin portal.'}
              {editingSection === 'location' &&
                'Update the location details shown on organization records.'}
              {editingSection === 'primaryContact' &&
                'Set the main point of contact for this organization.'}
              {editingSection === 'secondaryContact' &&
                'Add an optional backup contact for this organization.'}
              {editingSection === 'communications' &&
                'Control who receives automated onboarding communications.'}
              {editingSection === 'support' &&
                'Document internal owners and notes for the success team.'}
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!organizationId) return;

              if (editingSection === 'location') {
                updateLocationMutation.mutate({
                  city: editValues.city?.trim() || undefined,
                  state: editValues.state?.trim() || undefined,
                  country: editValues.country?.trim() || undefined,
                });
                return;
              }

              if (editingSection === 'info') {
                const infoPayload: UpdateOrganizationInfoPayload = {
                  name: editValues.name?.trim(),
                  type: editValues.type,
                  description: editValues.description?.trim() || undefined,
                  website: editValues.website?.trim() || undefined,
                };
                updateInfoMutation.mutate(infoPayload);
                return;
              }

              if (editingSection === 'primaryContact' || editingSection === 'secondaryContact') {
                const key =
                  editingSection === 'primaryContact' ? 'primary' : 'secondary';
                const contactPayload: UpdateOrganizationContactsPayload = {
                  [key]: {
                    name: editValues.name?.trim() || undefined,
                    email: editValues.email?.trim() || undefined,
                    phone: editValues.phone?.trim() || undefined,
                  },
                };
                updateContactsMutation.mutate(contactPayload);
                return;
              }

              toast({
                title: 'Save coming soon',
                description: 'Editing this section will be available in a future release.',
              });
              setEditingSection(null);
            }}
          >
            {editingSection === 'info' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="info-name">Organization Name</Label>
                  <Input
                    id="info-name"
                    value={editValues.name ?? ''}
                    onChange={(event) =>
                      setEditValues((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={editValues.type ?? ''}
                    onValueChange={(value) => setEditValues((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="info-website">Website</Label>
                  <Input
                    id="info-website"
                    value={editValues.website ?? ''}
                    onChange={(event) =>
                      setEditValues((prev) => ({ ...prev, website: event.target.value }))
                    }
                    placeholder="https://example.org"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="info-description">Description</Label>
                  <Textarea
                    id="info-description"
                    rows={4}
                    value={editValues.description ?? ''}
                    onChange={(event) =>
                      setEditValues((prev) => ({ ...prev, description: event.target.value }))
                    }
                    placeholder="Share the organization mission, positioning, or focus areas."
                  />
                </div>
              </div>
            )}

            {editingSection === 'location' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location-city">City</Label>
                  <Input
                    id="location-city"
                    value={editValues.city ?? ''}
                    onChange={(event) =>
                      setEditValues((prev) => ({ ...prev, city: event.target.value }))
                    }
                    placeholder="City name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location-state">State / Province</Label>
                  <Input
                    id="location-state"
                    value={editValues.state ?? ''}
                    onChange={(event) =>
                      setEditValues((prev) => ({ ...prev, state: event.target.value }))
                    }
                    placeholder="State or province"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location-country">Country</Label>
                  <Input
                    id="location-country"
                    value={editValues.country ?? ''}
                    onChange={(event) =>
                      setEditValues((prev) => ({ ...prev, country: event.target.value }))
                    }
                    placeholder="Country"
                  />
                </div>
              </div>
            )}

            {(editingSection === 'primaryContact' || editingSection === 'secondaryContact') && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input
                    id="contact-name"
                    value={editValues.name ?? ''}
                    onChange={(event) =>
                      setEditValues((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={editValues.email ?? ''}
                    onChange={(event) =>
                      setEditValues((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="contact@example.org"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    value={editValues.phone ?? ''}
                    onChange={(event) =>
                      setEditValues((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            )}

            {editingSection === 'communications' && null}

            {editingSection === 'support' && null}

            <DialogFooter className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setEditingSection(null);
                  setEditValues({});
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  (editingSection === 'location' && updateLocationMutation.isPending) ||
                  (editingSection === 'info' && updateInfoMutation.isPending) ||
                  ((editingSection === 'primaryContact' || editingSection === 'secondaryContact') &&
                    updateContactsMutation.isPending)
                }
              >
                {editingSection === 'location' && updateLocationMutation.isPending
                  ? 'Saving...'
                  : editingSection === 'info' && updateInfoMutation.isPending
                  ? 'Saving...'
                  : (editingSection === 'primaryContact' || editingSection === 'secondaryContact') &&
                    updateContactsMutation.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationDetails;


