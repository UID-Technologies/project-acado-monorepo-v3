import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Users,
  Calendar,
  Target,
  MoreVertical,
  GraduationCap,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { coursesApi } from '@/api/courses.api';
import { Course } from '@/types/course';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UniversityCourses = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Get admin's university ID
  const adminUniversityId = currentUser?.universityIds?.[0];
  const adminUniversityName = currentUser?.universityName;

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      if (!adminUniversityId) {
        setError('No university assigned to your account');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching courses for university:', adminUniversityId);
        
        // Fetch courses filtered by university ID
        const coursesData = await coursesApi.list();
        
        // Filter courses by university ID on client side (backend also filters)
        const universityCourses = coursesData.filter((course: Course) => 
          course.universityId === adminUniversityId || course.organizationId === adminUniversityId
        );
        
        setCourses(universityCourses);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.response?.data?.error || 'Failed to load courses');
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchCourses();
    }
  }, [adminUniversityId, currentUser]);

  const filteredCourses = courses.filter(course =>
    course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await coursesApi.delete(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
      toast({
        title: "Course deleted",
        description: "The course has been removed successfully",
      });
    } catch (err: any) {
      console.error('Error deleting course:', err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const getCourseTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      degree: 'default',
      exchange: 'secondary',
      pathway: 'outline',
      diploma: 'default',
      certification: 'secondary'
    };
    return colors[type?.toLowerCase()] || 'default';
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage courses for {adminUniversityName || 'your university'}
          </p>
        </div>
        <Button onClick={() => navigate('/university/courses/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search courses by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {courses.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first course</p>
              <Button onClick={() => navigate('/university/courses/add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {courses.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All Courses ({filteredCourses.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({filteredCourses.filter(c => c.isActive !== false).length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive ({filteredCourses.filter(c => c.isActive === false).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          {course.name}
                          {course.code && (
                            <span className="text-sm text-muted-foreground font-normal">
                              ({course.code})
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {course.categoryName || 'No Category'} • {course.levelName || 'No Level'}
                          {course.typeName && ` • ${course.typeName}`}
                        </CardDescription>
                        {course.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {course.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={course.isActive !== false ? 'default' : 'secondary'}>
                          {course.isActive !== false ? 'Active' : 'Inactive'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {course.duration && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-sm text-muted-foreground">{course.duration}</p>
                          </div>
                        </div>
                      )}
                      {course.credits !== undefined && (
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Credits</p>
                            <p className="text-sm text-muted-foreground">{course.credits}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Level</p>
                          <p className="text-sm text-muted-foreground">{course.levelName || 'Not Set'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/courses/${course.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses
                .filter(course => course.isActive !== false)
                .map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            {course.name}
                            {course.code && (
                              <span className="text-sm text-muted-foreground font-normal">
                                ({course.code})
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {course.categoryName || 'No Category'} • {course.levelName || 'No Level'}
                          </CardDescription>
                          {course.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {course.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Active</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteCourse(course.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {course.duration && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Duration</p>
                              <p className="text-sm text-muted-foreground">{course.duration}</p>
                            </div>
                          </div>
                        )}
                        {course.credits !== undefined && (
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Credits</p>
                              <p className="text-sm text-muted-foreground">{course.credits}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Level</p>
                            <p className="text-sm text-muted-foreground">{course.levelName || 'Not Set'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/courses/${course.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredCourses
                .filter(course => course.isActive === false)
                .map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            {course.name}
                            {course.code && (
                              <span className="text-sm text-muted-foreground font-normal">
                                ({course.code})
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {course.categoryName || 'No Category'} • {course.levelName || 'No Level'}
                          </CardDescription>
                          {course.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {course.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Inactive</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteCourse(course.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {course.duration && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Duration</p>
                              <p className="text-sm text-muted-foreground">{course.duration}</p>
                            </div>
                          </div>
                        )}
                        {course.credits !== undefined && (
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Credits</p>
                              <p className="text-sm text-muted-foreground">{course.credits}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Level</p>
                            <p className="text-sm text-muted-foreground">{course.levelName || 'Not Set'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/courses/${course.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default UniversityCourses;

