import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Download,
  Home,
  FileText,
  Building,
  GraduationCap,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  Clock,
  X
} from "lucide-react";
import { applicationsApi } from "@/api/applications.api";
import { formsApi, ConfiguredField } from "@/api/forms.api";
import { universitiesApi } from "@/api/universities.api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

const fileIconClasses = "h-8 w-8 text-muted-foreground";
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const documentExtensions = ['pdf', 'doc', 'docx'];

const ApplicationSuccess = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [application, setApplication] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get organization name from logged-in user
  const getUserOrganizationName = () => {
    const userStr = localStorage.getItem("user");
    const userAuthStr = localStorage.getItem("userAuth");
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.universityName || user.organizationName || (user as any)?.organization_name || "University";
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    } else if (userAuthStr) {
      try {
        const userAuth = JSON.parse(userAuthStr);
        return userAuth.universityName || userAuth.organizationName || userAuth.organization_name || "University";
      } catch (err) {
        console.error('Error parsing userAuth data:', err);
      }
    }
    return "University";
  };
  
  const organizationName = getUserOrganizationName();

  // Get data from navigation state (if passed directly)
  const stateData = location.state;

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If we have state data, use it
        if (stateData?.application) {
          setApplication(stateData.application);
          
          // Fetch related data
          if (stateData.application.formId) {
            try {
              const formData = await formsApi.getFormById(stateData.application.formId);
              setForm(formData);
              
              // Fetch courses (university name comes from user's organization)
              // Don't fail the whole page if course fetching fails
              if (formData.courseIds && formData.courseIds.length > 0) {
                try {
                  const coursesData = await Promise.allSettled(
                    formData.courseIds.map((id: string) => 
                      universitiesApi.getCourseById(Number(id))
                    )
                  );
                  const successfulCourses = coursesData
                    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
                    .map(result => result.value)
                    .filter(course => course !== null);
                  setCourses(successfulCourses);
                  
                  // Log failed course fetches but don't throw
                  const failedCourses = coursesData.filter(result => result.status === 'rejected');
                  if (failedCourses.length > 0) {
                    console.warn('Some courses failed to load:', failedCourses);
                  }
                } catch (courseErr) {
                  console.warn('Failed to fetch courses (non-blocking):', courseErr);
                  // Continue without courses - don't set error
                }
              }
            } catch (formErr) {
              console.warn('Failed to fetch form data (non-blocking):', formErr);
              // Continue without form data
            }
          }
        } else if (applicationId) {
          // Fetch from API using applicationId
          const appData = await applicationsApi.getApplicationById(applicationId);
          setApplication(appData);
          
          if (appData.formId) {
            try {
              const formData = await formsApi.getFormById(appData.formId);
              setForm(formData);
              
              // Fetch courses (university name comes from user's organization)
              // Don't fail the whole page if course fetching fails
              if (formData.courseIds && formData.courseIds.length > 0) {
                try {
                  const coursesData = await Promise.allSettled(
                    formData.courseIds.map((id: string) => 
                      universitiesApi.getCourseById(Number(id))
                    )
                  );
                  const successfulCourses = coursesData
                    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
                    .map(result => result.value)
                    .filter(course => course !== null);
                  setCourses(successfulCourses);
                  
                  // Log failed course fetches but don't throw
                  const failedCourses = coursesData.filter(result => result.status === 'rejected');
                  if (failedCourses.length > 0) {
                    console.warn('Some courses failed to load:', failedCourses);
                  }
                } catch (courseErr) {
                  console.warn('Failed to fetch courses (non-blocking):', courseErr);
                  // Continue without courses - don't set error
                }
              }
            } catch (formErr) {
              console.warn('Failed to fetch form data (non-blocking):', formErr);
              // Continue without form data
            }
          }
        }
      } catch (err: any) {
        console.error('❌ Error fetching application:', {
          error: err,
          status: err.response?.status,
          message: err.message,
          applicationId,
          hasStateData: !!stateData?.application
        });
        
        // Only set error for critical failures (application not found, auth errors)
        if (err.response?.status === 404) {
          setError('Application not found. It may have been deleted.');
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Authentication required. Please log in again.');
        } else {
          setError(err.message || 'Failed to load application details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [applicationId, stateData]);

  // Format field value for display
  const formatFieldValue = (field: ConfiguredField, value: any): ReactNode => {
    if (value === undefined || value === null || value === '') return <span className="text-muted-foreground">N/A</span>;

    if (field.type === 'file') {
      const fileUrl = typeof value === 'string' ? value : value?.fileUrl || value?.url;
      if (!fileUrl) return <span className="text-muted-foreground">No file provided</span>;

      const decodedUrl = decodeURIComponent(fileUrl);
      const fileName = decodedUrl.split('/').pop() || 'document';
      const extension = (fileName.split('.').pop() || '').toLowerCase();
      const isImage = imageExtensions.includes(extension);
      const isDocument = documentExtensions.includes(extension);

      return (
        <div className="flex items-center gap-3 rounded-md border border-muted p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
            {isImage ? (
              <img
                src={fileUrl}
                alt={fileName}
                className="h-12 w-12 rounded object-cover"
                onError={(event) => {
                  const target = event.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<svg class="${fileIconClasses}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4-4 4 4 4-4 4 4" /></svg>`;
                  }
                }}
              />
            ) : (
              <FileText className={fileIconClasses} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{fileName}</p>
            <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
              {isImage && <span>Image</span>}
              {isDocument && !isImage && <span>{extension.toUpperCase()}</span>}
            </div>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              View
            </a>
          </Button>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (field.type === 'date' && value) {
      try {
        return format(new Date(value), 'MMM dd, yyyy');
      } catch {
        return value;
      }
    }
    return value.toString();
  };

  // Group fields by category
  const getFieldsByCategory = () => {
    if (!form || !application) return {};
    
    const fieldsByCategory: Record<string, Array<{ field: ConfiguredField; value: any }>> = {};
    
    form.fields.forEach((field: ConfiguredField) => {
      const value = application.formData?.[field.name];
      if (value !== undefined && value !== null && value !== '') {
        const categoryId = field.categoryId;
        const categoryName = field.categoryName || categoryId;
        
        if (!fieldsByCategory[categoryName]) {
          fieldsByCategory[categoryName] = [];
        }
        fieldsByCategory[categoryName].push({ field, value });
      }
    });
    
    return fieldsByCategory;
  };

  const fieldsByCategory = getFieldsByCategory();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              {error || 'Application not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                window.close();
                setTimeout(() => {
                  if (!document.hidden) {
                    alert('Please close this tab manually.');
                  }
                }, 500);
              }} 
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8 animate-in fade-in duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Application Submitted Successfully!
          </h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your application. We'll review it and get back to you soon.
          </p>
        </div>

        {/* Application ID Alert */}
        <Alert className="mb-6 border-primary/20 bg-primary/5">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription className="ml-2">
            <span className="font-medium">Application ID:</span>{' '}
            <span className="font-mono text-primary">{application.id || application._id}</span>
            <p className="text-xs text-muted-foreground mt-1">
              Please save this ID for your records
            </p>
          </AlertDescription>
        </Alert>

        {/* Application Summary */}
        <Card className="mb-6 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">University</p>
                  <p className="font-medium">{organizationName}</p>
                </div>
              </div>
              
              {courses.length > 0 && (
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Course{courses.length > 1 ? 's' : ''}</p>
                    {courses.map((course, idx) => (
                      <p key={idx} className="font-medium">{course.name}</p>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Submitted On</p>
                  <p className="font-medium">
                    {application.createdAt 
                      ? format(new Date(application.createdAt), 'MMMM dd, yyyy')
                      : format(new Date(), 'MMMM dd, yyyy')
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {application.createdAt 
                      ? format(new Date(application.createdAt), 'hh:mm a')
                      : format(new Date(), 'hh:mm a')
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className="mt-1">
                    {application.status || 'Submitted'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submitted Data */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Submitted Information
            </CardTitle>
            <CardDescription>
              Review the information you provided
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(fieldsByCategory).map(([categoryName, fields], idx) => (
              <div key={idx}>
                {idx > 0 && <Separator className="my-6" />}
                <div>
                  <h3 className="font-semibold text-base mb-4 text-primary">
                    {categoryName}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {fields.map(({ field, value }) => (
                      <div key={field.name} className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {field.customLabel || field.label}
                        </p>
                        <p className="font-medium">{formatFieldValue(field, value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Application Review</p>
                  <p className="text-sm text-muted-foreground">
                    Our admissions team will review your application within 5-7 business days.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Email Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a confirmation email with your application details.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Track Your Application</p>
                  <p className="text-sm text-muted-foreground">
                    Check your dashboard to track the status of your application.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              // Close the current tab
              window.close();
              
              // If the tab doesn't close (due to browser security), show a message
              // This happens when the tab was not opened by JavaScript
              setTimeout(() => {
                // Check if window is still open
                if (!document.hidden) {
                  alert('Please close this tab manually. Browsers prevent closing tabs that were not opened by JavaScript.');
                }
              }, 500);
            }}
            variant="default"
            size="lg"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>

        {/* Support Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{' '}
            <a href="mailto:support@university.edu" className="text-primary hover:underline">
              support@university.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccess;

