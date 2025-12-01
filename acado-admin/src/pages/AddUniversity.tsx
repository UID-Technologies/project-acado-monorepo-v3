import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InstitutionType } from '@/types/university';
import { useToast } from '@/hooks/use-toast';
import { universitiesApi, UniversitySummary } from '@/api/universities.api';
import { uploadApi } from '@/api/upload.api';
import { LocationSelector } from '@/components/location/LocationSelector';
import type { LocationSelectorValue } from '@/components/location/LocationSelector';
import { validateImageFile } from '@/utils/fileValidation';

interface FormState {
  name: string;
  shortName: string;
  mobileNo: string;
  primaryEmail: string;
  website: string;
  status: 'Live' | 'Suspended';
  organizationLevel: string;
  institutionType: InstitutionType | '';
  description: string;
  address: string;
  country: string;
  state: string;
  city: string;
  parentInstitutionId: string;
  logoFile: File | null;
  templateImageFile: File | null;
  logoUrl?: string;
  templateImageUrl?: string;
}

const initialState: FormState = {
  name: '',
  shortName: '',
  mobileNo: '',
  primaryEmail: '',
  website: '',
  status: 'Live',
  organizationLevel: 'parent',
  institutionType: '',
  description: '',
  address: '',
  country: '',
  state: '',
  city: '',
  parentInstitutionId: '',
  logoFile: null,
  templateImageFile: null,
  logoUrl: undefined,
  templateImageUrl: undefined,
};

