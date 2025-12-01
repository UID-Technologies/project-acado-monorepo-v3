import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { toast } from '@/hooks/use-toast';
import { courseCategoriesApi } from '@/api/courseCategories.api';
import { courseLevelsApi } from '@/api/courseLevels.api';
import { courseTypesApi } from '@/api/courseTypes.api';
import { coursesApi, UpsertCoursePayload } from '@/api/courses.api';
import { useAuth } from '@/hooks/useAuth';
import { generateSlug } from '@/lib/slug';

const UniversityAddCourse = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [courseCategoryId, setCourseCategoryId] = useState('');
  const [courseLevelId, setCourseLevelId] = useState('');
  const [courseTypeId, setCourseTypeId] = useState('');
  const [duration, setDuration] = useState('');
  const [credits, setCredits] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [types, setTypes] = useState<CourseType[]>([]);
  const [referenceLoading, setReferenceLoading] = useState(true);

  // Get admin's university info
  const adminUniversityId = currentUser?.universityIds?.[0];
  const adminUniversityName = currentUser?.universityName;

  useEffect(() => {
    if (!adminUniversityId) {
      toast({
        title: 'No University Assigned',
        description: 'Your account is not associated with any university.',
        variant: 'destructive',
      });
      navigate('/university/courses');
      return;
    }
    loadReferenceData();
  }, [adminUniversityId, navigate]);

  const loadReferenceData = async () => {
    try {
      setReferenceLoading(true);
      const [categoriesRes, levelsRes, typesRes] = await Promise.all([
        courseCategoriesApi.list({ includeInactive: true }),
        courseLevelsApi.list({ includeInactive: true }),
        courseTypesApi.list({ includeInactive: true }),
      ]);
      setCategories(categoriesRes);
      setLevels(levelsRes);
      setTypes(typesRes);
    } catch (error: any) {
      toast({
        title: 'Failed to load reference data',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setReferenceLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminUniversityId || !adminUniversityName) {
      toast({
        title: 'Error',
        description: 'No university assigned to your account.',
        variant: 'destructive',
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: 'Course name required',
        description: 'Please enter a course name.',
        variant: 'destructive',
      });
      return;
    }

    if (!shortName.trim() || shortName.trim().length < 2) {
      toast({
        title: 'Short name required',
        description: 'Please enter a short name (min 2 characters).',
        variant: 'destructive',
      });
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      toast({
        title: 'Description required',
        description: 'Please enter a description (min 10 characters).',
        variant: 'destructive',
      });
      return;
    }

    if (!courseCategoryId || !courseLevelId || !courseTypeId) {
      toast({
        title: 'Required fields missing',
        description: 'Please select category, level, and type.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const payload: UpsertCoursePayload = {
        name: name.trim(),
        shortName: shortName.trim(),
        slug: generateSlug(name),
        courseCode: code.trim() || undefined,
        description: description.trim(),
        courseCategoryId,
        courseLevelId,
        courseTypeId,
        universityId: adminUniversityId, // Auto-set to admin's university
        universityName: adminUniversityName,
        duration: duration.trim() || undefined,
        credits: credits ? parseInt(credits) : undefined,
        isActive,
      };

      console.log('Creating course:', payload);
      await coursesApi.create(payload);

      toast({
        title: 'Course Created',
        description: `${name} has been successfully created.`,
      });

      navigate('/university/courses');
    } catch (error: any) {
      console.error('Failed to create course:', error);
      toast({
        title: 'Failed to create course',
        description: error?.response?.data?.error || error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (referenceLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/university/courses')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Course</h1>
          <p className="text-muted-foreground mt-1">
            Create a new course for {adminUniversityName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>
              All courses will be automatically assigned to {adminUniversityName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  Course Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Introduction to Computer Science"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortName">
                  Short Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="shortName"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="Intro to CS"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="CS101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 4 years, 6 months"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  placeholder="3"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={courseCategoryId}
                  onValueChange={setCourseCategoryId}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c.isActive !== false)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">
                  Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={courseLevelId}
                  onValueChange={setCourseLevelId}
                  required
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels
                      .filter((l) => l.isActive !== false)
                      .map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={courseTypeId}
                  onValueChange={setCourseTypeId}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types
                      .filter((t) => t.isActive !== false)
                      .map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                  <span className="text-xs text-muted-foreground ml-2">(min 10 characters)</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter course description (minimum 10 characters)..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2 md:col-span-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active (Course will be visible to students)
                </Label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/university/courses')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Course
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default UniversityAddCourse;

