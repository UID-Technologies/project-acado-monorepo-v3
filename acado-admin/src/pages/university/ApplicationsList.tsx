import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApplicationSubmissions } from "@/hooks/useApplicationSubmissions";
import { useFormsData } from "@/hooks/useFormsData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  Target,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const ApplicationsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { applications, loading: applicationsLoading, error: applicationsError } = useApplicationSubmissions();
  const { forms, universities, courses, loading: formsLoading, error: formsError } = useFormsData();

  // Determine base path based on current route
  const isAdminRoute = location.pathname.startsWith('/applications');
  const basePath = isAdminRoute ? '/applications' : '/university/applications';

  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<string>("all");

  // Filters for form list page
  const [formListUniversity, setFormListUniversity] = useState<string>("all");
  const [formListCourse, setFormListCourse] = useState<string>("all");

  // Application stages - defined as constant to avoid dependency issues
  const stages = [
    { value: "submitted", label: "Submitted", icon: FileText, color: "bg-blue-500" },
    { value: "under_review", label: "In Review", icon: Clock, color: "bg-yellow-500" },
    { value: "shortlisted", label: "Shortlisted", icon: Target, color: "bg-purple-500" },
    { value: "interview_scheduled", label: "In Progress", icon: AlertCircle, color: "bg-orange-500" },
    { value: "accepted", label: "Selected", icon: CheckCircle, color: "bg-green-500" },
    { value: "rejected", label: "Rejected", icon: XCircle, color: "bg-red-500" },
  ];

  // Get form statistics with filters
  const formsWithStats = useMemo(() => {
    return forms.map((form) => {
      const formApplications = applications.filter((app) => app.formId === form.id);
      const stats = stages.map((stage) => ({
        ...stage,
        count: formApplications.filter((app) => app.status === stage.value).length,
      }));
      return {
        ...form,
        totalApplications: formApplications.length,
        stats,
      };
    });
  }, [forms, applications, stages]);

  // Filter forms for the list view
  const filteredForms = useMemo(() => {
    return formsWithStats.filter(form => {
      const matchesUniversity =
        formListUniversity === 'all' ||
        (form.universityId && String(form.universityId) === String(formListUniversity));

      const matchesCourse =
        formListCourse === 'all' ||
        (Array.isArray(form.courseIds) &&
          form.courseIds.some(courseId => String(courseId) === String(formListCourse)));

      return matchesUniversity && matchesCourse;
    });
  }, [formsWithStats, formListUniversity, formListCourse]);

  // Calculate overview statistics
  const overviewStats = useMemo(() => {
    const totalForms = forms.length;

    const universitiesWithForms = new Set(
      forms
        .map(form => form.universityId || form.universityIds?.[0])
        .filter(Boolean)
    );

    const coursesMapped = new Set(
      forms.flatMap(form => form.courseIds || []).filter(Boolean)
    );

    const totalApplications = applications.length;
    const applicationsByStage = stages.map(stage => ({
      ...stage,
      count: applications.filter(app => app.status === stage.value).length,
    }));

    return {
      totalForms,
      universitiesWithForms: universitiesWithForms.size,
      coursesMapped: coursesMapped.size,
      totalApplications,
      applicationsByStage,
    };
  }, [forms, applications, stages]);

  // Filter applications for selected form
  const filteredApplications = useMemo(() => {
    if (!selectedFormId) return [];

    return applications.filter((app) => {
      const matchesForm = app.formId === selectedFormId;
      const matchesSearch =
        (app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (app.applicantEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesUniversity =
        selectedUniversity === "all" || courses.find((c) => c.id === app.courseId)?.universityId === selectedUniversity;

      const matchesCourse = selectedCourse === "all" || app.courseId === selectedCourse;

      const matchesStage = selectedStage === "all" || app.status === selectedStage;

      return matchesForm && matchesSearch && matchesUniversity && matchesCourse && matchesStage;
    });
  }, [applications, selectedFormId, searchTerm, selectedUniversity, selectedCourse, selectedStage, courses]);

  // Get statistics for selected form
  const stats = useMemo(() => {
    const total = filteredApplications.length;
    const byStage = stages.map((stage) => ({
      ...stage,
      count: filteredApplications.filter((app) => app.status === stage.value).length,
    }));
    return { total, byStage };
  }, [filteredApplications, stages]);

  const getStageInfo = (status: string) => {
    return stages.find((s) => s.value === status) || stages[0];
  };

  const getCourseName = (courseId: string) => {
    if (!courseId) return "Unknown Course";
    const course = courses.find((c) => String(c.id) === String(courseId));
    if (course?.name) return course.name;
    if ((course as any)?.title) return (course as any).title;
    if ((course as any)?.programName) return (course as any).programName;
    const formCourse = forms.find(form =>
      Array.isArray(form.courseIds) && form.courseIds.some(id => String(id) === String(courseId))
    );
    if (formCourse && Array.isArray(formCourse.courseIds) && Array.isArray(formCourse.courseNames)) {
      const idx = formCourse.courseIds.findIndex(id => String(id) === String(courseId));
      if (idx >= 0) {
        const courseName = formCourse.courseNames?.[idx];
        if (courseName && courseName.trim().length > 0) return courseName;
      }
    }
    const appWithCourseName = applications.find(app => app.courseId === courseId && app.courseName);
    if (appWithCourseName?.courseName) return appWithCourseName.courseName;
    return "Unknown Course";
  };

  const getUniversityName = (courseId: string, universityId?: string) => {
    if (universityId) {
      const university = universities.find((u) => String(u.id) === String(universityId));
      if (university?.name) return university.name;
      const appWithUniversity = applications.find(app => app.universityId === universityId);
      if (appWithUniversity?.universityName) return appWithUniversity.universityName;
    }

    if (!courseId) return "Unknown University";
    const course = courses.find((c) => String(c.id) === String(courseId));
    if (course?.universityId) {
      const university = universities.find((u) => String(u.id) === String(course.universityId));
      if (university?.name) return university.name;
      const appWithUniversity = applications.find(app => app.universityId === course.universityId);
      if (appWithUniversity?.universityName) return appWithUniversity.universityName;
    }

    const appWithCourse = applications.find(app => app.courseId === courseId && app.universityName);
    if (appWithCourse?.universityName) return appWithCourse.universityName;

    return "Unknown University";
  };

  const selectedForm = forms.find((f) => f.id === selectedFormId);

  // Show loading state
  if (applicationsLoading || formsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Application Forms</h1>
            <p className="text-muted-foreground mt-1">View applications collected through each form</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading applications...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show form list if no form is selected
  if (!selectedFormId) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Application Forms</h1>
            <p className="text-muted-foreground mt-1">View applications collected through each form</p>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{overviewStats.totalForms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{overviewStats.universitiesWithForms}</div>
              <p className="text-xs text-muted-foreground mt-1">Created forms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Courses Mapped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{overviewStats.coursesMapped}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{overviewStats.totalApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">By Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {overviewStats.applicationsByStage.map((stage) => (
                  <div key={stage.value} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="text-muted-foreground">{stage.label}:</span>
                    <span className="font-semibold">{stage.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Select value={formListUniversity} onValueChange={setFormListUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={formListCourse} onValueChange={setFormListCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses
                    .filter((course) => formListUniversity === "all" || course.universityId === formListUniversity)
                    .map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name || course.title || "Unknown Course"}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Forms List */}
        <div className="grid gap-4">
          {filteredForms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">No forms found</p>
                <p className="text-sm text-muted-foreground">
                  Create application forms to start collecting applications
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredForms.map((form) => (
              <Card
                key={form.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedFormId(form.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1">{form.name || form.title}</h3>
                      <p className="text-sm text-muted-foreground">{form.description || "No description"}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{form.totalApplications} Total Applications</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Stage Statistics */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {form.stats.map((stage) => {
                      const Icon = stage.icon;
                      return (
                        <div key={stage.value} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                            <span className="text-xs text-muted-foreground">{stage.label}</span>
                          </div>
                          <span className="text-2xl font-bold text-foreground">{stage.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Show applications for selected form
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedFormId(null);
            setSearchTerm("");
            setSelectedUniversity("all");
            setSelectedCourse("all");
            setSelectedStage("all");
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forms
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{selectedForm?.name || selectedForm?.title || "Application Form"}</h1>
          <p className="text-muted-foreground mt-1">Applications collected through this form</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        {stats.byStage.map((stage) => {
          const Icon = stage.icon;
          return (
            <Card key={stage.value}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  {stage.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stage.count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger>
                <SelectValue placeholder="All Universities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {universities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses
                  .filter((course) => selectedUniversity === "all" || course.universityId === selectedUniversity)
                  .map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name || course.title || "Unknown Course"}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No applications found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => {
            const stageInfo = getStageInfo(app.status);
            const StageIcon = stageInfo.icon;

            return (
              <Card
                key={app.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`${basePath}/${app.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{app.applicantName || "Unknown Applicant"}</h3>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${stageInfo.color}`} />
                          {stageInfo.label}
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {app.applicantEmail || "No email"}
                          </span>
                          <span>•</span>
                          <span>{getUniversityName(app.courseId, app.universityId)}</span>
                          <span>•</span>
                          <span>{getCourseName(app.courseId)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Match Score:</span>
                          <span className="font-semibold text-muted-foreground">N/A</span>
                        </div>
                        <div className="text-xs">
                          Applied:{" "}
                          {app.submittedAt
                            ? new Date(app.submittedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
