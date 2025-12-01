import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applicationsApi,
  type Application,
  type ApplicationStats,
  coursesApi,
  formsApi,
  type FormsListResponse,
} from "@/api";
import type { Course } from "@/types/course";
import type { Form } from "@/api/forms.api";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface UniversityDashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalForms: number;
  activeForms: number;
  totalApplications: number;
  pendingReview: number;
  shortlisted: number;
  accepted: number;
  acceptanceRate: number;
}

export interface RecentApplication {
  id: string;
  applicantName: string;
  courseName: string;
  matchScore?: number | null;
  status: string;
  submittedAt?: string | null;
}

const emptyStats: UniversityDashboardStats = {
  totalCourses: 0,
  activeCourses: 0,
  totalForms: 0,
  activeForms: 0,
  totalApplications: 0,
  pendingReview: 0,
  shortlisted: 0,
  accepted: 0,
  acceptanceRate: 0,
};

const getAcceptanceRate = (accepted: number, total: number) => {
  if (!total || total <= 0) return 0;
  const rate = (accepted / total) * 100;
  return Number.isFinite(rate) ? Math.round(rate * 10) / 10 : 0;
};

const prepareStats = (
  courses: Course[],
  forms: Form[],
  applicationStats: ApplicationStats | null,
): UniversityDashboardStats => {
  const totalCourses = courses.length;
  const activeCourses = courses.filter((course) => course.isActive !== false).length;

  const totalForms = forms.length;
  const activeForms = forms.filter(
    (form) => form.isActive || form.isLaunched || form.status === "published",
  ).length;

  const totalApplications = applicationStats?.total ?? 0;
  const submitted = applicationStats?.submitted ?? 0;
  const underReview = applicationStats?.under_review ?? 0;
  const shortlisted = applicationStats?.shortlisted ?? 0;
  const accepted = applicationStats?.accepted ?? 0;

  const pendingReview = submitted + underReview;
  const acceptanceRate = getAcceptanceRate(accepted, totalApplications);

  return {
    totalCourses,
    activeCourses,
    totalForms,
    activeForms,
    totalApplications,
    pendingReview,
    shortlisted,
    accepted,
    acceptanceRate,
  };
};

const transformRecentApplications = (apps: Application[]): RecentApplication[] => {
  return apps.map((app) => ({
    id: app.id,
    applicantName: app.applicantName ?? "Unknown Applicant",
    courseName: app.courseName ?? "Unknown Course",
    matchScore:
      typeof app.matchScore === "number" ? Math.round(app.matchScore) : app.matchScore ?? null,
    status: app.status ?? "submitted",
    submittedAt: app.submittedAt ?? app.createdAt ?? null,
  }));
};

export const useUniversityDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const universityId = useMemo(() => {
    if (!user) return null;
    return (
      user.universityId ??
      (Array.isArray(user.universityIds) && user.universityIds.length > 0
        ? user.universityIds[0]
        : null) ??
      user.organizationId ??
      null
    );
  }, [user]);

  const universityName = useMemo(() => {
    if (!user) return undefined;
    return user.universityName ?? user.organizationName ?? undefined;
  }, [user]);

  const [stats, setStats] = useState<UniversityDashboardStats>(emptyStats);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coursesPromise = coursesApi.list(
        universityId ? { universityId } : undefined,
      ) as Promise<Course[]>;

      const formsPromise = formsApi.getForms({
        ...(universityId ? { universityId } : {}),
        limit: 100,
      }) as Promise<FormsListResponse>;

      const applicationStatsPromise = applicationsApi.getStats(
        universityId ? { universityId } : undefined,
      ) as Promise<ApplicationStats>;

      const recentApplicationsPromise = applicationsApi.getApplications({
        ...(universityId ? { universityId } : {}),
        enrich: true,
        limit: 5,
        sort: "-createdAt",
      });

      const [courses, formsResponse, applicationStats, applicationsResponse] = await Promise.all([
        coursesPromise,
        formsPromise,
        applicationStatsPromise,
        recentApplicationsPromise,
      ]);

      setStats(prepareStats(courses ?? [], formsResponse.forms ?? [], applicationStats ?? null));
      setRecentApplications(transformRecentApplications(applicationsResponse.applications ?? []));
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Failed to load dashboard data");
      console.error("Failed to load university dashboard data:", err);
      setStats(emptyStats);
      setRecentApplications([]);
      setError(error);
      toast({
        title: "Unable to load dashboard data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, universityId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    universityId,
    universityName,
    stats,
    recentApplications,
    loading,
    error,
    refresh: fetchData,
  };
};


