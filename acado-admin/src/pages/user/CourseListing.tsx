import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Star, Users, Filter, X, Loader2, AlertCircle, GraduationCap } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { universitiesApi, Course as ApiCourse, University } from "@/api/universities.api";
import { toast } from "@/components/ui/use-toast";

// Import placeholder for course images
import { coursePlaceholder } from "@/assets/courses/placeholder";

const categories = [
  "Artificial Intelligence",
  "Automation & Robotics",
  "Block Chain",
  "Business Intelligence",
  "Business Management",
  "Construction",
  "Cyber Security",
  "Digital Marketing",
  "Engineering",
  "Healthcare",
  "Hospitality",
  "Law",
  "Nursing",
  "Social Services",
  "Tourism"
];

const CourseListing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // API state
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses and universities on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [coursesData, universitiesData] = await Promise.all([
          universitiesApi.getCourses(),
          universitiesApi.getUniversities()
        ]);
        
        setCourses(coursesData);
        setUniversities(universitiesData);
      } catch (err: any) {
        console.error('Error fetching data:', err);
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

    fetchData();
  }, []);

  // Create a map of university ID to university name
  const universityMap = universities.reduce((acc, uni) => {
    acc[uni.id] = uni.name;
    return acc;
  }, {} as Record<string, string>);

  const filteredCourses = courses.filter(course => {
    const universityName = universityMap[course.universityId] || '';
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(course.type);
    const matchesUniversity = selectedUniversities.length === 0 || selectedUniversities.includes(universityName);
    
    return matchesSearch && matchesType && matchesUniversity && course.isActive;
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleUniversityToggle = (university: string) => {
    setSelectedUniversities(prev =>
      prev.includes(university)
        ? prev.filter(u => u !== university)
        : [...prev, university]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedUniversities([]);
    setSelectedTypes([]);
    setSearchQuery("");
  };

  // Get unique course types from API data
  const courseTypes = [
    { value: 'degree', label: 'Degree' },
    { value: 'exchange', label: 'Exchange' },
    { value: 'pathway', label: 'Pathway' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'certification', label: 'Certification' }
  ];

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="mb-4"
        >
          Clear Filters
        </Button>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-3">Course Type</h3>
            <div className="space-y-2">
              {courseTypes.map(type => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={() => handleTypeToggle(type.value)}
                  />
                  <label
                    htmlFor={type.value}
                    className="text-sm cursor-pointer hover:text-primary capitalize"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Universities</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {universities.map(university => (
                  <div key={university.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={university.id}
                      checked={selectedUniversities.includes(university.name)}
                      onCheckedChange={() => handleUniversityToggle(university.name)}
                    />
                    <label
                      htmlFor={university.id}
                      className="text-sm cursor-pointer hover:text-primary"
                    >
                      {university.name}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Course Discovery Tool</h1>
            <p className="text-lg opacity-90">Find your perfect study abroad program</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground text-lg">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Course Discovery Tool</h1>
            <p className="text-lg opacity-90">Find your perfect study abroad program</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Course Discovery Tool</h1>
          <p className="text-lg opacity-90">Find your perfect study abroad program</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="lg:hidden">
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSection />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Filters</h2>
              </CardHeader>
              <CardContent>
                <FilterSection />
              </CardContent>
            </Card>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {filteredCourses.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map(course => {
                  const universityName = universityMap[course.universityId] || 'Unknown University';
                  
                  return (
                    <Card 
                      key={course.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => navigate(`/user/courses/${course.id}`)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                        <img 
                          src={coursePlaceholder} 
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-background/90 capitalize">
                            {course.type}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-background/90 capitalize">
                            {course.level}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {course.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {universityName}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="pb-3">
                        {course.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {course.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          {course.fee && (
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">
                                {course.currency || 'USD'} {course.fee.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="capitalize">{course.type}</Badge>
                          <Badge variant="outline" className="capitalize">{course.level}</Badge>
                        </div>
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/user/courses/${course.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListing;