import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Copy,
  ListChecks,
  Eye,
  Edit,
  Filter,
  X,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LearningOutcomeAssignDialog from '@/components/courses/LearningOutcomeAssignDialog';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Course } from '@/types/course';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { LearningOutcome } from '@/types/learningOutcome';
import { coursesApi, UpsertCoursePayload } from '@/api/courses.api';
import { courseCategoriesApi } from '@/api/courseCategories.api';
import { courseLevelsApi } from '@/api/courseLevels.api';
import { courseTypesApi } from '@/api/courseTypes.api';
import { learningOutcomesApi } from '@/api/learningOutcomes.api';
import { universitiesApi, UniversitySummary } from '@/api/universities.api';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [types, setTypes] = useState<CourseType[]>([]);
  const [organizations, setOrganizations] = useState<UniversitySummary[]>([]);
  const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('');
  const [isAssignOutcomesOpen, setIsAssignOutcomesOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        courseList,
        categoryList,
        levelList,
        typeList,
        universitiesRes,
        outcomeList,
      ] = await Promise.all([
        coursesApi.list(),
        courseCategoriesApi.list({ includeInactive: true }),
        courseLevelsApi.list({ includeInactive: true }),
        courseTypesApi.list({ includeInactive: true }),
        universitiesApi.getUniversities({ page: 1, pageSize: 200 }),
        learningOutcomesApi.list({ includeInactive: true }),
      ]);

      setCourses(
        courseList.map((course) => ({
          ...course,
          organizationId: course.organizationId || course.universityId,
        }))
      );
      setCategories(categoryList);
      setLevels(levelList);
      setTypes(typeList);
      setOrganizations(universitiesRes.data ?? []);
      setLearningOutcomes(outcomeList);
    } catch (error: any) {
      toast({
        title: 'Failed to load courses',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      await coursesApi.remove(courseToDelete.id);
      setCourses((prev) => prev.filter((course) => course.id !== courseToDelete.id));
      toast({ title: 'Success', description: 'Course deleted successfully' });
    } catch (error: any) {
      toast({
        title: 'Failed to delete course',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setCourseToDelete(null);
    }
  };

  const handleToggleActive = async (course: Course) => {
    try {
      const updated = await coursesApi.update(course.id, { isActive: !course.isActive });
      setCourses((prev) =>
        prev.map((c) =>
          c.id === updated.id ? { ...updated, organizationId: updated.universityId } : c
        )
      );
      toast({
        title: 'Success',
        description: `Course ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to update status',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = async (course: Course) => {
    const payload: UpsertCoursePayload = {
      universityId: course.universityId || course.organizationId,
      universityName: course.universityName,
      name: `${course.name} (Copy)`,
      shortName: `${course.shortName} (Copy)`,
      courseCode: course.courseCode ? `${course.courseCode}-COPY` : undefined,
      description: course.description,
      keywords: course.keywords,
      courseCategoryId: course.courseCategoryId || undefined,
      courseLevelId: course.courseLevelId || undefined,
      courseTypeId: course.courseTypeId || undefined,
      thumbnail: course.thumbnail,
      bannerImage: course.bannerImage,
      videoUrl: course.videoUrl,
      startDate: course.startDate,
      endDate: course.endDate,
      learningOutcomeIds: course.learningOutcomeIds || [],
      isActive: false,
    };

    try {
      const created = await coursesApi.create(payload);
      setCourses((prev) => [...prev, { ...created, organizationId: created.universityId }]);
      toast({ title: 'Success', description: 'Course duplicated successfully' });
    } catch (error: any) {
      toast({
        title: 'Failed to duplicate course',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleAssignOutcomes = async (outcomeIds: string[]) => {
    if (!selectedCourse) return;
    try {
      const updated = await coursesApi.update(selectedCourse.id, { learningOutcomeIds: outcomeIds });
      setCourses((prev) =>
        prev.map((course) =>
          course.id === updated.id ? { ...updated, organizationId: updated.universityId } : course
        )
      );
      toast({ title: 'Success', description: 'Learning outcomes assigned successfully' });
      setSelectedCourse(null);
      setIsAssignOutcomesOpen(false);
    } catch (error: any) {
      toast({
        title: 'Failed to assign outcomes',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || 'N/A';
  const getLevelName = (id: string) => levels.find((l) => l.id === id)?.name || 'N/A';
  const getTypeName = (id: string) => types.find((t) => t.id === id)?.name || 'N/A';
  const getOrganizationName = (id: string) => organizations.find((o) => o.id === id)?.name || 'N/A';

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredCourses = courses.filter((course) => {
    const valuesToSearch = [course.name, course.shortName, course.courseCode].filter(
      (value): value is string => typeof value === 'string'
    );

    const matchesSearch =
      normalizedSearch.length === 0 ||
      valuesToSearch.some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesCategory =
      !filterCategory || filterCategory === 'all' || course.courseCategoryId === filterCategory;
    const matchesLevel =
      !filterLevel || filterLevel === 'all' || course.courseLevelId === filterLevel;
    const matchesType =
      !filterType || filterType === 'all' || course.courseTypeId === filterType;
    const matchesOrganization =
      !filterOrganization ||
      filterOrganization === 'all' ||
      (course.organizationId || course.universityId) === filterOrganization;

    return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesOrganization;
  });

  const clearFilters = () => {
    setFilterCategory('');
    setFilterLevel('');
    setFilterType('');
    setFilterOrganization('');
    setSearchQuery('');
  };

  const hasActiveFilters =
    filterCategory || filterLevel || filterType || filterOrganization || searchQuery;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage university courses and programs</p>
        </div>
        <Button variant="gradient" className="gap-2" onClick={() => navigate('/courses/add')}>
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by name, short name, or code..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter((c) => c.isActive !== false).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.filter((l) => l.isActive !== false).map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.filter((t) => t.isActive !== false).map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterOrganization} onValueChange={setFilterOrganization}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {filterCategory && filterCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Category: {getCategoryName(filterCategory)}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterCategory('')} />
              </Badge>
            )}
            {filterLevel && filterLevel !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Level: {getLevelName(filterLevel)}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterLevel('')} />
              </Badge>
            )}
            {filterType && filterType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Type: {getTypeName(filterType)}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterType('')} />
              </Badge>
            )}
            {filterOrganization && filterOrganization !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                University: {getOrganizationName(filterOrganization)}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterOrganization('')} />
              </Badge>
            )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <Card className="p-6">
            <div className="h-32 rounded-md bg-muted animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-3 bg-muted animate-pulse rounded w-full" />
            </div>
          </Card>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full">
            <Card className="flex flex-col items-center gap-4 py-16 text-center border-dashed bg-muted/40">
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                <FileText className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-foreground">No courses yet</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  Build your first program to unlock campaign tools, application flows, and reporting.
                  It only takes a few minutes to set up.
                </p>
              </div>
              <Button variant="gradient" onClick={() => navigate('/courses/add')} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            </Card>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="p-6 hover-lift">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">{getTypeName(course.courseTypeId)}</Badge>
                    <Badge variant="outline">{getLevelName(course.courseLevelId)}</Badge>
                  </div>
                  <Switch
                    checked={course.isActive}
                    onCheckedChange={() => handleToggleActive(course)}
                  />
                </div>

                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}

                <div>
                  <h3 className="font-semibold text-lg">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.shortName}</p>
                  {course.courseCode && (
                    <p className="text-xs text-muted-foreground mt-1">Code: {course.courseCode}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {getOrganizationName(course.organizationId || course.universityId)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/courses/${course.id}/campaign`)}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Campaign
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/courses/edit/${course.id}`)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicate(course)}>
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsAssignOutcomesOpen(true);
                    }}
                  >
                    <ListChecks className="w-3 h-3 mr-1" />
                    Outcomes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCourseToDelete(course)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {course.learningOutcomeIds && course.learningOutcomeIds.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {course.learningOutcomeIds.length} learning outcome(s) aligned
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <LearningOutcomeAssignDialog
        isOpen={isAssignOutcomesOpen}
        onClose={() => {
          setIsAssignOutcomesOpen(false);
          setSelectedCourse(null);
        }}
        onSave={handleAssignOutcomes}
        assignedOutcomeIds={selectedCourse?.learningOutcomeIds || []}
        availableOutcomes={learningOutcomes}
        courseName={selectedCourse?.name || ''}
      />

      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{courseToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Courses;


