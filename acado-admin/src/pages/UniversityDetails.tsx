import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Building2,
  FileSpreadsheet,
  Save,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Users,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast as externalToast } from '@/hooks/use-toast';
import { universitiesApi } from '@/api/universities.api';
import { uploadApi } from '@/api/upload.api';
import { UniversityDetails as UniversityDetailsType } from '@/types/university';
import { validateImageFile, validateDocumentFile } from '@/utils/fileValidation';
import { Separator } from '@/components/ui/separator';
import { usersApi } from '@/api/users.api';
import { emailApi } from '@/api/email.api';
import type { User } from '@/types/user';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface FormState {
  shortName: string;
  fullName: string;
  rating: string;
  rank: string;
  brochureFile: File | null;
  brochureUrl?: string;
  coverImageFile: File | null;
  coverImageUrl?: string;
  about: string;
  whyThisUniversity: string;
  admission: string;
  placements: string;
  faq: string;
  testimonial: string;
}

interface AdminFormState {
  name: string;
  email: string;
  password: string;
}

const initialFormState: FormState = {
  shortName: '',
  fullName: '',
  rating: '',
  rank: '',
  brochureFile: null,
  brochureUrl: undefined,
  coverImageFile: null,
  coverImageUrl: undefined,
  about: '',
  whyThisUniversity: '',
  admission: '',
  placements: '',
  faq: '',
  testimonial: '',
};

const initialAdminForm: AdminFormState = {
  name: '',
  email: '',
  password: '',
};

