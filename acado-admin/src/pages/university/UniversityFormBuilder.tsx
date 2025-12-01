import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Settings, 
  MapPin, 
  Calendar, 
  Save,
  ArrowLeft,
  ChevronRight,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  ApplicationField, 
  ConfiguredField, 
  ApplicationForm, 
  FieldCategory 
} from '@/types/application';
import { toast } from '@/components/ui/use-toast';
import { FormPreview } from '@/components/forms/FormPreview';
import { FormMappingDialog } from '@/components/forms/FormMappingDialog';
import { CategoryRenameDialog } from '@/components/forms/CategoryRenameDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMasterFieldsManagement } from '@/hooks/useMasterFieldsManagement';
import { formsApi, ConfiguredField as ApiConfiguredField } from '@/api/forms.api';
import { universitiesApi, Course, UniversityCourseSummary, UniversitySummary } from '@/api/universities.api';
import { coursesApi } from '@/api/courses.api';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UniversityFormBuilder = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { categories, fields } = useMasterFieldsManagement();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Get admin's university info
  const adminUniversityId = currentUser?.universityIds?.[0];
  const adminUniversityName = currentUser?.universityName;
  
  // Filter courses by admin's university
  const universityCourses = courses.filter((course: Course) => 
    course.universityId === adminUniversityId || course.organizationId === adminUniversityId
  );
  
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<ConfiguredField[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<FieldCategory[]>([]);
  const [customCategoryNames, setCustomCategoryNames] = useState<Record<string, { name: string; subcategories?: Record<string, string> }>>({});
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedMappingUniversityId, setSelectedMappingUniversityId] = useState<string>('');
  const [selectedMappingUniversityName, setSelectedMappingUniversityName] = useState<string>('');
  const [mappingCourses, setMappingCourses] = useState<UniversityCourseSummary[]>([]);
  const [selectedCategoryForRename, setSelectedCategoryForRename] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Get organization name from current user
  const getOrganizationName = () => {
    return adminUniversityName || 'Your University';
  };

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      if (!adminUniversityId) {
        console.warn('No university assigned to admin');
        return;
      }

      try {
        console.log('📚 UniversityFormBuilder: Fetching courses for university:', adminUniversityId);
        const coursesData = await coursesApi.list();
        console.log('✅ Courses fetched:', coursesData.length);
        
        // Filter for active courses by university
        const activeCourses = coursesData.filter((course: any) => {
          const belongsToUniversity = 
            course.universityId === adminUniversityId || 
            course.organizationId === adminUniversityId;
          const isActive = course.isActive !== false;
          return belongsToUniversity && isActive;
        });
        
        console.log('📚 Active university courses:', activeCourses.length);
        setCourses(activeCourses);
      } catch (err: any) {
        console.error('❌ Error fetching courses:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        // Don't show error if it's just courses failing - allow form creation without courses
        console.warn('⚠️ Continuing without courses...');
        setCourses([]);
        
        // Only set error if it's critical
        if (err.response?.status !== 404 && err.response?.status !== 401) {
          setError('Failed to load courses (you can still create forms)');
        }
      }
    };

    if (currentUser) {
      fetchCourses();
    }
  }, [currentUser, adminUniversityId]);

  // Fetch form data if editing
  useEffect(() => {
    if (formId && formId !== 'new') {
      const fetchForm = async () => {
        try {
          setLoading(true);
          setError(null);
          const form = await formsApi.getFormById(formId);
          
          setFormName(form.title);
          setFormDescription(form.description || '');
          setSelectedCourseIds(form.courseIds || []);
          setSelectedMappingUniversityId(form.universityId || '');
          setSelectedMappingUniversityName(form.universityName || '');
          setCustomCategoryNames(form.customCategoryNames || {});
          
          // Convert API fields to component fields
          const convertedFields = form.fields.map((field, index) => ({
            id: field.fieldId || field.name || `field-${index}`,
            name: field.name,
            label: field.label,
            customLabel: field.customLabel || field.label, // Ensure customLabel has a value
            type: field.type as any, // Type assertion for compatibility
            placeholder: field.placeholder || '',
            required: field.required || false,
            isVisible: field.isVisible !== undefined ? field.isVisible : true,
            isRequired: field.isRequired !== undefined ? field.isRequired : field.required || false,
            categoryId: field.categoryId,
            subcategoryId: field.subcategoryId || '',
            options: field.options || [],
            validation: field.validation || [],
            description: field.description || '',
            order: field.order !== undefined ? field.order : index
          })) as ConfiguredField[];
          
          console.log('Loaded form fields:', convertedFields);
          
          setSelectedFields(convertedFields);
          
          // Reconstruct selected categories from fields
          const categoryIds = new Set(convertedFields.map(f => f.categoryId));
          const selectedCats = categories.filter(c => categoryIds.has(c.id));
          setSelectedCategories(selectedCats);

          if (form.universityId) {
            try {
              const mappedCourses = await universitiesApi.getCoursesByUniversity(form.universityId);
              setMappingCourses(mappedCourses);
            } catch (coursesError) {
              console.warn('Failed to load mapped courses', coursesError);
            }
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchForm();
    }
  }, [formId, categories]);

  const handleAddField = (field: ApplicationField) => {
    const configuredField: ConfiguredField = {
      ...field,
      isVisible: true,
      isRequired: field.required
    };
    setSelectedFields([...selectedFields, configuredField]);
    
    // Add category if not already present
    const category = categories.find(c => c.id === field.categoryId);
    if (category && !selectedCategories.find(c => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
    
    // Remove category if no more fields from it
    const remainingFields = selectedFields.filter(f => f.id !== fieldId);
    const categoriesInUse = new Set(remainingFields.map(f => f.categoryId));
    setSelectedCategories(selectedCategories.filter(c => categoriesInUse.has(c.id)));
  };

  const handleUpdateField = (fieldId: string, updates: Partial<ConfiguredField>) => {
    setSelectedFields(selectedFields.map(f => 
      f.id === fieldId ? { ...f, ...updates } : f
    ));
  };

  const handleSaveForm = async () => {
    if (!formName) {
      toast({
        title: "Error",
        description: "Please provide a form name",
        variant: "destructive"
      });
      return;
    }

    if (selectedFields.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one field to the form",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      console.log('Saving form with fields:', selectedFields);
      
      // Convert component fields to API format
      const apiFields: ApiConfiguredField[] = selectedFields.map((field, index) => ({
        fieldId: field.id,
        name: field.name,
        label: field.label,
        customLabel: field.customLabel || field.label,
        type: field.type,
        placeholder: field.placeholder || '',
        required: field.required || false,
        isVisible: field.isVisible !== undefined ? field.isVisible : true,
        isRequired: field.isRequired !== undefined ? field.isRequired : field.required || false,
        categoryId: field.categoryId,
        subcategoryId: field.subcategoryId || undefined,
        options: field.options || [],
        validation: field.validation || [],
        description: field.description || '',
        order: index
      }));

      let courseLookupSource: UniversityCourseSummary[] = mappingCourses;

      // If we still don't have course data for the selected university, fetch it now
      if (courseLookupSource.length === 0 && selectedMappingUniversityId) {
        try {
          courseLookupSource = await universitiesApi.getCoursesByUniversity(selectedMappingUniversityId);
          setMappingCourses(courseLookupSource);
        } catch (lookupError) {
          console.warn('Unable to fetch courses for mapping lookup', lookupError);
        }
      }

      const selectedCourseNames = selectedCourseIds
        .map(id => {
          const course = courseLookupSource.find(c => String(c.id) === String(id));
          return course?.name || '';
        })
        .filter(name => name !== '');
      
      // Auto-assign admin's university ID and name
      const resolvedUniversityId = adminUniversityId || selectedMappingUniversityId || '';
      const resolvedUniversityName = adminUniversityName || selectedMappingUniversityName || getOrganizationName();
      
      // Get organization info from current user
      const organizationId = currentUser?.organizationId || '';
      const organizationName = currentUser?.organizationName || '';
      
      console.log('Form will be saved with:', {
        organizationId,
        organizationName,
        universityId: resolvedUniversityId,
        universityName: resolvedUniversityName,
        courseIds: selectedCourseIds
      });
      
      const formData = {
        name: formName.toLowerCase().replace(/\s+/g, '-'), // Create slug for form name
        title: formName,
        description: formDescription,
        organizationId,
        organizationName,
        universityId: resolvedUniversityId,
        universityName: resolvedUniversityName,
        courseIds: selectedCourseIds,
        courseNames: selectedCourseNames,
        fields: apiFields,
        customCategoryNames,
        status: 'draft' as const,
        isLaunched: false,
        isActive: true
      };

      console.log('Form data to save:', formData);

      if (formId && formId !== 'new') {
        console.log('Updating form with ID:', formId);
        const result = await formsApi.updateForm(formId, formData);
        console.log('Update result:', result);
        toast({
          title: "Form updated",
          description: "Application form has been updated successfully",
        });
      } else {
        console.log('Creating new form');
        const result = await formsApi.createForm(formData);
        console.log('Create result:', result);
        toast({
          title: "Form created",
          description: "Application form has been created successfully",
        });
      }
      
      navigate('/university/forms');
    } catch (err: any) {
      console.error('Error saving form:', err);
      console.error('Error response:', err.response);
      console.error('Error details:', err.response?.data);
      toast({
        title: "Error",
        description: err.response?.data?.error || err.response?.data?.message || err.message || "Failed to save form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMapping = (
    universityId: string,
    courseIds: string[],
    selectedCourses: UniversityCourseSummary[],
    university?: UniversitySummary
  ) => {
    setSelectedMappingUniversityId(universityId);
    setSelectedCourseIds(courseIds);
    setMappingCourses(selectedCourses);
    setSelectedMappingUniversityName(university?.name || '');
    setShowMappingDialog(false);
    toast({
      title: "Success",
      description: "Form mapping updated successfully"
    });
  };

  const handleRenameCategory = (categoryId: string) => {
    setSelectedCategoryForRename(categoryId);
    setShowRenameDialog(true);
  };

  const handleSaveRename = (categoryId: string, newName: string, subcategoryRenames?: Record<string, string>) => {
    setCustomCategoryNames({
      ...customCategoryNames,
      [categoryId]: {
        name: newName,
        subcategories: subcategoryRenames
      }
    });
    setShowRenameDialog(false);
  };

  const filteredFields = fields.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || field.categoryId === selectedCategoryFilter;
    const notSelected = !selectedFields.some(f => f.id === field.id);
    return matchesSearch && matchesCategory && notSelected;
  });

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/university/forms')}>
              Back to Forms
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/university/forms')}
              disabled={saving}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {formId && formId !== 'new' ? 'Edit Form' : 'Create New Form'}
              </h1>
              <p className="text-muted-foreground">Build custom application forms for your courses</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowMappingDialog(true)}
              disabled={saving}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Map to Courses ({selectedCourseIds.length})
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(true)}
              disabled={saving}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSaveForm}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Form
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Form Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Form Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="formName">Form Name *</Label>
                  <Input
                    id="formName"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., MBA Application Form"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="formDescription">Description</Label>
                  <Textarea
                    id="formDescription"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of the form"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                {selectedCourseIds.length > 0 && (
                  <div>
                    <Label>Mapped Courses</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCourseIds.map(courseId => {
                        const course = universityCourses.find(c => c.id === courseId);
                        return course ? (
                          <Badge key={courseId} variant="secondary">
                            {course.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Form Builder */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Form Fields</h3>
                <Button 
                  onClick={() => setShowFieldDialog(true)}
                  disabled={saving}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fields
                </Button>
              </div>

              {selectedCategories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No fields added yet</p>
                  <p className="text-sm mb-4">Add fields to start building your form</p>
                  <Button 
                    onClick={() => setShowFieldDialog(true)}
                    disabled={saving}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fields
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedCategories.map((category) => {
                    const categoryFields = selectedFields.filter(f => f.categoryId === category.id);
                    const displayName = customCategoryNames[category.id]?.name || category.name;
                    
                    return (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{displayName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {categoryFields.length} fields
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRenameCategory(category.id)}
                            disabled={saving}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Rename
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {categoryFields.map((field) => (
                            <div
                              key={field.id}
                              className="border rounded-lg p-4 bg-background hover:bg-accent/5 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move mt-2" />
                                <div className="flex-1 space-y-3">
                                  {/* Field Label and Placeholder Editor */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <Label htmlFor={`label-${field.id}`} className="text-xs text-muted-foreground">
                                        Field Label *
                                      </Label>
                                      <Input
                                        id={`label-${field.id}`}
                                        value={field.customLabel || field.label}
                                        onChange={(e) => 
                                          handleUpdateField(field.id, { customLabel: e.target.value })
                                        }
                                        placeholder="Field label"
                                        className="font-medium"
                                        disabled={saving}
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor={`placeholder-${field.id}`} className="text-xs text-muted-foreground">
                                        Placeholder (optional)
                                      </Label>
                                      <Input
                                        id={`placeholder-${field.id}`}
                                        value={field.placeholder || ''}
                                        onChange={(e) => 
                                          handleUpdateField(field.id, { placeholder: e.target.value })
                                        }
                                        placeholder="Enter placeholder text..."
                                        disabled={saving}
                                      />
                                    </div>
                                  </div>

                                  {/* Field Description Editor */}
                                  {field.description !== undefined && (
                                    <div className="space-y-2">
                                      <Label htmlFor={`description-${field.id}`} className="text-xs text-muted-foreground">
                                        Help Text (optional)
                                      </Label>
                                      <Input
                                        id={`description-${field.id}`}
                                        value={field.description || ''}
                                        onChange={(e) => 
                                          handleUpdateField(field.id, { description: e.target.value })
                                        }
                                        placeholder="Additional help text for this field..."
                                        disabled={saving}
                                      />
                                    </div>
                                  )}
                                  
                                  {/* Field Type Badge and Info */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="text-xs">
                                      Type: {field.type}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      ID: {field.name}
                                    </Badge>
                                    {field.label !== (field.customLabel || field.label) && (
                                      <span className="text-xs text-muted-foreground">
                                        Original: {field.label}
                                      </span>
                                    )}
                                  </div>

                                  {/* Controls */}
                                  <div className="flex items-center gap-4 pt-2 border-t">
                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        id={`visible-${field.id}`}
                                        checked={field.isVisible}
                                        onCheckedChange={(checked) => 
                                          handleUpdateField(field.id, { isVisible: checked as boolean })
                                        }
                                        disabled={saving}
                                      />
                                      <Label htmlFor={`visible-${field.id}`} className="text-sm cursor-pointer">
                                        Visible
                                      </Label>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        id={`required-${field.id}`}
                                        checked={field.isRequired}
                                        onCheckedChange={(checked) => 
                                          handleUpdateField(field.id, { isRequired: checked as boolean })
                                        }
                                        disabled={saving}
                                      />
                                      <Label htmlFor={`required-${field.id}`} className="text-sm cursor-pointer">
                                        Required
                                      </Label>
                                    </div>

                                    <div className="flex-1" />
                                    
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => handleRemoveField(field.id)}
                                      disabled={saving}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Form Summary</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Total Fields</Label>
                  <p className="text-2xl font-bold">{selectedFields.length}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Required Fields</Label>
                  <p className="text-2xl font-bold">
                    {selectedFields.filter(f => f.isRequired).length}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Categories</Label>
                  <p className="text-2xl font-bold">{selectedCategories.length}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mapped Courses</Label>
                  <p className="text-2xl font-bold">{selectedCourseIds.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => setShowFieldDialog(true)}
                  disabled={saving}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Fields
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => setShowMappingDialog(true)}
                  disabled={saving}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Map to Courses
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => setShowPreview(true)}
                  disabled={saving}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Form
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Fields Dialog */}
      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Fields to Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {categories.map(category => {
                  const categoryFields = filteredFields.filter(f => f.categoryId === category.id);
                  if (categoryFields.length === 0) return null;
                  
                  return (
                    <div key={category.id}>
                      <h4 className="font-medium mb-2">{category.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categoryFields.map(field => (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                              handleAddField(field);
                              setSearchTerm('');
                            }}
                          >
                            <div>
                              <p className="font-medium text-sm">{field.label}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {field.type}
                              </Badge>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mapping Dialog */}
      <FormMappingDialog
        isOpen={showMappingDialog}
        onClose={() => setShowMappingDialog(false)}
        selectedCourseIds={selectedCourseIds}
        onSave={handleSaveMapping}
        initialUniversityId={selectedMappingUniversityId}
      />

      {/* Rename Category Dialog */}
      {selectedCategoryForRename && (
        <CategoryRenameDialog
          isOpen={showRenameDialog}
          onClose={() => setShowRenameDialog(false)}
          categories={categories}
          customNames={customCategoryNames}
          onSave={(customNames) => {
            setCustomCategoryNames(customNames);
            setShowRenameDialog(false);
          }}
        />
      )}

      {/* Preview Dialog */}
      <FormPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        form={{
          id: formId || 'preview',
          name: formName,
          description: formDescription,
          universityId: universityCourses.length > 0 ? universityCourses[0].id : '',
          courseIds: selectedCourseIds,
          categories: selectedCategories,
          fields: selectedFields,
          customCategoryNames,
          isLaunched: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        }}
      />
    </div>
  );
};

export default UniversityFormBuilder;