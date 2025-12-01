import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Building2, MapPin, Users, GraduationCap, Search, Award, ShieldCheck, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  universitiesApi,
  UniversityListParams,
  UniversitySummary,
} from "@/api/universities.api";
import { InstitutionType } from "@/types/university";

const Universities = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [universities, setUniversities] = useState<UniversitySummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<InstitutionType | "all">("all");
  const [deleteUniversityId, setDeleteUniversityId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'Live' | 'Suspended'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(
    async (overrides?: Partial<UniversityListParams>) => {
      try {
        setLoading(true);
        setError(null);

        const params: UniversityListParams = {
          search: overrides?.search ?? (searchQuery || undefined),
          institutionType: overrides?.institutionType ?? (filterType !== "all" ? filterType : undefined),
          status: overrides?.status ?? (filterStatus !== 'all' ? filterStatus : undefined),
        };

        const universitiesList = await universitiesApi.getUniversities(params);
        setUniversities(universitiesList);
      } catch (err: any) {
        console.error("Failed to load universities", err);
        // Extract error message safely - handle both string and object errors
        let errorMessage = "Failed to load universities";
        if (err?.response?.data?.error) {
          const errorObj = err.response.data.error;
          errorMessage = typeof errorObj === 'string' ? errorObj : (errorObj?.message || errorMessage);
        } else if (err?.message) {
          errorMessage = typeof err.message === 'string' ? err.message : errorMessage;
        }
        setError(errorMessage);
        toast({
          title: "Failed to load universities",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [filterType, filterStatus, searchQuery, toast]
  );

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleDelete = async () => {
    if (!deleteUniversityId) return;
    try {
      await universitiesApi.deleteUniversity(deleteUniversityId);
      toast({
        title: "University archived",
        description: "The university has been archived successfully.",
      });
      setDeleteUniversityId(null);
      fetchUniversities();
    } catch (err: any) {
      toast({
        title: "Failed to remove organization",
        description: err?.response?.data?.error || err?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type?: InstitutionType | string) => {
    const normalized = (type || "university").toLowerCase();
    switch (normalized) {
      case "university":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "coe":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "industry":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "school":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Universities</h1>
            <p className="text-muted-foreground mt-1">Manage universities and their profiles</p>
          </div>
          <Button variant="gradient" className="gap-2" onClick={() => navigate('/universities/add')}>
            <Plus className="w-4 h-4" />
            Add University
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search institutions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  fetchUniversities({ search: value, page: 1 });
                }}
              />
            </div>
          </Card>

          <Card className="p-4">
            <Select
              value={filterType}
              onValueChange={(value: InstitutionType | "all") => {
                setFilterType(value);
                fetchUniversities({
                  institutionType: value === "all" ? undefined : value,
                  status: filterStatus !== 'all' ? filterStatus : undefined,
                  page: 1,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="University">University</SelectItem>
                <SelectItem value="COE">COE (Center of Excellence)</SelectItem>
                <SelectItem value="Industry">Industry</SelectItem>
                <SelectItem value="School">School</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-4">
            <Select
              value={filterStatus}
              onValueChange={(value: 'all' | 'Live' | 'Suspended') => {
                setFilterStatus(value);
                fetchUniversities({
                  status: value === 'all' ? undefined : value,
                  institutionType: filterType !== 'all' ? filterType : undefined,
                  page: 1,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        </div>

        {error && (
          <Card className="p-12 text-center border-none">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load universities</h3>
            <p className="text-muted-foreground mb-4">{typeof error === 'string' ? error : (error?.message || 'An error occurred')}</p>
            <Button variant="outline" onClick={() => fetchUniversities()} disabled={loading}>
              Retry
            </Button>
          </Card>
        )}

        {!error && loading && (
          <Card className="p-12 text-center border-none">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">Loading universities</h3>
            <p className="text-muted-foreground">Please wait while we fetch the latest data.</p>
          </Card>
        )}

        {!error && !loading && universities.length === 0 && (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No universities found</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first organization or adjust your search criteria.
            </p>
            <Button variant="outline" onClick={() => navigate('/universities/add')}>
              Add Your First University
            </Button>
          </Card>
        )}

        {!error && !loading && universities.length > 0 && (
          <Card>
            <div className="divide-y">
              {universities.map((university, index) => (
                <div
                  key={university.id}
                  className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                  }`}
                >
                  <div
                    className="h-20 w-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => navigate(`/universities/${university.id}/view`)}
                  >
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/universities/${university.id}/view`)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">
                        {university.name}
                      </h3>
                      <Badge className={`${getTypeColor(university.institutionType)} flex-shrink-0`}>
                        {university.institutionType || 'University'}
                      </Badge>
                      {university.tags?.isVerified && (
                        <Badge variant="outline" className="gap-1">
                          <Award className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {[
                          university.location?.city,
                          university.location?.state,
                          university.location?.country,
                        ]
                          .filter(Boolean)
                          .join(', ') || 'Location unavailable'}
                      </span>
                      <Badge
                        variant={university.status === 'Suspended' ? 'destructive' : 'default'}
                        className="flex items-center gap-1 text-xs"
                      >
                        {university.status === 'Suspended' ? (
                          <ShieldAlert className="h-3.5 w-3.5" />
                        ) : (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        )}
                        <span>{university.status ?? 'Active'}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-6 px-4">
                    {university.stats?.rating && (
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Rating</div>
                        <div className="font-semibold text-primary">{university.stats.rating}</div>
                      </div>
                    )}
                    {university.stats?.rank && (
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Rank</div>
                        <div className="font-semibold">{university.stats.rank}</div>
                      </div>
                    )}
                    {university.stats?.totalStudents && university.stats.totalStudents > 0 && (
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Students</div>
                        <div className="font-semibold">
                          {(university.stats.totalStudents / 1000).toFixed(1)}k
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/universities/${university.id}/view`);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/universities/edit/${university.id}`);
                      }}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteUniversityId(university.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteUniversityId} onOpenChange={() => setDeleteUniversityId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the organization and hide it from active lists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Universities;