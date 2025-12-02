import React, { useState, useEffect } from 'react';
import { Link, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { universitiesApi, type UniversitySummary, type UniversityCourseSummary } from '@/api/universities.api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FormMappingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourseIds: string[];
  onSave: (
    universityId: string,
    courseIds: string[],
    selectedCourses: UniversityCourseSummary[],
    university?: UniversitySummary
  ) => void;
  initialUniversityId?: string;
}

export const FormMappingDialog: React.FC<FormMappingDialogProps> = ({
  isOpen,
  onClose,
  selectedCourseIds,
  onSave,
  initialUniversityId,
}) => {
  const [courseIds, setCourseIds] = useState<string[]>(selectedCourseIds);
  const [courses, setCourses] = useState<UniversityCourseSummary[]>([]);
  const [universities, setUniversities] = useState<UniversitySummary[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>(initialUniversityId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingUniversities, setLoadingUniversities] = useState(false);

  const userRole = (() => {
    const raw = localStorage.getItem('user');
    if (!raw) return '';
    try {
      const parsed = JSON.parse(raw);
      return (parsed.role || '').toLowerCase();
    } catch (error) {
      console.warn('Unable to parse user from storage', error);
      return '';
    }
  })();

  const isSuperAdmin = userRole === 'superadmin';

  const deriveDefaultUniversity = (list: UniversitySummary[]) => {
    if (isSuperAdmin) return '';
    const raw = localStorage.getItem('user');
    if (!raw) return '';
    try {
      const parsed = JSON.parse(raw);
      const inferred =
        parsed.universityId ||
        parsed.university_id ||
        parsed.organizationId ||
        parsed.organization_id ||
        '';
      if (inferred) {
        return inferred;
      }
      if (list.length === 1) {
        return list[0].id;
      }
      return '';
    } catch (error) {
      return '';
    }
  };

  // Fetch initial data when dialog opens
  useEffect(() => {
    if (!isOpen) return;

    const bootstrap = async () => {
      setCourseIds(selectedCourseIds);
      setCourses([]);
      setError(null);

      const summary = await fetchUniversities();

      let defaultUniversityId = initialUniversityId || deriveDefaultUniversity(summary);

      if (!defaultUniversityId && summary.length > 0) {
        defaultUniversityId = summary[0].id;
      }

      setSelectedUniversityId(defaultUniversityId);

      if (defaultUniversityId) {
        await fetchCourses(defaultUniversityId);
      }
    };

    bootstrap();
  }, [isOpen, initialUniversityId, selectedCourseIds]);

  useEffect(() => {
    if (!isOpen) return;
    if (initialUniversityId) {
      setSelectedUniversityId(initialUniversityId);
    }
  }, [initialUniversityId, isOpen]);

  const fetchUniversities = async () => {
    try {
      setLoadingUniversities(true);
      // Fetch all universities - backend returns array directly
      const list = await universitiesApi.getUniversities({ isActive: true });
      setUniversities(list);
      return list;
    } catch (err: any) {
      console.error('Failed to fetch universities', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to load universities');
      return [];
    } finally {
      setLoadingUniversities(false);
    }
  };

  const fetchCourses = async (universityId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await universitiesApi.getCoursesByUniversity(universityId);
      setCourses(response);
      setCourseIds((prev) => prev.filter((id) => response.some((course) => course.id === id)));
    } catch (err: any) {
      console.error('Failed to fetch courses:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseToggle = (courseId: string, checked: boolean) => {
    if (checked) {
      setCourseIds([...courseIds, courseId]);
    } else {
      setCourseIds(courseIds.filter(id => id !== courseId));
    }
  };

  const handleSave = () => {
    const selectedCourses = courses.filter((course) => courseIds.includes(course.id));
    const selectedUniversity = universities.find((uni) => uni.id === selectedUniversityId);
    onSave(selectedUniversityId, courseIds, selectedCourses, selectedUniversity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Attach Courses to Form</DialogTitle>
          <DialogDescription>
            Select courses to associate with this application form
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select University</Label>
            {loadingUniversities ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading universities...
              </div>
            ) : universities.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No universities available.</AlertDescription>
              </Alert>
            ) : (
              <Select
                value={selectedUniversityId || undefined}
                onValueChange={(nextId) => {
                  setSelectedUniversityId(nextId);
                  setCourseIds([]);
                  setCourses([]);
                  if (nextId) {
                    fetchCourses(nextId);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Course Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Courses</Label>
            {!selectedUniversityId ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select a university to view available courses.
                </AlertDescription>
              </Alert>
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading courses...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => fetchCourses(selectedUniversityId)}
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : courses.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No courses available for the selected university.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                {courses.map((course) => {
                  const isSelected = courseIds.includes(course.id);
                  return (
                    <div
                      key={course.id}
                      className={cn(
                        'flex items-center gap-3 rounded-md border px-3 py-2 transition-colors',
                        isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-muted/20'
                      )}
                    >
                      <Checkbox
                        id={course.id}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleCourseToggle(course.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={course.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{course.name}</p>
                          {(course.code || course.status) && (
                            <p className="text-xs text-muted-foreground">
                              {[course.code, course.status].filter(Boolean).join(' • ')}
                            </p>
                          )}
                          {course.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="gap-2"
            disabled={loading || !selectedUniversityId || courseIds.length === 0}
          >
            <Link className="w-4 h-4" />
            {courseIds.length === 0 ? 'Select Courses' : `Attach ${courseIds.length} Course${courseIds.length > 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};