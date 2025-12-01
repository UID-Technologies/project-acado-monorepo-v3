import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  User, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  GraduationCap,
  MessageSquare,
  Download,
  Bell,
  FileCheck,
  Inbox,
  ArrowRight,
  ExternalLink,
  Mail,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { applicationsApi, Application } from '@/api/applications.api';
import { universitiesApi } from '@/api/universities.api';
import { format } from 'date-fns';

interface DashboardApplication {
  id: string;
  courseName: string;
  universityName: string;
  universityId?: string;
  courseId?: string;
  status: string;
  lastUpdated: string;
  createdAt?: string;
  updatedAt?: string;
  hasAcceptanceLetter?: boolean;
  communications?: Array<{ type: string; message: string; date: string }>;
  documentsRequired?: string[];
  nextSteps?: string[];
  progress?: number;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [acceptanceDialog, setAcceptanceDialog] = useState(false);
  const [selectedAcceptance, setSelectedAcceptance] = useState<any>(null);
  const [applications, setApplications] = useState<DashboardApplication[]>([]);
  const [stats, setStats] = useState({
    profileCompletion: 0,
    coursesApplied: 0,
    universitiesApplied: 0,
    acceptanceLetters: 0,
  });
  const [loading, setLoading] = useState(true);
  
  const userAuth = localStorage.getItem("userAuth");
  const userStr = localStorage.getItem("user");
  const user = userAuth ? JSON.parse(userAuth) : (userStr ? JSON.parse(userStr) : null);

