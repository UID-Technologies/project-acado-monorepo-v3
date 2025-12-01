import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  ArrowRight,
  Download,
  MessageSquare,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { applicationsApi, Application } from "@/api/applications.api";
import { formsApi } from "@/api/forms.api";
import { universitiesApi } from "@/api/universities.api";
import { format } from "date-fns";

interface EnrichedApplication extends Application {
  formName?: string;
  universityName?: string;
  courseName?: string;
}

const MyApplications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState<EnrichedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user ID and organization name from localStorage
        const userStr = localStorage.getItem('user');
        const userAuthStr = localStorage.getItem('userAuth');
        
        let userId = '';
        let organizationName = 'University';
        
        if (userStr) {
          const user = JSON.parse(userStr);
          userId = user.id || user._id || '';
          organizationName = user.universityName || user.organizationName || user.organization_name || organizationName;
        } else if (userAuthStr) {
          const userAuth = JSON.parse(userAuthStr);
          userId = userAuth.id || userAuth._id || '';
          organizationName = userAuth.universityName || userAuth.organizationName || userAuth.organization_name || organizationName;
        }
        
        if (!userId) {
          setError('User not authenticated');
          return;
        }
        
        // Fetch user's applications
        const { applications: apps } = await applicationsApi.getApplications({ userId });
        
        // Enrich applications with form and course data (university name comes from user's organization)
        const enrichedApps = await Promise.all(
          apps.map(async (app) => {
            const enriched: EnrichedApplication = { ...app };
            
            try {
              // Fetch form data
              if (app.formId) {
                const form = await formsApi.getFormById(app.formId);
                enriched.formName = form.title || form.name;
                
                // Use organization name from user's profile instead of fetching university
                enriched.universityName = organizationName;
                
                // Fetch course data
                if (app.courseId) {
                  try {
                    const course = await universitiesApi.getCourseById(app.courseId);
                    enriched.courseName = course.name;
                  } catch (err) {
                    console.error('Error fetching course:', err);
                  }
                }
              }
            } catch (err) {
              console.error('Error enriching application:', err);
            }
            
            return enriched;
          })
        );
        
        setApplications(enrichedApps);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError(err.message || 'Failed to load applications');
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app =>
    (app.courseName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (app.universityName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (app.formName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  // Format date for display
  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return date;
    }
  };
  
  // Calculate progress (mock for now - can be enhanced later)
  const getProgress = (app: EnrichedApplication) => {
    if (app.status === 'draft') return 45;
    if (app.status === 'submitted' || app.status === 'under_review') return 100;
    return 100;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under-review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      accepted: "default",
      rejected: "destructive",
      "under-review": "secondary",
      draft: "outline"
    };

    return (
      <Badge variant={variants[status] || "outline"} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const handleViewApplication = (appId: string) => {
    navigate(`/user/applications/${appId}`);
  };

  const handleContinueApplication = (appId: string) => {
    navigate(`/user/apply/${appId}`);
  };

  const handleViewMessages = (appId: string) => {
    navigate(`/user/communications/${appId}`);
  };

  const handleDownloadLetter = (app: any) => {
    toast.success(`Downloading acceptance letter for ${app.courseName}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Applications</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track and manage all your university applications
          {applications.length > 0 && ` (${applications.length} total)`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by course or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t submitted any applications yet'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate('/user/courses')}>
                    Browse Courses
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {app.courseName || app.formName || 'Application'}
                          </h3>
                          <p className="text-muted-foreground">
                            {app.universityName || 'University'}
                          </p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <p className="font-medium">{getProgress(app)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{formatDate(app.updatedAt)}</p>
                        </div>
                        {app.submittedAt && (
                          <div>
                            <p className="text-muted-foreground">Submitted</p>
                            <p className="font-medium">{formatDate(app.submittedAt)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">{formatDate(app.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {app.status === 'draft' ? (
                          <Button 
                            size="sm"
                            onClick={() => handleContinueApplication(app.formId)}
                          >
                            Continue Application
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewApplication(app.id)}
                          >
                            View Application
                          </Button>
                        )}
                        
                        {app.status === 'accepted' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadLetter(app)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Acceptance Letter
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {filteredApplications.filter(app => app.status === 'draft').length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No draft applications</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.filter(app => app.status === 'draft').map((app) => (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {app.courseName || app.formName || 'Application'}
                      </h3>
                      <p className="text-muted-foreground">
                        {app.universityName || 'University'}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Progress: {getProgress(app)}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${getProgress(app)}%` }}
                      />
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleContinueApplication(app.formId)}
                  >
                    Continue Application
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {filteredApplications.filter(app => app.status === 'submitted' || app.status === 'under_review').length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No submitted applications</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.filter(app => app.status === 'submitted' || app.status === 'under_review').map((app) => (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {app.courseName || app.formName || 'Application'}
                      </h3>
                      <p className="text-muted-foreground">
                        {app.universityName || 'University'}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Submitted on {formatDate(app.submittedAt)}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewApplication(app.id)}
                  >
                    View Application
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {filteredApplications.filter(app => app.status === 'accepted').length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No accepted applications</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.filter(app => app.status === 'accepted').map((app) => (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {app.courseName || app.formName || 'Application'}
                      </h3>
                      <p className="text-muted-foreground">
                        {app.universityName || 'University'}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-sm text-green-600 mb-3">
                    Congratulations! You've been accepted.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleDownloadLetter(app)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Letter
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplication(app.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredApplications.filter(app => app.status === 'rejected').length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No rejected applications</p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.filter(app => app.status === 'rejected').map((app) => (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {app.courseName || app.formName || 'Application'}
                      </h3>
                      <p className="text-muted-foreground">
                        {app.universityName || 'University'}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewApplication(app.id)}
                  >
                    View Application
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyApplications;