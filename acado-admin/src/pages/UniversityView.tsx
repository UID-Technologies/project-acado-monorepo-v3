import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Edit,
  Mail,
  MapPin,
  Phone,
  Globe,
  Users,
  GraduationCap,
  FileText,
  Award,
  Calendar,
  Link as LinkIcon,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { universitiesApi } from '@/api/universities.api';
import { useToast } from '@/hooks/use-toast';
import { UniversityDetails as UniversityDetailsType, InstitutionType } from '@/types/university';

const UniversityView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { universityId } = useParams();
  const [university, setUniversity] = useState<UniversityDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const loadUniversity = async () => {
      if (!universityId) return;
      try {
        setLoading(true);
        const data = await universitiesApi.getUniversity(universityId);
        setUniversity(data);
      } catch (err: any) {
        console.error('Failed to load university', err);
        toast({
          title: 'Failed to load organization',
          description: err?.response?.data?.error || err?.message || 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadUniversity();
  }, [toast, universityId]);

  const getTypeColor = (type?: InstitutionType | string) => {
    const normalized = (type || 'university').toLowerCase();
    switch (normalized) {
      case 'university':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'coe':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'industry':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'school':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleStatusToggle = async (nextChecked: boolean) => {
    if (!universityId || !university) return;
    try {
      setStatusUpdating(true);
      const nextStatus: 'Active' | 'Suspended' = nextChecked ? 'Suspended' : 'Active';
      const updated = await universitiesApi.updateStatus(universityId, nextStatus);
      setUniversity(updated);
      toast({
        title: nextStatus === 'Suspended' ? 'University suspended' : 'University reinstated',
        description:
          nextStatus === 'Suspended'
            ? 'This university is now suspended and hidden from active workflows.'
            : 'University status set to Active.',
      });
    } catch (err: any) {
      toast({
        title: 'Failed to update status',
        description: err?.response?.data?.error || err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading university details...</p>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">University not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/universities')} className="hover-scale">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{university.name}</h1>
                <Badge className={getTypeColor(university.institutionType)}>
                  {university.institutionType || 'University'}
                </Badge>
                {university.tags?.isVerified && (
                  <Badge variant="outline" className="gap-1">
                    <Award className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
                <Badge
                  variant={university.status === 'Suspended' ? 'destructive' : 'default'}
                  className="flex items-center gap-1"
                >
                  {university.status === 'Suspended' ? (
                    <ShieldAlert className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  {university.status ?? 'Active'}
                </Badge>
              </div>
              {university.tagline && (
                <p className="text-sm text-muted-foreground mt-1 italic">"{university.tagline}"</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2 rounded-lg border border-muted px-3 py-1 text-xs text-muted-foreground">
            <span>Status</span>
            <Switch
              checked={university.status === 'Suspended'}
              onCheckedChange={handleStatusToggle}
              disabled={statusUpdating}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/universities/edit/${university.id}`)}
            className="gap-2"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button size="sm" onClick={() => navigate(`/universities/${university.id}/details`)} className="gap-2">
            <Building2 className="w-3.5 h-3.5" />
            Manage
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {university.rating && (
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{university.rating}</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </Card>
        )}
        {university.rank && (
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-primary">#{university.rank}</p>
            <p className="text-xs text-muted-foreground">Rank</p>
          </Card>
        )}
        {university.factsAndFigures.totalStudents > 0 && (
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{(university.factsAndFigures.totalStudents / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </Card>
        )}
        {university.factsAndFigures.internationalStudents > 0 && (
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{(university.factsAndFigures.internationalStudents / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground">International</p>
          </Card>
        )}
        {university.foundedYear && (
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{university.foundedYear}</p>
            <p className="text-xs text-muted-foreground">Founded</p>
          </Card>
        )}
        {university.factsAndFigures.graduateEmployability > 0 && (
          <Card className="p-4 text-center hover:shadow-md transition-shadow">
            <GraduationCap className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{university.factsAndFigures.graduateEmployability}%</p>
            <p className="text-xs text-muted-foreground">Employability</p>
          </Card>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {university.organizationLevel && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">University Level</p>
                    <p className="font-medium capitalize">{university.organizationLevel}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Institution Type</p>
                  <Badge className={getTypeColor(university.institutionType)}>
                    {university.institutionType || 'University'}
                  </Badge>
                </div>
                {university.foundedYear && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p className="font-medium">{university.foundedYear}</p>
                  </div>
                )}
                {university.rating && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <p className="font-medium">{university.rating}</p>
                    </div>
                  </div>
                )}
                {university.rank && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rank</p>
                    <p className="font-medium">#{university.rank}</p>
                  </div>
                )}
                {university.parentInstitution && (
                  <div className="space-y-1 md:col-span-3">
                    <p className="text-sm text-muted-foreground">Parent Institution</p>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-primary" />
                      <button
                        onClick={() => navigate(`/universities/${university.parentInstitution.id}/view`)}
                        className="font-medium text-primary hover:underline"
                      >
                        {university.parentInstitution.name}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {university.about?.description && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.about.description}</p>
              </CardContent>
            </Card>
          )}

          {university.about?.mission && (
            <Card>
              <CardHeader>
                <CardTitle>Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.about.mission}</p>
              </CardContent>
            </Card>
          )}

          {university.about?.values && university.about.values.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Core Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {university.about.values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="px-4 py-2">
                      {value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {university.contact?.primaryEmail && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Primary Email</p>
                      <a href={`mailto:${university.contact.primaryEmail}`} className="font-medium hover:text-primary">
                        {university.contact.primaryEmail}
                      </a>
                    </div>
                  </div>
                )}
                {university.contact?.mobileNo && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile Number</p>
                      <a href={`tel:${university.contact.mobileNo}`} className="font-medium hover:text-primary">
                        {university.contact.mobileNo}
                      </a>
                    </div>
                  </div>
                )}
                {university.contact?.website && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a
                        href={university.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {university.contact.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  {university.address && <p className="font-medium">{university.address}</p>}
                  <p className="text-sm text-muted-foreground">
                    {[university.location?.city, university.location?.state, university.location?.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {university.whyThisUniversity && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Why This University
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.whyThisUniversity}</p>
              </CardContent>
            </Card>
          )}

          {university.admission && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Admission Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.admission}</p>
              </CardContent>
            </Card>
          )}

          {university.placements && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Placements &amp; Career
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.placements}</p>
              </CardContent>
            </Card>
          )}

          {university.fieldsOfEducation && university.fieldsOfEducation.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fields of Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {university.fieldsOfEducation.map((field) => (
                    <div key={field.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2">{field.name}</h4>
                      {field.description && (
                        <p className="text-sm text-muted-foreground mb-3">{field.description}</p>
                      )}
                      {field.programs && field.programs.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {field.programs.map((program, idx) => (
                            <Badge key={idx} variant="outline">
                              {program}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          {university.factsAndFigures && (
            <Card>
              <CardHeader>
                <CardTitle>Facts &amp; Figures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {university.factsAndFigures.totalStudents > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.totalStudents.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total Students</p>
                    </div>
                  )}
                  {university.factsAndFigures.internationalStudents > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <Globe className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.internationalStudents.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">International Students</p>
                    </div>
                  )}
                  {university.factsAndFigures.staffMembers > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.staffMembers.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Staff Members</p>
                    </div>
                  )}
                  {university.factsAndFigures.alumniCount > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.alumniCount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Alumni</p>
                    </div>
                  )}
                  {university.factsAndFigures.internationalPartnerships > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <LinkIcon className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.internationalPartnerships.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Partnerships</p>
                    </div>
                  )}
                  {university.factsAndFigures.graduateEmployability > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <Award className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.graduateEmployability}%</p>
                      <p className="text-sm text-muted-foreground mt-1">Employability</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {university.community && (
            <Card>
              <CardHeader>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                {university.community.description && (
                  <p className="mb-4 leading-relaxed">{university.community.description}</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">
                      {university.community.studentCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Students</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">
                      {university.community.facultyCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Faculty</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{university.community.alumniInCountries}</p>
                    <p className="text-xs text-muted-foreground mt-1">Countries</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{university.community.activeProjects}</p>
                    <p className="text-xs text-muted-foreground mt-1">Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="additional" className="space-y-6">
          {university.branding?.brochureUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={university.branding.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  View Brochure
                </a>
              </CardContent>
            </Card>
          )}

          {university.faq && (
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.faq}</p>
              </CardContent>
            </Card>
          )}

          {university.testimonials && university.testimonials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {university.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-primary bg-muted/30 p-4 rounded-r-lg">
                      <p className="italic leading-relaxed">{testimonial}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {university.socialResponsibility && (
            <Card>
              <CardHeader>
                <CardTitle>Social Responsibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {university.socialResponsibility.description && (
                  <p className="leading-relaxed">{university.socialResponsibility.description}</p>
                )}
                {university.socialResponsibility.commitments && university.socialResponsibility.commitments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Commitments</h4>
                    <div className="flex flex-wrap gap-2">
                      {university.socialResponsibility.commitments.map((commitment, idx) => (
                        <Badge key={idx} variant="secondary">
                          {commitment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {university.socialResponsibility.initiatives && university.socialResponsibility.initiatives.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Initiatives</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {university.socialResponsibility.initiatives.map((initiative, idx) => (
                        <li key={idx}>{initiative}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {university.about?.highlights && university.about.highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {university.about.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversityView;

