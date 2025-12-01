import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap,
  FileText,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Send,
  RefreshCcw,
} from "lucide-react";
import { useUniversityDashboard } from "@/hooks/useUniversityDashboard";
import { cn } from "@/lib/utils";

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  submitted: "secondary",
  draft: "outline",
  under_review: "outline",
  shortlisted: "secondary",
  interview_scheduled: "secondary",
  accepted: "default",
  rejected: "destructive",
  waitlisted: "outline",
};

const statusDotColors: Record<string, string> = {
  pending: "bg-yellow-500",
  submitted: "bg-blue-500",
  draft: "bg-slate-400",
  under_review: "bg-amber-500",
  shortlisted: "bg-purple-500",
  interview_scheduled: "bg-orange-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
  waitlisted: "bg-slate-500",
};

const formatStatusLabel = (status: string) =>
  status
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const UniversityDashboard = () => {
  const navigate = useNavigate();
  const {
    stats,
    recentApplications,
    loading,
    error,
    refresh,
    universityName,
  } = useUniversityDashboard();

  const handleRefresh = () => {
    if (!loading) {
      refresh();
    }
  };

  const getStatusVariant = (status: string) =>
    statusVariants[status] ?? statusVariants.submitted;

  const getStatusDotClass = (status: string) =>
    statusDotColors[status] ?? "bg-muted-foreground";

  const renderStatValue = (value: number, placeholderWidth = "w-16") =>
    loading ? <Skeleton className={cn("h-7", placeholderWidth)} /> : value.toLocaleString();

  const renderAcceptanceRate = () =>
    loading ? (
      <Skeleton className="h-7 w-20" />
    ) : (
      `${stats.acceptanceRate.toFixed(1)}%`
    );

  const renderApplicationsContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      );
    }

    if (recentApplications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <p className="font-medium text-foreground">No applications yet</p>
          <p className="text-sm text-muted-foreground">
            Recent applications will appear here as soon as candidates apply.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {recentApplications.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{app.applicantName}</h4>
              <p className="text-sm text-muted-foreground">
                {app.courseName} • Submitted {formatDate(app.submittedAt)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {app.matchScore != null ? `${app.matchScore}%` : "—"}
                </div>
                <p className="text-xs text-muted-foreground">Match Score</p>
              </div>
              <Badge variant={getStatusVariant(app.status)} className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", getStatusDotClass(app.status))} />
                {formatStatusLabel(app.status)}
              </Badge>
              <Button size="sm" onClick={() => navigate(`/university/applications/${app.id}`)}>
                Review
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">University Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage admissions and engagement for {universityName ?? "your institution"}.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Failed to load dashboard data</AlertTitle>
            <AlertDescription>
              {error.message || "We ran into an issue while retrieving the latest metrics."}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => navigate("/university/courses")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {renderStatValue(stats.totalCourses)}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? <Skeleton className="h-4 w-24" /> : `${stats.activeCourses} active`}
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => navigate("/university/forms")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {renderStatValue(stats.activeForms)}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? <Skeleton className="h-4 w-28" /> : `${stats.totalForms} total templates`}
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => navigate("/university/applications")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {renderStatValue(stats.totalApplications)}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? (
                  <Skeleton className="h-4 w-36" />
                ) : (
                  `${stats.pendingReview} pending review`
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{renderAcceptanceRate()}</div>
              {loading ? (
                <Skeleton className="mt-2 h-2 w-full" />
              ) : (
                <Progress value={stats.acceptanceRate} className="mt-2" />
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `${stats.accepted} accepted applicants`
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">Recent Applications</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Latest submissions requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderApplicationsContent()}
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => navigate("/university/applications")}
                >
                  View All Applications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => navigate("/university/courses/new")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Create New Course
                  </CardTitle>
                  <CardDescription>
                    Add the next program to your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create Course</Button>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => navigate("/university/forms/new")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Build Application Form
                  </CardTitle>
                  <CardDescription>
                    Launch customized forms for applicants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Build Form</Button>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => navigate("/university/application-process")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Application Process Setup
                  </CardTitle>
                  <CardDescription>
                    Configure evaluation stages and criteria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Configure Criteria</Button>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => navigate("/university/communications")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Communications
                  </CardTitle>
                  <CardDescription>
                    Message applicants and automate updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Manage Communications</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Application Analytics
                </CardTitle>
                <CardDescription>Overview of application statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 text-amber-500" />
                    <div className="text-2xl font-bold">
                      {renderStatValue(stats.pendingReview, "w-14")}
                    </div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <AlertCircle className="mx-auto mb-2 h-8 w-8 text-purple-500" />
                    <div className="text-2xl font-bold">
                      {renderStatValue(stats.shortlisted, "w-14")}
                    </div>
                    <p className="text-sm text-muted-foreground">Shortlisted</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
                    <div className="text-2xl font-bold">
                      {renderStatValue(stats.accepted, "w-14")}
                    </div>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversityDashboard;

