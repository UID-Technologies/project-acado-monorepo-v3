import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Camera, Globe, Mail, MapPin, Phone, Save, Upload, Loader2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { universitiesApi } from '@/api/universities.api';
import { uploadApi } from '@/api/upload.api';
import { validateImageFile } from '@/utils/fileValidation';
import type { UniversityDetails } from '@/types/university';

const UniversityInfo = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [universityData, setUniversityData] = useState<UniversityDetails | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Fetch university data on mount
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        setLoading(true);
        
        // Get the first university ID from user's universityIds
        const universityId = user?.universityIds?.[0];
        
        if (!universityId) {
          toast({
            title: 'No University Assigned',
            description: 'Your account is not associated with any university.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        console.log('Fetching university data for ID:', universityId);
        const data = await universitiesApi.getUniversity(universityId);
        console.log('University data loaded:', data);
        
        setUniversityData(data);
      } catch (error: any) {
        console.error('Failed to load university data:', error);
        toast({
          title: 'Error Loading University Data',
          description: error?.response?.data?.error || error?.message || 'Failed to fetch university information',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUniversityData();
    }
  }, [user]);

  const handleSave = async () => {
    if (!universityData) return;

    try {
      setSaving(true);
      
      // Prepare update payload
      const updatePayload = {
        name: universityData.name,
        shortName: universityData.shortName,
        description: universityData.description,
        motto: universityData.motto,
        website: universityData.website,
        email: universityData.email,
        phone: universityData.phone,
        yearFounded: universityData.yearFounded,
        institutionType: universityData.institutionType,
        location: {
          address: universityData.location?.address,
          city: universityData.location?.city,
          state: universityData.location?.state,
          country: universityData.location?.country,
          postalCode: universityData.location?.postalCode,
        },
        branding: {
          logoUrl: universityData.branding?.logoUrl,
          templateImageUrl: universityData.branding?.templateImageUrl,
          primaryColor: universityData.branding?.primaryColor,
          secondaryColor: universityData.branding?.secondaryColor,
        },
      };

      console.log('Updating university with payload:', updatePayload);
      await universitiesApi.updateUniversity(universityData.id, updatePayload);

      toast({
        title: "University Information Updated",
        description: "Your university profile has been successfully updated.",
      });
      
      // Trigger layout refresh by navigating to trigger useEffect
      window.dispatchEvent(new Event('universityUpdated'));
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update university:', error);
      toast({
        title: 'Update Failed',
        description: error?.response?.data?.error || error?.message || 'Failed to update university information',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !universityData) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: 'Invalid File',
        description: validation.error,
        variant: 'destructive',
      });
      event.target.value = '';
      return;
    }

    try {
      setUploadingLogo(true);
      console.log('Uploading logo:', file.name);

      const response = await uploadApi.uploadFile(file, 'logoFile');
      console.log('Logo upload response:', response);

      if (response.url) {
        // Update university data with new logo URL
        setUniversityData({
          ...universityData,
          branding: {
            ...universityData.branding,
            logoUrl: response.url,
          },
        });

        // Save to backend
        await universitiesApi.updateUniversity(universityData.id, {
          branding: {
            ...universityData.branding,
            logoUrl: response.url,
          },
        });

        toast({
          title: 'Logo Updated',
          description: 'University logo has been successfully updated.',
        });
      }
    } catch (error: any) {
      console.error('Logo upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error?.response?.data?.error || error?.message || 'Failed to upload logo',
        variant: 'destructive',
      });
    } finally {
      setUploadingLogo(false);
      event.target.value = '';
    }
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !universityData) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: 'Invalid File',
        description: validation.error,
        variant: 'destructive',
      });
      event.target.value = '';
      return;
    }

    try {
      setUploadingCover(true);
      console.log('Uploading cover image:', file.name);

      const response = await uploadApi.uploadFile(file, 'templateImageFile');
      console.log('Cover upload response:', response);

      if (response.url) {
        // Update university data with new cover URL
        setUniversityData({
          ...universityData,
          branding: {
            ...universityData.branding,
            templateImageUrl: response.url,
          },
        });

        // Save to backend
        await universitiesApi.updateUniversity(universityData.id, {
          branding: {
            ...universityData.branding,
            templateImageUrl: response.url,
          },
        });

        toast({
          title: 'Cover Image Updated',
          description: 'University cover image has been successfully updated.',
        });
      }
    } catch (error: any) {
      console.error('Cover upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error?.response?.data?.error || error?.message || 'Failed to upload cover image',
        variant: 'destructive',
      });
    } finally {
      setUploadingCover(false);
      event.target.value = '';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading university information...</p>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!universityData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No University Data</h2>
          <p className="text-muted-foreground">Unable to load university information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">University Information</h1>
          <p className="text-muted-foreground mt-1">Manage your university profile and settings</p>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                // Reload data to reset changes
                const fetchData = async () => {
                  if (!user?.universityIds?.[0]) return;
                  const data = await universitiesApi.getUniversity(user.universityIds[0]);
                  setUniversityData(data);
                };
                fetchData();
              }}
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              'Edit Profile'
            )}
          </Button>
        </div>
      </div>

      {/* Cover Image Section */}
      <Card className="relative overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 relative">
          {universityData.branding?.templateImageUrl && (
            <img
              src={universityData.branding.templateImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
          <Button
            onClick={() => coverInputRef.current?.click()}
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4"
            disabled={uploadingCover}
          >
            {uploadingCover ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Change Cover
              </>
            )}
          </Button>
        </div>
        <div className="absolute bottom-0 left-6 translate-y-1/2">
          <div className="relative">
            <div className="h-24 w-24 bg-white rounded-lg shadow-lg border-4 border-background flex items-center justify-center">
              {universityData.branding?.logoUrl ? (
                <img
                  src={universityData.branding.logoUrl}
                  alt="Logo"
                  className="h-20 w-20 object-contain"
                />
              ) : (
                <Building2 className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <Button
              onClick={() => logoInputRef.current?.click()}
              variant="secondary"
              size="icon"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              disabled={uploadingLogo}
            >
              {uploadingLogo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="mt-16">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Core details about your university</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>University Name</Label>
              <Input
                value={universityData.name || ''}
                onChange={(e) => setUniversityData({...universityData, name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label>Short Name</Label>
              <Input
                value={universityData.shortName || ''}
                onChange={(e) => setUniversityData({...universityData, shortName: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label>Founded</Label>
              <Input
                value={universityData.yearFounded?.toString() || ''}
                onChange={(e) => setUniversityData({...universityData, yearFounded: parseInt(e.target.value) || undefined})}
                disabled={!isEditing}
                type="number"
              />
            </div>
            <div>
              <Label>Institution Type</Label>
              <Select
                value={universityData.institutionType || 'University'}
                onValueChange={(value: any) => setUniversityData({...universityData, institutionType: value})}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="University">University</SelectItem>
                  <SelectItem value="COE">Centre of Excellence</SelectItem>
                  <SelectItem value="Industry">Industry</SelectItem>
                  <SelectItem value="School">School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Motto</Label>
              <Input
                value={universityData.motto || ''}
                onChange={(e) => setUniversityData({...universityData, motto: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={universityData.description || ''}
                onChange={(e) => setUniversityData({...universityData, description: e.target.value})}
                disabled={!isEditing}
                rows={4}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Status</Label>
              <Badge variant={universityData.status === 'Active' ? 'default' : 'secondary'}>
                {universityData.status || 'Unknown'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How to reach your university</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={universityData.website || ''}
                  onChange={(e) => setUniversityData({...universityData, website: e.target.value})}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={universityData.email || ''}
                  onChange={(e) => setUniversityData({...universityData, email: e.target.value})}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={universityData.phone || ''}
                  onChange={(e) => setUniversityData({...universityData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Country</Label>
              <Input
                value={universityData.location?.country || ''}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  location: {...universityData.location, country: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Street"
                value={universityData.location?.address || ''}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  location: {...universityData.location, address: e.target.value}
                })}
                disabled={!isEditing}
              />
              <Input
                placeholder="City"
                value={universityData.location?.city || ''}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  location: {...universityData.location, city: e.target.value}
                })}
                disabled={!isEditing}
              />
              <Input
                placeholder="State/Province"
                value={universityData.location?.state || ''}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  location: {...universityData.location, state: e.target.value}
                })}
                disabled={!isEditing}
              />
              <Input
                placeholder="ZIP/Postal Code"
                value={universityData.location?.postalCode || ''}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  location: {...universityData.location, postalCode: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {universityData.rankingInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Ranking Information</CardTitle>
            <CardDescription>University rankings and recognition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {universityData.rankingInfo.worldRanking && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">World Ranking:</span>
                  <span className="font-semibold">{universityData.rankingInfo.worldRanking}</span>
                </div>
              )}
              {universityData.rankingInfo.nationalRanking && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">National Ranking:</span>
                  <span className="font-semibold">{universityData.rankingInfo.nationalRanking}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accreditations */}
      {universityData.accreditations && universityData.accreditations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Accreditations</CardTitle>
            <CardDescription>Official accreditations and certifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {universityData.accreditations.map((accreditation, index) => (
                <Badge key={index} variant="secondary" className="py-1 px-3">
                  {accreditation}
                </Badge>
              ))}
              {isEditing && (
                <Button variant="outline" size="sm">
                  + Add Accreditation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UniversityInfo;