const AddUniversity = () => {
  const navigate = useNavigate();
  const { universityId } = useParams();
  const isEditMode = Boolean(universityId);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormState>(initialState);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [templatePreview, setTemplatePreview] = useState<string | null>(null);
  const [parentOptions, setParentOptions] = useState<UniversitySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        const universitiesResponse = await universitiesApi.getUniversities({ page: 1, pageSize: 200 });
        setParentOptions(universitiesResponse.data);

        if (isEditMode && universityId) {
          const university = await universitiesApi.getUniversity(universityId);
          setFormData((prev) => ({
            ...prev,
            name: university.name || '',
            shortName: university.shortName || '',
            mobileNo: university.contact?.mobileNo || '',
            primaryEmail: university.contact?.primaryEmail || '',
            website: university.contact?.website || '',
            status: (university.status as 'Live' | 'Suspended') || 'Live',
            organizationLevel: university.organizationLevel || 'parent',
            institutionType: university.institutionType || '',
            description: university.about?.description || '',
            address: university.address || '',
            country: university.location?.country || '',
            state: university.location?.state || '',
            city: university.location?.city || '',
            parentInstitutionId: university.parentInstitutionId || '',
            logoUrl: university.branding?.logoUrl,
            templateImageUrl: university.branding?.templateImageUrl,
            logoFile: null,
            templateImageFile: null,
          }));
        }
      } catch (err: any) {
        console.error('Failed to load university data', err);
        toast({
          title: 'Failed to load data',
          description: err?.response?.data?.error || err?.message || 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [isEditMode, toast, universityId]);

  const handleInputChange = (field: keyof FormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'logoFile' | 'templateImageFile', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file before setting it
      const validation = validateImageFile(file, 10);
      if (!validation.valid) {
        toast({
          title: 'Invalid File',
          description: validation.error,
          variant: 'destructive',
        });
        // Clear the input
        e.target.value = '';
        return;
      }
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleRemoveImage = (field: 'logo' | 'template') => {
    setFormData((prev) => ({
      ...prev,
      ...(field === 'logo'
        ? { logoFile: null, logoUrl: undefined }
        : { templateImageFile: null, templateImageUrl: undefined }),
    }));
  };

  useEffect(() => {
    if (formData.logoFile) {
      const objectUrl = URL.createObjectURL(formData.logoFile);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setLogoPreview(formData.logoUrl || null);
    return;
  }, [formData.logoFile, formData.logoUrl]);

  useEffect(() => {
    if (formData.templateImageFile) {
      const objectUrl = URL.createObjectURL(formData.templateImageFile);
      setTemplatePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setTemplatePreview(formData.templateImageUrl || null);
    return;
  }, [formData.templateImageFile, formData.templateImageUrl]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.primaryEmail || !formData.institutionType) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (Name, Primary Email, University Type)',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      let logoUrl = formData.logoUrl;
      let templateImageUrl = formData.templateImageUrl;

      // Upload logo file if present
      if (formData.logoFile) {
        try {
          console.log('Uploading logo file:', formData.logoFile.name);
          const upload = await uploadApi.uploadFile(formData.logoFile, 'logo');
          logoUrl = upload.url;
          console.log('Logo uploaded successfully:', logoUrl);
        } catch (uploadError: any) {
          console.error('Logo upload failed:', uploadError);
          throw new Error(`Logo upload failed: ${uploadError.response?.data?.error || uploadError.message || 'Unknown error'}`);
        }
      }

      // Upload template image if present
      if (formData.templateImageFile) {
        try {
          console.log('Uploading template image:', formData.templateImageFile.name);
          const upload = await uploadApi.uploadFile(formData.templateImageFile, 'template');
          templateImageUrl = upload.url;
          console.log('Template image uploaded successfully:', templateImageUrl);
        } catch (uploadError: any) {
          console.error('Template image upload failed:', uploadError);
          throw new Error(`Template image upload failed: ${uploadError.response?.data?.error || uploadError.message || 'Unknown error'}`);
        }
      }

      const payload = {
        name: formData.name,
        shortName: formData.shortName,
        institutionType: formData.institutionType,
        status: formData.status,
        organizationLevel: formData.organizationLevel || 'parent',
        parentInstitutionId: formData.parentInstitutionId || null,
        tagline: '',
        contact: {
          primaryEmail: formData.primaryEmail,
          mobileNo: formData.mobileNo,
          website: formData.website,
        },
        address: formData.address,
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
          campuses: [],
        },
        branding: {
          logoUrl,
          templateImageUrl,
        },
        about: {
          description: formData.description,
          mission: '',
          values: [],
          highlights: [],
        },
        factsAndFigures: {
          totalStudents: 0,
          internationalStudents: 0,
          staffMembers: 0,
          alumniCount: 0,
          internationalPartnerships: 0,
          partnerCountries: 0,
          graduateEmployability: 0,
          annualGraduates: 0,
          researchBudget: 0,
        },
        community: {
          description: '',
          studentCount: 0,
          facultyCount: 0,
          alumniInCountries: 0,
          activeProjects: 0,
        },
        fieldsOfEducation: [],
        socialResponsibility: {
          description: '',
          commitments: [],
          initiatives: [],
        },
        testimonials: [],
        tags: {
          isVerified: false,
        },
        isActive: true,
      };

      if (isEditMode && universityId) {
        await universitiesApi.updateUniversity(universityId, payload);
        toast({
          title: 'University updated',
          description: 'The university information has been saved successfully.',
        });
      } else {
        await universitiesApi.createUniversity(payload);
        toast({
          title: 'University created',
          description: 'A new university has been added successfully.',
        });
      }

      navigate('/universities');
    } catch (err: any) {
      console.error('Failed to save university', err);
      toast({
        title: 'Failed to save university',
        description: err?.response?.data?.error || err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const availableParentOptions = parentOptions.filter((option) => {
    if (!isEditMode || !universityId) return true;
    return option.id !== universityId;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/universities')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Edit University' : 'Create University'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? 'Update university information' : 'Add basic information to create a new university'}
            </p>
          </div>
        </div>
        <Button className="gap-2" onClick={handleSubmit} disabled={loading || initialLoading}>
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : isEditMode ? 'Update University' : 'Save University'}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter university name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                    disabled={initialLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="shortName">Short Name</Label>
                  <Input
                    id="shortName"
                    placeholder="Enter university short name"
                    value={formData.shortName}
                    onChange={(e) => handleInputChange('shortName', e.target.value)}
                    className="mt-1"
                    disabled={initialLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="mobileNo">Mobile No.</Label>
                  <Input
                    id="mobileNo"
                    placeholder="Enter mobile number"
                    value={formData.mobileNo}
                    onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                    className="mt-1"
                    disabled={initialLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="primaryEmail">
                    Primary email / Username <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    placeholder="Enter email"
                    value={formData.primaryEmail}
                    onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                    className="mt-1"
                    disabled={initialLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="mt-1"
                    disabled={initialLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="organizationLevel">University Level</Label>
                  <Select
                    value={formData.organizationLevel}
                    onValueChange={(value) => handleInputChange('organizationLevel', value)}
                    disabled={initialLoading}
                  >
                    <SelectTrigger id="organizationLevel" className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Internal (Child)</SelectItem>
                      <SelectItem value="branch">Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value as 'Live' | 'Suspended')}
                    disabled={initialLoading}
                  >
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="institutionType">
                    University Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.institutionType}
                    onValueChange={(value: InstitutionType) => handleInputChange('institutionType', value)}
                    disabled={initialLoading}
                  >
                    <SelectTrigger id="institutionType" className="mt-1">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="COE">COE (Center of Excellence)</SelectItem>
                      <SelectItem value="Industry">Industry</SelectItem>
                      <SelectItem value="School">School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="parentInstitution">Parent University</Label>
                  <Select
                    value={formData.parentInstitutionId ? formData.parentInstitutionId : 'none'}
                    onValueChange={(value) =>
                      handleInputChange('parentInstitutionId', value === 'none' ? '' : value)
                    }
                    disabled={initialLoading}
                  >
                    <SelectTrigger id="parentInstitution" className="mt-1">
                      <SelectValue placeholder="Select Parent Institution (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Main Institution)</SelectItem>
                      {availableParentOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select if this is a branch or campus of another university
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 min-h-[100px]"
                  disabled={initialLoading}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-1"
                  disabled={initialLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <LocationSelector
                  value={{
                    country: formData.country,
                    state: formData.state,
                    city: formData.city,
                  }}
                  onChange={(location: LocationSelectorValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: location.country,
                      state: location.state,
                      city: location.city,
                    }))
                  }
                  disabled={initialLoading}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>
                  Add University Logo <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                  <div className="w-24 h-24 bg-background rounded-lg flex items-center justify-center mb-3 overflow-hidden border">
                    {logoPreview ? (
                      <img src={logoPreview} alt="University logo preview" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="gap-2" asChild disabled={initialLoading}>
                      <label htmlFor="logo">
                        <Upload className="w-4 h-4" />
                        {formData.logoFile ? 'Replace image' : 'Upload image'}
                      </label>
                    </Button>
                    {(formData.logoFile || formData.logoUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveImage('logo')}
                        disabled={initialLoading}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    id="logo"
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg,.webp"
                    className="hidden"
                    onChange={(e) => handleFileChange('logoFile', e)}
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Recommended format: PNG, SVG, JPG, WEBP. Max size 10MB.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add Template Image</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                  <div className="w-32 h-20 bg-background rounded-lg flex items-center justify-center mb-3 overflow-hidden border">
                    {templatePreview ? (
                      <img
                        src={templatePreview}
                        alt="Template preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="gap-2" asChild disabled={initialLoading}>
                      <label htmlFor="templateImage">
                        <Upload className="w-4 h-4" />
                        {formData.templateImageFile ? 'Replace image' : 'Upload image'}
                      </label>
                    </Button>
                    {(formData.templateImageFile || formData.templateImageUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveImage('template')}
                        disabled={initialLoading}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    id="templateImage"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => handleFileChange('templateImageFile', e)}
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Recommended size 1920x1080px. JPG, PNG or WEBP up to 10MB.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-dashed p-6 bg-muted/30 flex flex-col items-center justify-center text-center">
                <Building2 className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Rich university setup (campuses, narratives, metrics) can be configured after creating
                  the university.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUniversity;

