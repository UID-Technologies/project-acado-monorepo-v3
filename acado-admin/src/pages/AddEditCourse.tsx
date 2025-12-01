import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Upload, Image as ImageIcon, Video, Link2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course } from '@/types/course';
import { CourseCategory } from '@/types/courseCategory';
import { CourseLevel } from '@/types/courseLevel';
import { CourseType } from '@/types/courseType';
import { toast } from '@/hooks/use-toast';
import { courseCategoriesApi } from '@/api/courseCategories.api';
import { courseLevelsApi } from '@/api/courseLevels.api';
import { courseTypesApi } from '@/api/courseTypes.api';
import { coursesApi, UpsertCoursePayload } from '@/api/courses.api';
import { universitiesApi, UniversitySummary } from '@/api/universities.api';
import { generateSlug, generateRandomCode } from '@/lib/slug';
import { CodeField } from '@/components/form/CodeField';
import { TagInput } from '@/components/form/TagInput';
import { parseKeywords, formatKeywords } from '@/lib/keywords';

const AddEditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'url'>('url');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerMode, setBannerMode] = useState<'upload' | 'url'>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('url');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [courseCategoryId, setCourseCategoryId] = useState('');
  const [courseLevelId, setCourseLevelId] = useState('');
  const [courseTypeId, setCourseTypeId] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [types, setTypes] = useState<CourseType[]>([]);
  const [organizations, setOrganizations] = useState<UniversitySummary[]>([]);
  const [learningOutcomeIds, setLearningOutcomeIds] = useState<string[]>([]);
  const [referenceLoading, setReferenceLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setInitialLoading(true);
      try {
        await loadReferenceData();
        if (courseId) {
          await loadCourse(courseId);
        } else {
          setLearningOutcomeIds([]);
          setKeywords([]);
        }
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [courseId]);

  const loadReferenceData = async () => {
    try {
      setReferenceLoading(true);
      const [categoriesRes, levelsRes, typesRes, universitiesRes] = await Promise.all([
        courseCategoriesApi.list({ includeInactive: true }),
        courseLevelsApi.list({ includeInactive: true }),
        courseTypesApi.list({ includeInactive: true }),
        universitiesApi.getUniversities({ page: 1, pageSize: 200 }),
      ]);
      setCategories(categoriesRes);
      setLevels(levelsRes);
      setTypes(typesRes);
      setOrganizations(universitiesRes.data ?? []);
    } catch (error: any) {
      toast({
        title: 'Failed to load reference data',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setReferenceLoading(false);
    }
  };

  const loadCourse = async (id: string) => {
    try {
      const course = await coursesApi.get(id);
      setName(course.name);
      setShortName(course.shortName);
      setCourseCode(course.courseCode || '');
      setThumbnail(course.thumbnail || '');
      setBannerImage(course.bannerImage || '');
      setVideoUrl(course.videoUrl || '');
      setDescription(course.description);
      setKeywords(parseKeywords(course.keywords));
      setCourseCategoryId(course.courseCategoryId || course.categoryId || '');
      setCourseLevelId(course.courseLevelId || course.levelId || '');
      setCourseTypeId(course.courseTypeId || course.typeId || '');
      setOrganizationId(course.universityId || '');
      setStartDate(course.startDate ? course.startDate.slice(0, 10) : '');
      setEndDate(course.endDate ? course.endDate.slice(0, 10) : '');
      setIsActive(course.isActive);
      setLearningOutcomeIds(course.learningOutcomeIds || []);
    } catch (error: any) {
      toast({
        title: 'Failed to load course',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !shortName.trim() || !description.trim() || !courseCategoryId || !courseLevelId || !courseTypeId || !organizationId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const payload: UpsertCoursePayload = {
      universityId: organizationId,
      universityName: organizations.find((org) => org.id === organizationId)?.name,
      name: name.trim(),
      shortName: shortName.trim(),
      courseCode: courseCode.trim() || undefined,
      thumbnail: thumbnail.trim() || undefined,
      bannerImage: bannerImage.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      description: description.trim(),
      keywords: formatKeywords(keywords),
      courseCategoryId: courseCategoryId || undefined,
      courseLevelId: courseLevelId || undefined,
      courseTypeId: courseTypeId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      learningOutcomeIds,
      isActive,
    };

    try {
      if (courseId) {
        await coursesApi.update(courseId, payload);
        toast({ title: 'Success', description: 'Course updated successfully' });
      } else {
        await coursesApi.create(payload);
        toast({ title: 'Success', description: 'Course created successfully' });
      }
      navigate('/courses');
    } catch (error: any) {
      toast({
        title: 'Failed to save course',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File, type: 'thumbnail' | 'banner' | 'video') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'thumbnail') {
        setThumbnail(base64String);
      } else if (type === 'banner') {
        setBannerImage(base64String);
      } else {
        setVideoUrl(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const activeCategories = categories.filter((c) => c.isActive !== false);
  const activeLevels = levels.filter((l) => l.isActive !== false);
  const activeTypes = types.filter((t) => t.isActive !== false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{courseId ? 'Edit Course' : 'Create New Course'}</h1>
            <p className="text-muted-foreground mt-1">
              {courseId ? 'Update course information and settings' : 'Fill in the details to create a new course'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/courses')}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSubmit} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : courseId ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Essential details about the course</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => {
                    if (!shortName.trim() && name.trim()) {
                      setShortName(generateSlug(name));
                    }
                  }}
                  placeholder="e.g., Master of Computer Science"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortName">
                  Short Name (slug) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="shortName"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="e.g., MSc CS"
                  required
                />
              </div>

              <CodeField
                id="courseCode"
                label="Course Code"
                value={courseCode}
                onChange={setCourseCode}
                onGenerate={() => setCourseCode(generateRandomCode(6))}
                placeholder="e.g., CS-501"
              />

              <div className="space-y-2">
                <Label htmlFor="organizationId">University <span className="text-destructive">*</span></Label>
                <Select
                  value={organizationId}
                  onValueChange={setOrganizationId}
                  required
                  disabled={referenceLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id.toString()} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the course..."
                rows={6}
                required
              />
            </div>

            <TagInput
              id="keywords"
              label="Keywords"
              value={keywords}
              onChange={setKeywords}
              placeholder="Type a keyword and press Enter"
              description="Keywords help learners discover this course."
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Course Classification</h2>
              <p className="text-sm text-muted-foreground">Categorize and classify the course</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCategoryId">Category <span className="text-destructive">*</span></Label>
                <Select
                  value={courseCategoryId}
                  onValueChange={setCourseCategoryId}
                  required
                  disabled={referenceLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseLevelId">Level <span className="text-destructive">*</span></Label>
                <Select
                  value={courseLevelId}
                  onValueChange={setCourseLevelId}
                  required
                  disabled={referenceLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseTypeId">Type <span className="text-destructive">*</span></Label>
                <Select
                  value={courseTypeId}
                  onValueChange={setCourseTypeId}
                  required
                  disabled={referenceLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Media & Resources</h2>
              <p className="text-sm text-muted-foreground">Add visual content and video resources</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base">
                  <ImageIcon className="w-4 h-4" />
                  Thumbnail Image
                </Label>
                <Tabs value={thumbnailMode} onValueChange={(v) => setThumbnailMode(v as 'upload' | 'url')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url" className="gap-2">
                      <Link2 className="w-3 h-3" />
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="w-3 h-3" />
                      Upload
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-2">
                    <Input
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                      type="url"
                    />
                  </TabsContent>
                  <TabsContent value="upload" className="space-y-2">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('thumbnail-upload')?.click()}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                      <Input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'thumbnail');
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                {thumbnail && (
                  <div className="rounded-md border overflow-hidden">
                    <img src={thumbnail} alt="Thumbnail preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base">
                  <ImageIcon className="w-4 h-4" />
                  Banner Image
                </Label>
                <Tabs value={bannerMode} onValueChange={(v) => setBannerMode(v as 'upload' | 'url')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url" className="gap-2">
                      <Link2 className="w-3 h-3" />
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="w-3 h-3" />
                      Upload
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-2">
                    <Input
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                      type="url"
                    />
                  </TabsContent>
                  <TabsContent value="upload" className="space-y-2">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('banner-upload')?.click()}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                      <Input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'banner');
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                {bannerImage && (
                  <div className="rounded-md border overflow-hidden">
                    <img src={bannerImage} alt="Banner preview" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label className="flex items-center gap-2 text-base">
                  <Video className="w-4 h-4" />
                  Course Video
                </Label>
                <Tabs value={videoMode} onValueChange={(v) => setVideoMode(v as 'upload' | 'url')}>
                  <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="url" className="gap-2">
                      <Link2 className="w-3 h-3" />
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="w-3 h-3" />
                      Upload
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-2">
                    <Input
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/embed/... or video URL"
                      type="url"
                    />
                  </TabsContent>
                  <TabsContent value="upload" className="space-y-2">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('video-upload')?.click()}
                    >
                      <Video className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">MP4, WebM up to 100MB</p>
                      <Input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'video');
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                {videoUrl && videoUrl.startsWith('data:video') && (
                  <div className="rounded-md border overflow-hidden">
                    <video src={videoUrl} controls className="w-full h-48" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Schedule & Status</h2>
              <p className="text-sm text-muted-foreground">Set course duration and availability</p>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-base">Course Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {isActive ? 'Course is currently active and visible' : 'Course is inactive and hidden'}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default AddEditCourse;