  // Fetch user's applications from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get user ID - try multiple sources and formats
        // Backend stores userId as string, frontend User has id as number
        let userId: string | undefined = undefined;
        
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            // Try id (number) first, then _id, then userId, then email as fallback
            const rawId = user.id || user._id || user.userId || user.email;
            if (rawId !== undefined && rawId !== null && rawId !== '') {
              userId = String(rawId);
              console.log('✅ Found userId from userStr:', userId);
            }
          } catch (err) {
            console.error('Error parsing userStr:', err);
          }
        }
        
        if (!userId && userAuth) {
          try {
            const userAuthData = JSON.parse(userAuth);
            const rawId = userAuthData.id || userAuthData._id || userAuthData.userId || userAuthData.email;
            if (rawId !== undefined && rawId !== null && rawId !== '') {
              userId = String(rawId);
              console.log('✅ Found userId from userAuth:', userId);
            }
          } catch (err) {
            console.error('Error parsing userAuth:', err);
          }
        }
        
        // Also check if there's a token that contains user info
        if (!userId) {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              // Decode JWT token (without verification for reading)
              const parts = token.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                const tokenUserId = payload.sub || payload.userId || payload.id || payload.email;
                if (tokenUserId) {
                  userId = String(tokenUserId);
                  console.log('✅ Found userId from JWT token:', userId);
                }
              }
            } catch (err) {
              console.warn('Could not extract userId from token:', err);
            }
          }
        }
        
        if (!userId) {
          console.warn('No user ID found in localStorage', {
            userStr: userStr ? 'exists' : 'missing',
            userAuth: userAuth ? 'exists' : 'missing',
            user: user ? JSON.stringify(user).substring(0, 100) : 'null'
          });
          // Set empty state and show a message
          setApplications([]);
          setStats({
            profileCompletion: 0,
            coursesApplied: 0,
            universitiesApplied: 0,
            acceptanceLetters: 0,
          });
          setLoading(false);
          toast.error('Unable to identify user. Please log in again.');
          return;
        }

        console.log('📊 Fetching applications for userId:', userId);
        console.log('📊 User data:', { userStr, userAuth, user });

        // Fetch applications with enrichment
        // Try with userId first, but also support backend auto-identifying from token
        let response;
        try {
          // First attempt: fetch with userId parameter
          console.log('🔄 Attempting to fetch with userId parameter...');
          response = await applicationsApi.getApplications({ 
            userId: String(userId),
            enrich: true 
          });
          console.log('✅ Applications API response (with userId):', response);
        } catch (firstError: any) {
          console.warn('⚠️ Fetching with userId failed:', {
            status: firstError?.response?.status,
            message: firstError?.message,
            data: firstError?.response?.data
          });
          
          // Second attempt: fetch without userId (backend should use token to identify user)
          try {
            console.log('🔄 Attempting to fetch without userId (using token)...');
            response = await applicationsApi.getApplications({ enrich: true });
            console.log('✅ Applications API response (without userId):', response);
            
            // Filter applications by userId on frontend as fallback
            const allApps = response?.applications || [];
            const userApps = allApps.filter((app: Application) => {
              const appUserId = app.userId || app.user?.id || app.user?._id || app.userId;
              const matches = String(appUserId) === String(userId) || 
                            appUserId === userId ||
                            String(appUserId) === String(user?.id) ||
                            String(appUserId) === String(user?._id);
              
              if (matches) {
                console.log('✅ Matched application:', { appId: app.id, appUserId, userId });
              }
              return matches;
            });
            
            if (userApps.length < allApps.length) {
              console.log(`📋 Filtered ${userApps.length} applications from ${allApps.length} total`);
              response = { ...response, applications: userApps };
            } else {
              console.log(`📋 Using all ${allApps.length} applications (no filtering needed)`);
            }
          } catch (secondError: any) {
            console.error('❌ Both fetch attempts failed:', {
              firstError: {
                status: firstError?.response?.status,
                message: firstError?.message
              },
              secondError: {
                status: secondError?.response?.status,
                message: secondError?.message
              }
            });
            // Throw the more informative error
            throw secondError?.response?.data ? secondError : firstError;
          }
        }
        
        const apps = response?.applications || [];
        console.log(`📋 Found ${apps.length} applications`);

        // Transform applications to dashboard format
        const dashboardApps: DashboardApplication[] = await Promise.all(
          apps.map(async (app: Application) => {
            let courseName = app.courseName || 'Unknown Course';
            let universityName = app.universityName || user?.organizationName || user?.organization_name || 'University';
            
            // If not enriched, try to fetch course details
            if (!app.courseName && app.courseId) {
              try {
                const course = await universitiesApi.getCourseById(Number(app.courseId));
                if (course) {
                  courseName = course.name || courseName;
                }
              } catch (err) {
                console.warn('Could not fetch course details:', err);
              }
            }

            // Map status from API format to dashboard format
            const statusMap: Record<string, string> = {
              'submitted': 'under-review',
              'under_review': 'under-review',
              'accepted': 'accepted',
              'rejected': 'rejected',
              'draft': 'draft',
              'shortlisted': 'under-review',
              'interview_scheduled': 'under-review',
              'waitlisted': 'under-review',
              'withdrawn': 'rejected',
            };
            
            const dashboardStatus = statusMap[app.status] || app.status || 'draft';
            
            // Format date
            const lastUpdated = app.updatedAt 
              ? format(new Date(app.updatedAt), 'yyyy-MM-dd')
              : app.createdAt 
              ? format(new Date(app.createdAt), 'yyyy-MM-dd')
              : format(new Date(), 'yyyy-MM-dd');

            const dashboardApp: DashboardApplication = {
              id: app.id || app._id || '',
              courseName,
              universityName,
              universityId: app.universityId,
              courseId: app.courseId,
              status: dashboardStatus,
              lastUpdated,
              createdAt: app.createdAt,
              updatedAt: app.updatedAt,
              hasAcceptanceLetter: app.status === 'accepted',
              // Communications and next steps can be added from app.reviewNotes or other fields
              communications: app.status === 'accepted' 
                ? [{ type: 'success', message: 'Congratulations! You have been accepted', date: lastUpdated }]
                : app.status === 'under_review' || app.status === 'submitted'
                ? [{ type: 'info', message: 'Application received and under review', date: lastUpdated }]
                : [],
              progress: app.status === 'draft' ? 45 : app.status === 'submitted' ? 100 : undefined,
            };

            return dashboardApp;
          })
        );

        setApplications(dashboardApps);

        // Calculate stats from real data
        const uniqueCourses = new Set(dashboardApps.map(app => app.courseId).filter(Boolean));
        const uniqueUniversities = new Set(dashboardApps.map(app => app.universityId).filter(Boolean));
        const acceptedCount = dashboardApps.filter(app => app.status === 'accepted').length;

        setStats({
          profileCompletion: 65, // This would need a separate API call to calculate
          coursesApplied: dashboardApps.length,
          universitiesApplied: uniqueUniversities.size,
          acceptanceLetters: acceptedCount,
        });

      } catch (error: any) {
        console.error('❌ Failed to fetch dashboard data:', {
          error,
          message: error?.message,
          response: error?.response,
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          userId: userStr || userAuth ? 'exists' : 'missing',
        });
        
        // Set empty state on error
        setApplications([]);
        setStats({
          profileCompletion: 0,
          coursesApplied: 0,
          universitiesApplied: 0,
          acceptanceLetters: 0,
        });
        
        // Show user-friendly error message
        let errorMessage = 'Failed to load dashboard data.';
        if (error?.response?.status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (error?.response?.status === 403) {
          errorMessage = 'Access denied.';
        } else if (error?.response?.status === 404) {
          errorMessage = 'Applications endpoint not found.';
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const pendingCommunications = applications.filter(app => 
    app.communications && app.communications.length > 0
  );

  const handleDownloadAcceptance = (application: any) => {
    toast.success(`Downloading acceptance letter for ${application.courseName}`);
    // In real app, this would download the actual PDF
  };

  const handleViewAcceptance = (application: any) => {
    setSelectedAcceptance(application);
    setAcceptanceDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; icon: any; label: string }> = {
      'accepted': { variant: 'default', icon: CheckCircle, label: 'Accepted' },
      'under-review': { variant: 'secondary', icon: Clock, label: 'Under Review' },
      'draft': { variant: 'outline', icon: FileText, label: 'Draft' },
      'rejected': { variant: 'destructive', icon: AlertCircle, label: 'Rejected' },
      'submitted': { variant: 'default', icon: FileCheck, label: 'Submitted' }
    };
    
    const { variant, icon: Icon, label } = variants[status] || variants['draft'];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header with Notifications */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Track your applications and discover new opportunities
          </p>
        </div>
        {acceptedApplications.length > 0 && (
          <Badge variant="default" className="gap-1 animate-pulse bg-green-600 text-white">
            <Bell className="h-3 w-3" />
            {acceptedApplications.length} Acceptance{acceptedApplications.length > 1 ? 's' : ''}!
          </Badge>
        )}
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Applied</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-2xl font-bold">--</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold mb-2">{stats.coursesApplied}</div>
                <p className="text-xs text-muted-foreground">
                  Across all universities
                </p>
                <Button 
                  variant="link" 
                  className="px-0 mt-2"
                  onClick={() => navigate("/user/applications")}
                >
                  View Applications →
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Universities Applied</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-2xl font-bold">--</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.universitiesApplied}</div>
                <p className="text-xs text-muted-foreground">
                  Different institutions
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Letters</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-2xl font-bold">--</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">{stats.acceptanceLetters}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.acceptanceLetters > 0 ? 'Congratulations! 🎉' : 'No acceptances yet'}
                </p>
                {stats.acceptanceLetters > 0 && (
                  <Button 
                    variant="link" 
                    className="px-0 mt-2"
                    onClick={() => setAcceptanceDialog(true)}
                  >
                    View Letters →
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-2xl font-bold">--</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold mb-2">{stats.profileCompletion}%</div>
                <Progress value={stats.profileCompletion} className="h-2" />
                <Button 
                  variant="link" 
                  className="px-0 mt-2"
                  onClick={() => navigate("/user/portfolio")}
                >
                  Complete Profile →
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application Status & Communications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Application Status & Communications</CardTitle>
          <CardDescription>
            Track your applications and university messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading applications...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No applications yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Start applying to courses to see your applications here
              </p>
              <Button onClick={() => navigate("/user/courses")}>
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted ({acceptedApplications.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({applications.filter(a => a.status === 'under-review').length})
              </TabsTrigger>
              <TabsTrigger value="action-required">
                Action Required ({applications.filter(a => a.documentsRequired).length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{app.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{app.universityName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(app.status)}
                      {app.hasAcceptanceLetter && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewAcceptance(app)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Letter
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Communications */}
                  {app.communications && app.communications.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {app.communications.slice(0, 2).map((comm, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <MessageSquare className={`h-4 w-4 mt-0.5 ${
                            comm.type === 'success' ? 'text-green-600' :
                            comm.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                          <div className="flex-1">
                            <p>{comm.message}</p>
                            <span className="text-xs text-muted-foreground">{comm.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Required Documents */}
                  {app.documentsRequired && app.documentsRequired.length > 0 && (
                    <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        Documents Required:
                      </p>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                        {app.documentsRequired.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Next Steps */}
                  {app.nextSteps && app.nextSteps.length > 0 && (
                    <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Next Steps:
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        {app.nextSteps.map((step, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant={app.status === 'draft' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        if (app.status === 'draft') {
                          // Navigate to continue application - need formId
                          navigate(`/user/applications`);
                        } else {
                          navigate(`/user/applications`);
                        }
                      }}
                    >
                      {app.status === 'draft' ? 'Continue Application' : 'View Details'}
                    </Button>
                    {app.communications && app.communications.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/user/communications/${app.id}`)}
                      >
                        <Inbox className="h-3 w-3 mr-1" />
                        Messages ({app.communications.length})
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="accepted" className="space-y-4">
              {acceptedApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{app.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{app.universityName}</p>
                    </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleViewAcceptance(app)}
                      >
                      <Download className="h-3 w-3 mr-1" />
                      Acceptance Letter
                    </Button>
                  </div>
                  {app.nextSteps && app.nextSteps.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Complete these steps:</p>
                      {app.nextSteps.map((step, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          {step}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {applications
                .filter(app => app.status === 'under-review')
                .map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold">{app.courseName}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{app.universityName}</p>
                    <p className="text-sm">Application submitted and under review</p>
                    <p className="text-xs text-muted-foreground mt-1">Last updated: {app.lastUpdated}</p>
                  </div>
                ))}
            </TabsContent>
            
            <TabsContent value="action-required" className="space-y-4">
              {applications
                .filter(app => app.documentsRequired)
                .map((app) => (
                  <div key={app.id} className="border rounded-lg p-4 border-yellow-500">
                    <h4 className="font-semibold">{app.courseName}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{app.universityName}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        Documents Required:
                      </p>
                      {app.documentsRequired?.map((doc, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">• {doc}</p>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate(`/user/applications/${app.id}`)}
                    >
                      Upload Documents
                    </Button>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/courses")}
            >
              <BookOpen className="h-5 w-5" />
              <span>Browse Courses</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/applications")}
            >
              <FileText className="h-5 w-5" />
              <span>My Applications</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => setAcceptanceDialog(true)}
            >
              <Mail className="h-5 w-5" />
              <span>Acceptance Letters</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/portfolio")}
            >
              <User className="h-5 w-5" />
              <span>My Portfolio</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Acceptance Letter Dialog */}
      <Dialog open={acceptanceDialog} onOpenChange={setAcceptanceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Acceptance Letters</DialogTitle>
            <DialogDescription>
              Congratulations on your acceptances! Download your official letters below.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {acceptedApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{app.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{app.universityName}</p>
                      <p className="text-sm text-green-600 mt-1">
                        Accepted on {app.lastUpdated}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast.success(`Opening acceptance letter for ${app.courseName}`);
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadAcceptance(app)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  {app.nextSteps && app.nextSteps.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium mb-2">Next Steps:</p>
                      <ul className="space-y-1">
                        {app.nextSteps.map((step, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-1">
                            <CheckCircle className="h-3 w-3 mt-0.5 text-green-600" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;