const UniversityDetails = () => {
  const navigate = useNavigate();
  const { universityId } = useParams();
  const [university, setUniversity] = useState<UniversityDetailsType | null>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<User[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState<AdminFormState>(initialAdminForm);
  const [brochureName, setBrochureName] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDraggingBrochure, setIsDraggingBrochure] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const coverObjectUrlRef = useRef<string | null>(null);
  const [sendInvitation, setSendInvitation] = useState(false);

  useEffect(() => {
    const loadUniversity = async () => {
      if (!universityId) return;
      try {
        const data = await universitiesApi.getUniversity(universityId);
        setUniversity(data);
        setFormData({
          shortName: data.shortName || '',
          fullName: data.name || '',
          rating: data.rating || '',
          rank: data.rank || '',
          brochureFile: null,
          brochureUrl: data.branding?.brochureUrl,
          coverImageFile: null,
          coverImageUrl: data.branding?.coverImageUrl,
          about: data.about?.description || '',
          whyThisUniversity: data.whyThisUniversity || '',
          admission: data.admission || '',
          placements: data.placements || '',
          faq: data.faq || '',
          testimonial: data.testimonials?.[0] || '',
        });
      } catch (err: any) {
        console.error('Failed to load university details', err);
        externalToast({
          title: 'Failed to load details',
          description: err?.response?.data?.error || err?.message || 'Please try again later.',
          variant: 'destructive',
        });
      }
    };

    loadUniversity();
  }, [universityId]);

  useEffect(() => {
    const loadAdmins = async () => {
      if (!universityId) return;
      try {
        setAdminsLoading(true);
        const response = await usersApi.getUsers({
          userType: 'Admin',
          universityId,
          pageSize: 100,
        });
        setAdmins(response.data);
      } catch (error: any) {
        console.warn('Failed to fetch university admins', error);
        externalToast({
          title: 'Unable to load admins',
          description: error?.message || 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setAdminsLoading(false);
      }
    };

    loadAdmins();
  }, [universityId]);

  const handleSave = async () => {
    if (!universityId || !university) return;

    try {
      setLoading(true);

      let brochureUrl = formData.brochureUrl;
      let coverImageUrl = formData.coverImageUrl;

      // Upload brochure if present
      if (formData.brochureFile) {
        try {
          console.log('Uploading brochure file:', formData.brochureFile.name);
          const upload = await uploadApi.uploadFile(formData.brochureFile, 'brochure');
          brochureUrl = upload.url;
          console.log('Brochure uploaded successfully:', brochureUrl);
        } catch (uploadError: any) {
          console.error('Brochure upload failed:', uploadError);
          throw new Error(`Brochure upload failed: ${uploadError.response?.data?.error || uploadError.message || 'Unknown error'}`);
        }
      }

      // Upload cover image if present
      if (formData.coverImageFile) {
        try {
          console.log('Uploading cover image:', formData.coverImageFile.name);
          const upload = await uploadApi.uploadFile(formData.coverImageFile, 'coverImage');
          coverImageUrl = upload.url;
          console.log('Cover image uploaded successfully:', coverImageUrl);
        } catch (uploadError: any) {
          console.error('Cover image upload failed:', uploadError);
          throw new Error(`Cover image upload failed: ${uploadError.response?.data?.error || uploadError.message || 'Unknown error'}`);
        }
      }

      const payload: Partial<UniversityDetailsType> = {
        shortName: formData.shortName,
        name: formData.fullName,
        rating: formData.rating,
        rank: formData.rank,
        branding: {
          ...university.branding,
          brochureUrl,
          coverImageUrl,
        },
        about: {
          ...university.about,
          description: formData.about,
        },
        whyThisUniversity: formData.whyThisUniversity,
        admission: formData.admission,
        placements: formData.placements,
        faq: formData.faq,
        testimonials: formData.testimonial ? [formData.testimonial] : [],
      };

      console.log('📦 Sending update payload:', {
        universityId,
        branding: payload.branding,
        hasNewBrochure: !!formData.brochureFile,
        hasNewCoverImage: !!formData.coverImageFile,
      });

      await universitiesApi.updateUniversity(universityId, payload);
      externalToast({
        title: 'Changes saved',
        description: 'University details updated successfully.',
      });
      navigate('/universities');
    } catch (err: any) {
      console.error('Failed to update university', err);
      externalToast({
        title: 'Failed to save changes',
        description: err?.response?.data?.error || err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInitials = (name?: string | null) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const generateSecurePassword = () => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    return Array.from({ length: 12 }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
  };

  const validateIncomingFile = (field: 'brochure' | 'cover', file: File) => {
    if (field === 'brochure') {
      // Use the standardized document validation
      const validation = validateDocumentFile(file, 10);
      if (!validation.valid) {
        externalToast({
          title: 'Invalid File',
          description: validation.error,
          variant: 'destructive',
        });
        return false;
      }
    } else {
      // Use the standardized image validation - increased to 10MB to match backend
      const validation = validateImageFile(file, 10);
      if (!validation.valid) {
        externalToast({
          title: 'Invalid File',
          description: validation.error,
          variant: 'destructive',
        });
        return false;
      }
    }
    return true;
  };

  const handleAssignFile = (field: 'brochure' | 'cover', file: File) => {
    if (field === 'brochure') {
      setFormData((prev) => ({
        ...prev,
        brochureFile: file,
        brochureUrl: undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        coverImageFile: file,
        coverImageUrl: undefined,
      }));
    }
  };

  const handleFileChange = (
    field: 'brochureFile' | 'coverImageFile',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const kind = field === 'brochureFile' ? 'brochure' : 'cover';
    if (!validateIncomingFile(kind, file)) {
      event.target.value = '';
      return;
    }
    handleAssignFile(kind, file);
    event.target.value = '';
  };

  const handleRemoveFile = (field: 'brochure' | 'cover') => {
    if (field === 'brochure') {
      setFormData((prev) => ({
        ...prev,
        brochureFile: null,
        brochureUrl: undefined,
      }));
      setBrochureName(null);
      if (brochureInputRef.current) {
        brochureInputRef.current.value = '';
      }
    } else {
      if (coverObjectUrlRef.current) {
        URL.revokeObjectURL(coverObjectUrlRef.current);
        coverObjectUrlRef.current = null;
      }
      setFormData((prev) => ({
        ...prev,
        coverImageFile: null,
        coverImageUrl: undefined,
      }));
      setCoverPreview(null);
      if (coverInputRef.current) {
        coverInputRef.current.value = '';
      }
    }
  };

  const handleAdminSubmit = async () => {
    if (!university || !universityId) {
      externalToast({
        title: 'University not found',
        description: 'Refresh the page and try again.',
        variant: 'destructive',
      });
      return;
    }

    if (!adminForm.name.trim() || !adminForm.email.trim()) {
      externalToast({
        title: 'Missing information',
        description: 'Please provide both name and email for the admin.',
        variant: 'destructive',
      });
      return;
    }

    const username = adminForm.email.split('@')[0];
    const password =
      adminForm.password && adminForm.password.length >= 8
        ? adminForm.password
        : generateSecurePassword();

    try {
      setCreatingAdmin(true);
      const payload = {
        name: adminForm.name.trim(),
        email: adminForm.email.trim().toLowerCase(),
        username,
        password,
        userType: 'Admin' as const,
        status: 'active' as const,
        universityId,
        universityName: university.name,
      };

      const newAdmin = await usersApi.createUser(payload);
      setAdmins((prev) => [newAdmin, ...prev]);
      setAdminForm(initialAdminForm);
      setSendInvitation(false);

      externalToast({
        title: 'Admin user created',
        description: `Temporary password: ${password}. Share it securely with the new admin.`,
      });

      // Send admin invitation email if toggle is enabled
      if (sendInvitation) {
        try {
          const inviteLink = `${window.location.origin}/login`;
          await emailApi.sendAdminInvitation(adminForm.email.trim().toLowerCase(), {
            recipientName: adminForm.name.trim(),
            inviteLink,
            inviterName: 'Admin', // You can replace with actual logged-in user name
            organizationName: university.name,
          });

          console.log('✅ Admin invitation email sent to:', adminForm.email);
          externalToast({
            title: 'Invitation sent',
            description: `Admin invitation email has been sent to ${adminForm.email}.`,
          });
        } catch (emailError: any) {
          console.error('❌ Failed to send admin invitation email:', emailError);
          externalToast({
            title: 'Email send failed',
            description: 'Admin created successfully, but invitation email failed to send.',
            variant: 'default',
          });
        }
      }
    } catch (error: any) {
      console.error('Failed to create admin user', error);
      externalToast({
        title: 'Failed to create admin',
        description: error?.response?.data?.error || error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleToggleAdminStatus = async (admin: User, nextActive: boolean) => {
    try {
      const updated = await usersApi.updateUser(admin.id, {
        status: nextActive ? 'active' : 'inactive',
      });
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? updated : a))
      );
      externalToast({
        title: nextActive ? 'Admin activated' : 'Admin deactivated',
        description: `${admin.name} is now ${nextActive ? 'active' : 'inactive'}.`,
      });
    } catch (error: any) {
      externalToast({
        title: 'Failed to update status',
        description: error?.response?.data?.error || error?.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const adminStats = useMemo(() => {
    const activeAdmins = admins.filter((admin) => admin.status === 'active').length;
    const inactiveAdmins = admins.length - activeAdmins;
    return { total: admins.length, active: activeAdmins, inactive: inactiveAdmins };
  }, [admins]);

  useEffect(() => {
    if (formData.brochureFile) {
      setBrochureName(formData.brochureFile.name);
    } else if (formData.brochureUrl) {
      try {
        const url = new URL(formData.brochureUrl);
        setBrochureName(url.pathname.split('/').pop() || 'brochure.pdf');
      } catch {
        setBrochureName(formData.brochureUrl.split('/').pop() || 'brochure.pdf');
      }
    } else {
      setBrochureName(null);
    }
  }, [formData.brochureFile, formData.brochureUrl]);

  useEffect(() => {
    if (coverObjectUrlRef.current) {
      URL.revokeObjectURL(coverObjectUrlRef.current);
      coverObjectUrlRef.current = null;
    }
    if (formData.coverImageFile) {
      const objectUrl = URL.createObjectURL(formData.coverImageFile);
      coverObjectUrlRef.current = objectUrl;
      setCoverPreview(objectUrl);
    } else {
      setCoverPreview(formData.coverImageUrl || null);
    }
  }, [formData.coverImageFile, formData.coverImageUrl]);

  useEffect(() => {
    return () => {
      if (coverObjectUrlRef.current) {
        URL.revokeObjectURL(coverObjectUrlRef.current);
      }
    };
  }, []);

  if (!university) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading university details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/universities')} className="hover:bg-muted">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{university.name}</h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Update public-facing details, upload assets, and manage administrative access for this university.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                {university.institutionType || 'University'}
              </Badge>
              <Badge
                variant={university.status === 'Suspended' ? 'destructive' : 'default'}
                className="flex items-center gap-1"
              >
                {university.status === 'Suspended' ? (
                  <ShieldAlert className="h-3.5 w-3.5" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" />
                )}
                {university.status ?? 'Live'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/universities/${university.id}/view`)}>
            View Profile
          </Button>
          <Button onClick={handleSave} className="gap-2" disabled={loading}>
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>University Snapshot</CardTitle>
              <CardDescription>An overview that powers the public profile and reporting dashboards.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  value={formData.shortName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortName: e.target.value }))}
                  placeholder="MIT"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Massachusetts Institute of Technology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                  placeholder="4.8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rank">Rank</Label>
                <Input
                  id="rank"
                  value={formData.rank}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rank: e.target.value }))}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload brochure</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                  <div className="w-40 h-24 bg-background rounded-lg flex items-center justify-center mb-3 overflow-hidden border">
                    {brochureName ? (
                      <span className="text-xs px-2 text-muted-foreground text-center truncate w-full">
                        {brochureName}
                      </span>
                    ) : (
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="gap-2" asChild>
                      <label htmlFor="brochureUpload">
                        <Upload className="w-4 h-4" />
                        {formData.brochureFile ? 'Replace file' : 'Upload file'}
                      </label>
                    </Button>
                    {(formData.brochureFile || formData.brochureUrl) && (
                      <>
                        {formData.brochureUrl && !formData.brochureFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(formData.brochureUrl!, '_blank')}
                          >
                            View
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveFile('brochure')}
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Recommended format: PDF or DOC. Max size 10MB.
                  </p>
                </div>
                <Input
                  id="brochureUpload"
                  ref={brochureInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(event) => handleFileChange('brochureFile', event)}
                />
              </div>
              <div className="space-y-2">
                <Label>Upload cover image</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                  <div className="w-40 h-24 bg-background rounded-lg flex items-center justify-center mb-3 overflow-hidden border">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="gap-2" asChild>
                      <label htmlFor="coverUpload">
                        <Upload className="w-4 h-4" />
                        {formData.coverImageFile ? 'Replace image' : 'Upload image'}
                      </label>
                    </Button>
                    {(formData.coverImageFile || formData.coverImageUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveFile('cover')}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Recommended format: JPG or PNG. Max size 5MB.
                  </p>
                </div>
                <Input
                  id="coverUpload"
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleFileChange('coverImageFile', event)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Story & Highlights</CardTitle>
              <CardDescription>These sections populate the detail page and marketing site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="about">About the University</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => setFormData((prev) => ({ ...prev, about: e.target.value }))}
                  placeholder="Summarise the university, its history, and impact..."
                  rows={5}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whyThisUniversity">Why Choose This University?</Label>
                <Textarea
                  id="whyThisUniversity"
                  value={formData.whyThisUniversity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, whyThisUniversity: e.target.value }))}
                  placeholder="Highlight differentiators, rankings, or student success stories..."
                  rows={5}
                  className="resize-none"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="admission">Admission Overview</Label>
                  <Textarea
                    id="admission"
                    value={formData.admission}
                    onChange={(e) => setFormData((prev) => ({ ...prev, admission: e.target.value }))}
                    placeholder="Outline key admission steps, deadlines, and requirements..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placements">Placements & Outcomes</Label>
                  <Textarea
                    id="placements"
                    value={formData.placements}
                    onChange={(e) => setFormData((prev) => ({ ...prev, placements: e.target.value }))}
                    placeholder="Share placement rates, recruiter highlights, or alumni success..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ & Testimonial</CardTitle>
              <CardDescription>Polish the information prospective students see most.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="faq">Frequently Asked Questions</Label>
                <Textarea
                  id="faq"
                  value={formData.faq}
                  onChange={(e) => setFormData((prev) => ({ ...prev, faq: e.target.value }))}
                  placeholder="Add FAQs in Q/A format or bullet list..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonial">Featured Testimonial</Label>
                <Textarea
                  id="testimonial"
                  value={formData.testimonial}
                  onChange={(e) => setFormData((prev) => ({ ...prev, testimonial: e.target.value }))}
                  placeholder="Capture a compelling student or partner quote..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Grant staff members admin access to manage courses, applicants, and forms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Total admins</p>
                    <p className="text-sm font-semibold text-foreground">{adminStats.total}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Active</p>
                  <p className="text-sm font-semibold text-foreground">{adminStats.active}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Inactive</p>
                  <p className="text-sm font-semibold text-foreground">{adminStats.inactive}</p>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border bg-muted/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold">Invite a new admin</h3>
                    <p className="text-xs text-muted-foreground">
                      Fill out the details below. Toggle email invitation if you want us to send onboarding instructions.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Full name</Label>
                    <Input
                      id="adminName"
                      placeholder="Jane Doe"
                      value={adminForm.name}
                      onChange={(e) => setAdminForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Work email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="jane@university.edu"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="adminPassword">Default password</Label>
                    <Input
                      id="adminPassword"
                      type="text"
                      placeholder="Enter a temporary password to share with the admin"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters. Share this password with the admin securely.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-dashed bg-background px-4 py-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Send email invitation</p>
                    <p className="text-xs text-muted-foreground">
                      We’ll notify the admin via email and include temporary login details.
                    </p>
                  </div>
                  <Switch
                    checked={sendInvitation}
                    onCheckedChange={(checked) => setSendInvitation(checked)}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>Temporary passwords are 12 characters and contain letters, numbers, and symbols.</span>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={handleAdminSubmit}
                  disabled={creatingAdmin}
                >
                  {creatingAdmin ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Add Admin User
                    </>
                  )}
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Current Administrators
                  </h3>
                </div>
                {adminsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                  </div>
                ) : admins.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    No admin users assigned yet. Add at least one admin to give access to dashboards.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex flex-col gap-3 rounded-lg border bg-card p-3 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border">
                            <AvatarFallback>{generateInitials(admin.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold leading-tight">{admin.name}</p>
                            <p className="text-xs text-muted-foreground">{admin.email}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <Badge
                                variant={admin.status === 'active' ? 'default' : 'destructive'}
                              >
                                {admin.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Switch
                            checked={admin.status === 'active'}
                            onCheckedChange={(checked) => handleToggleAdminStatus(admin, checked)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetails;

