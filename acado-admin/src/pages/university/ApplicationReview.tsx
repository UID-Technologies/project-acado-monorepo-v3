import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useApplicationSubmissions } from '@/hooks/useApplicationSubmissions';
import { useFormsData } from '@/hooks/useFormsData';
import { formsApi, Form, ConfiguredField } from '@/api/forms.api';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap,
  FileText,
  CheckCircle,
  Clock,
  Target,
  XCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  Award,
  File,
  Image as ImageIcon,
  ExternalLink,
  Download,
  Eye
} from 'lucide-react';

const ApplicationReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { getApplicationById, updateApplicationStatus } = useApplicationSubmissions();
  const { forms, universities, courses } = useFormsData();
  const [formFields, setFormFields] = useState<ConfiguredField[]>([]);
  const [loadingForm, setLoadingForm] = useState(false);

  // Determine base path based on current route
  const isAdminRoute = location.pathname.startsWith('/applications');
  const basePath = isAdminRoute ? '/applications' : '/university/applications';

  const application = getApplicationById(id || '');
  
  // Resolve form, course, and university data
  const form = useMemo(
    () => forms.find(f => f.id && application?.formId ? String(f.id) === String(application.formId) : false),
    [application?.formId, forms]
  );

  const course = useMemo(() => {
    if (!application?.courseId) return undefined;
    return courses.find(c => {
      const courseId =
        c?.id ??
        (c as any)?._id ??
        (c as any)?.programId ??
        (c as any)?.program?.id ??
        (c as any)?.courseId;
      return courseId ? String(courseId) === String(application.courseId) : false;
    });
  }, [application?.courseId, courses]);

  const university = useMemo(() => {
    if (application?.universityId) {
      return universities.find(u => u.id && String(u.id) === String(application.universityId));
    }
    const derivedUniversityId =
      course &&
      (course.universityId ??
        (course as any)?.university_id ??
        (course as any)?.organization_id ??
        (course as any)?.organizationId);

    if (derivedUniversityId) {
      return universities.find(u => u.id && String(u.id) === String(derivedUniversityId));
    }
    return undefined;
  }, [application?.universityId, course, universities]);

  const pickFirstString = (...values: Array<string | null | undefined>) => {
    for (const value of values) {
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }
    return null;
  };

  const formData = application?.formData || {};

  const findFirstStringByKeys = (
    data: unknown,
    keywords: string[],
    visited = new WeakSet<object>()
  ): string | null => {
    if (!data || typeof data !== 'object') {
      return null;
    }
    if (visited.has(data as object)) {
      return null;
    }
    visited.add(data as object);

    const entries = Array.isArray(data)
      ? data.map((value, index) => [String(index), value] as const)
      : Object.entries(data as Record<string, unknown>);

    for (const [key, value] of entries) {
      const normalizedKey = key.toLowerCase();

      if (keywords.some(keyword => normalizedKey.includes(keyword))) {
        if (typeof value === 'string' && value.trim().length > 0) {
          return value.trim();
        }
        if (value && typeof value === 'object') {
          const nested = findFirstStringByKeys(value, keywords, visited);
          if (nested) {
            return nested;
          }
        }
      }

      if (value && typeof value === 'object') {
        const nested = findFirstStringByKeys(value, keywords, visited);
        if (nested) {
          return nested;
        }
      }
    }

    return null;
  };

  const displayUniversityName = pickFirstString(
    application?.universityName,
    university?.name,
    findFirstStringByKeys(formData, ['university', 'institution', 'college', 'school']),
    formData.universityName,
    formData['University Name'],
    formData.university?.name,
    formData.selectedUniversity,
    formData.schoolName,
    form?.customCategoryNames?.['university']?.name
  );

  const displayCourseName = pickFirstString(
    application?.courseName,
    course?.name,
    (course as any)?.title,
    (course as any)?.programName,
    findFirstStringByKeys(formData, ['course', 'program', 'degree', 'major']),
    formData.courseName,
    formData['Course Name'],
    formData.course?.name,
    formData.selectedCourse,
    formData.programName
  );

  const resolvedMatchScore = useMemo(() => {
    if (application?.matchScore == null) return null;
    const numeric = Number(application.matchScore);
    return Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : null;
  }, [application?.matchScore]);

  const statusMeta = useMemo(() => {
    const palette: Record<
      string,
      { label: string; tone: string; chip: string; description: string }
    > = {
      submitted: {
        label: 'Submitted',
        tone: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
        chip: 'bg-blue-600 hover:bg-blue-500 text-white',
        description: 'Awaiting initial review',
      },
      under_review: {
        label: 'In Review',
        tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
        chip: 'bg-amber-500 hover:bg-amber-400 text-white',
        description: 'Being assessed by reviewers',
      },
      shortlisted: {
        label: 'Shortlisted',
        tone: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200',
        chip: 'bg-purple-600 hover:bg-purple-500 text-white',
        description: 'Advanced to the shortlist',
      },
      interview_scheduled: {
        label: 'Interview Scheduled',
        tone: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200',
        chip: 'bg-orange-500 hover:bg-orange-400 text-white',
        description: 'Interview arrangements underway',
      },
      accepted: {
        label: 'Accepted',
        tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
        chip: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        description: 'Application approved',
      },
      rejected: {
        label: 'Rejected',
        tone: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200',
        chip: 'bg-red-600 hover:bg-red-500 text-white',
        description: 'Application declined',
      },
      waitlisted: {
        label: 'Waitlisted',
        tone: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200',
        chip: 'bg-slate-600 hover:bg-slate-500 text-white',
        description: 'Placed on the waiting list',
      },
      withdrawn: {
        label: 'Withdrawn',
        tone: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-200',
        chip: 'bg-slate-500 hover:bg-slate-400 text-white',
        description: 'Application withdrawn by applicant',
      },
    };

    return palette[application?.status ?? 'submitted'] ?? palette.submitted;
  }, [application?.status]);

  const statusBadgeClass = useMemo(() => statusMeta.chip, [statusMeta]);

  const glanceCards = useMemo(
    () => [
      {
        label: 'University',
        value: displayUniversityName || 'Not provided',
        icon: Building2,
      },
      {
        label: 'Course',
        value: displayCourseName || 'Not provided',
        icon: GraduationCap,
      },
      {
        label: 'Match Score',
        value: 'N/A',
        icon: Target,
      },
      {
        label: 'Submitted on',
        value: application?.submittedAt
          ? new Date(application.submittedAt).toLocaleString()
          : 'Not submitted',
        icon: Clock,
      },
    ],
    [application?.submittedAt, displayCourseName, displayUniversityName, resolvedMatchScore]
  );

  // Fetch form fields to identify file fields
  useEffect(() => {
    const fetchFormFields = async () => {
      // Use form from context if available
      if (form?.fields && form.fields.length > 0) {
        setFormFields(form.fields);
        return;
      }

      // Otherwise fetch from API
      if (application?.formId) {
        try {
          setLoadingForm(true);
          const formData = await formsApi.getFormById(application.formId);
          setFormFields(formData.fields || []);
        } catch (error) {
          console.error('Error fetching form fields:', error);
        } finally {
          setLoadingForm(false);
        }
      }
    };

    fetchFormFields();
  }, [application?.formId, form]);
  
  const [selectedStatus, setSelectedStatus] = useState(application?.status || 'submitted');
  const [isCommDialogOpen, setIsCommDialogOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [isDocRequestDialogOpen, setIsDocRequestDialogOpen] = useState(false);
  const [isAcceptanceDialogOpen, setIsAcceptanceDialogOpen] = useState(false);
  
  const [commMessage, setCommMessage] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [docRequest, setDocRequest] = useState('');

  const stages = [
    { value: 'submitted', label: 'Submitted', icon: FileText, color: 'bg-blue-500' },
    { value: 'under_review', label: 'In Review', icon: Clock, color: 'bg-yellow-500' },
    { value: 'shortlisted', label: 'Shortlisted', icon: Target, color: 'bg-purple-500' },
    { value: 'interview_scheduled', label: 'In Progress', icon: AlertCircle, color: 'bg-orange-500' },
    { value: 'accepted', label: 'Selected', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'bg-red-500' },
  ];

  // Update selectedStatus when application changes
  useEffect(() => {
    if (application) {
      setSelectedStatus(application.status);
    }
  }, [application]);

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Application Not Found</h2>
        <p className="text-muted-foreground mb-4">The application you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(basePath)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    );
  }

  const currentStage = stages.find(s => s.value === application.status);
  const StageIcon = currentStage?.icon || FileText;

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus as any);
    updateApplicationStatus(application.id, newStatus as any);
    toast({
      title: 'Status Updated',
      description: `Application status changed to ${stages.find(s => s.value === newStatus)?.label}`,
    });
  };

  const handleSendCommunication = () => {
    if (!commMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Communication Sent',
      description: 'Your message has been sent to the applicant.',
    });
    setCommMessage('');
    setIsCommDialogOpen(false);
  };

  const handleScheduleInterview = () => {
    if (!interviewDate || !interviewTime) {
      toast({
        title: 'Error',
        description: 'Please select both date and time',
        variant: 'destructive',
      });
      return;
    }
    // Update status to interview_scheduled
    updateApplicationStatus(application.id, 'interview_scheduled');
    setSelectedStatus('interview_scheduled');
    toast({
      title: 'Interview Scheduled',
      description: `Interview scheduled for ${new Date(interviewDate).toLocaleDateString()} at ${interviewTime}`,
    });
    setInterviewDate('');
    setInterviewTime('');
    setIsInterviewDialogOpen(false);
  };

  const handleRequestDocuments = () => {
    if (!docRequest.trim()) {
      toast({
        title: 'Error',
        description: 'Please specify which documents you need',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Document Request Sent',
      description: 'Document request has been sent to the applicant.',
    });
    setDocRequest('');
    setIsDocRequestDialogOpen(false);
  };

  const handleGenerateAcceptance = () => {
    updateApplicationStatus(application.id, 'accepted');
    setSelectedStatus('accepted');
    toast({
      title: 'Acceptance Letter Generated',
      description: 'Acceptance letter has been generated and sent to the applicant.',
    });
    setIsAcceptanceDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-fit"
                onClick={() => navigate(basePath)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
              <Badge className={statusBadgeClass}>{statusMeta.label}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${statusMeta.tone}`}>
                {currentStage ? (
                  <currentStage.icon className="h-6 w-6" />
                ) : (
                  <FileText className="h-6 w-6" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Application Review</h1>
                <p className="text-sm text-muted-foreground">
                  {statusMeta.description}
                </p>
              </div>
            </div>
          </div>
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto lg:max-w-xl">
            {glanceCards.map(({ label, value, icon: Icon }) => (
              <Card key={label} className="border-dashed">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="mt-1 rounded-md bg-muted px-2 py-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {value}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{application.applicantName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{application.applicantEmail || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{application.applicantPhone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-medium text-foreground">{application.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Information */}
          <Card>
            <CardHeader>
              <CardTitle>Program Information</CardTitle>
              <CardDescription>University, course, and form context</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    label: 'University',
                    value: displayUniversityName || 'Not provided',
                    icon: Building2,
                  },
                  {
                    label: 'Course',
                    value: displayCourseName || 'Not provided',
                    icon: GraduationCap,
                  },
                  {
                    label: 'Form Used',
                    value: form?.title || form?.name || 'Not provided',
                    icon: FileText,
                  },
                  {
                    label: 'Match Score',
                    value: 'N/A',
                    icon: Target,
                    tone: 'text-muted-foreground',
                  },
                ].map(({ label, value, icon: Icon, tone }) => (
                  <div key={label} className="flex items-start gap-3 rounded-lg border border-dashed border-muted-foreground/20 p-4">
                    <div className="rounded-md bg-muted px-2 py-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {label}
                      </p>
                      <p className={cn('text-sm font-semibold text-foreground', tone)}>
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Form Data */}
          <Card>
            <CardHeader>
              <CardTitle>Application Form Data</CardTitle>
              <CardDescription>Information submitted by the applicant</CardDescription>
            </CardHeader>
            <CardContent>
              {application.formData && Object.keys(application.formData).length > 0 ? (
                <div className="grid gap-4">
                  {Object.entries(application.formData).map(([key, value]) => {
                    // Skip internal fields that are already displayed elsewhere
                    if (['name', 'fullName', 'Full Name', 'email', 'Email Address', 'emailAddress', 'phone', 'phoneNumber', 'Phone Number', 'mobile'].includes(key)) {
                      return null;
                    }

                    // Check if this field is a file field
                    const field = formFields.find(f => f.name === key);
                    const isFileField = field?.type === 'file';
                    const fileUrl = typeof value === 'string' && value.startsWith('http') ? value : null;

                    if (isFileField && fileUrl) {
                      const fileName = fileUrl.split('/').pop() || key;
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                      const isPdf = /\.pdf$/i.test(fileName);

                      return (
                        <div key={key} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground capitalize">
                              {field?.customLabel || field?.label || key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                            {isImage ? (
                              <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden border bg-muted">
                                <img
                                  src={fileUrl}
                                  alt={fileName}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    img.style.display = 'none';
                                    const parent = img.parentElement;
                                    if (parent && !parent.querySelector('.error-fallback')) {
                                      const fallback = document.createElement('div');
                                      fallback.className = 'error-fallback h-full w-full flex items-center justify-center bg-muted';
                                      fallback.innerHTML = '<svg class="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-20 w-20 flex-shrink-0 rounded border flex items-center justify-center bg-muted">
                                {isPdf ? (
                                  <FileText className="h-8 w-8 text-red-500" />
                                ) : (
                                  <File className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate mb-1">{fileName}</p>
                              <div className="flex items-center gap-2">
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  View
                                </a>
                                <a
                                  href={fileUrl}
                                  download
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  <Download className="h-3 w-3" />
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Non-file field rendering
                    return (
                      <div key={key} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                        <span className="text-sm font-medium text-muted-foreground capitalize">
                          {field?.customLabel || field?.label || key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                        </span>
                        <span className="text-sm text-foreground font-semibold text-right max-w-xs break-words">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No additional form data available.</p>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Submitted</span>
                <span className="text-sm font-medium text-foreground">
                  {application.submittedAt
                    ? new Date(application.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium text-foreground">
                  {application.lastUpdated
                    ? new Date(application.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Change the current stage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => {
                    const Icon = stage.icon;
                    return (
                      <SelectItem key={stage.value} value={stage.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                          {stage.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Communicate with applicant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Send Communication */}
              <Dialog open={isCommDialogOpen} onOpenChange={setIsCommDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Communication
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Communication</DialogTitle>
                    <DialogDescription>Send a message to the applicant</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        value={commMessage}
                        onChange={(e) => setCommMessage(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCommDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendCommunication}>Send Message</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Schedule Interview */}
              <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                    <DialogDescription>Set interview date and time</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Interview Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Interview Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsInterviewDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleScheduleInterview}>Schedule</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Request Documents */}
              <Dialog open={isDocRequestDialogOpen} onOpenChange={setIsDocRequestDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Request Documents
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Documents</DialogTitle>
                    <DialogDescription>Request additional documents from applicant</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="docrequest">Document Details</Label>
                      <Textarea
                        id="docrequest"
                        placeholder="Specify which documents you need..."
                        value={docRequest}
                        onChange={(e) => setDocRequest(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDocRequestDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleRequestDocuments}>Send Request</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Separator />

              {/* Generate Acceptance */}
              <Dialog open={isAcceptanceDialogOpen} onOpenChange={setIsAcceptanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                    <Award className="h-4 w-4 mr-2" />
                    Generate Acceptance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Acceptance Letter</DialogTitle>
                    <DialogDescription>
                      This will generate and send an acceptance letter to the applicant
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to generate an acceptance letter for {application.applicantName}?
                      This will automatically change the application status to "Selected".
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAcceptanceDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleGenerateAcceptance} className="bg-green-600 hover:bg-green-700">
                        Generate & Send
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReview;
