import React, { useState } from 'react';
import { 
  Search, Filter, ChevronRight, ChevronDown, Plus, Edit2, Trash2,
  User, GraduationCap, Briefcase, Lightbulb, Award,
  FileText, PenTool, Users, DollarSign, Settings,
  Folder, Globe, Heart, Star, Shield, MoreVertical
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMasterFieldsManagement } from '@/hooks/useMasterFieldsManagement';
import { AddCategoryDialog } from '@/components/masterFields/AddCategoryDialog';
import { AddSubcategoryDialog } from '@/components/masterFields/AddSubcategoryDialog';
import { AddFieldDialog } from '@/components/masterFields/AddFieldDialog';
import { FieldCategory, ApplicationField } from '@/types/application';
import { useToast } from '@/hooks/use-toast';
import { extractErrorMessage } from '@/utils/errorUtils';

const MasterFields = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState<FieldCategory | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<FieldCategory | null>(null);

  const { toast } = useToast();

  const {
    categories,
    fields,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    addField,
    deleteField,
  } = useMasterFieldsManagement();

  const iconMap: Record<string, React.ComponentType<any>> = {
    User,
    GraduationCap,
    Briefcase,
    Lightbulb,
    Award,
    FileText,
    PenTool,
    Users,
    DollarSign,
    Settings,
    Folder,
    Globe,
    Heart,
    Star,
    Shield
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredFields = fields.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          field.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || field.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFieldsByCategory = (categoryId: string, subcategoryId?: string) => {
    return filteredFields.filter(field => 
      field.categoryId === categoryId && 
      (!subcategoryId || field.subcategoryId === subcategoryId)
    );
  };

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: 'bg-blue-100 text-blue-700',
      email: 'bg-green-100 text-green-700',
      tel: 'bg-purple-100 text-purple-700',
      number: 'bg-yellow-100 text-yellow-700',
      date: 'bg-pink-100 text-pink-700',
      select: 'bg-indigo-100 text-indigo-700',
      textarea: 'bg-orange-100 text-orange-700',
      file: 'bg-red-100 text-red-700',
      checkbox: 'bg-teal-100 text-teal-700',
      country: 'bg-cyan-100 text-cyan-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const handleAddCategory = async (category: Omit<FieldCategory, 'id'>) => {
    try {
      await addCategory(category);
      toast({
        title: "Success!",
        description: "Category created successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Failed to create category",
        description: extractErrorMessage(error, "An error occurred while creating the category."),
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (categoryId: string, updates: Partial<FieldCategory>) => {
    try {
      await updateCategory(categoryId, updates);
      toast({
        title: "Success!",
        description: "Category updated successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update category",
        description: extractErrorMessage(error, "An error occurred while updating the category."),
        variant: "destructive",
      });
    }
  };

  const handleAddSubcategory = async (category: FieldCategory, subcategory: { name: string }) => {
    try {
      await addSubcategory(category.id, subcategory);
      toast({
        title: "Success!",
        description: "Subcategory created successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Failed to create subcategory",
        description: extractErrorMessage(error, "An error occurred while creating the subcategory."),
        variant: "destructive",
      });
    }
  };

  const handleAddField = async (field: Omit<ApplicationField, 'id' | 'order'>) => {
    try {
      await addField(field);
      toast({
        title: "Success!",
        description: "Field created successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Failed to create field",
        description: extractErrorMessage(error, "An error occurred while creating the field."),
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure? This will delete all fields in this category.')) {
      try {
        await deleteCategory(categoryId);
        toast({
          title: "Category deleted",
          description: "Category and all its fields have been deleted.",
          variant: "default",
        });
      } catch (error: any) {
        toast({
          title: "Failed to delete category",
          description: extractErrorMessage(error, "An error occurred while deleting the category."),
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (confirm('Are you sure? This will delete all fields in this subcategory.')) {
      try {
        await deleteSubcategory(categoryId, subcategoryId);
        toast({
          title: "Subcategory deleted",
          description: "Subcategory and all its fields have been deleted.",
          variant: "default",
        });
      } catch (error: any) {
        toast({
          title: "Failed to delete subcategory",
          description: extractErrorMessage(error, "An error occurred while deleting the subcategory."),
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      try {
        await deleteField(fieldId);
        toast({
          title: "Field deleted",
          description: "Field has been deleted successfully.",
          variant: "default",
        });
      } catch (error: any) {
        toast({
          title: "Failed to delete field",
          description: extractErrorMessage(error, "An error occurred while deleting the field."),
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenAddCategoryDialog = () => {
    setCategoryToEdit(null);
    setIsCategoryDialogOpen(true);
  };

  const handleOpenEditCategoryDialog = (category: FieldCategory) => {
    setCategoryToEdit(category);
    setIsCategoryDialogOpen(true);
  };

  const handleOpenAddSubcategoryDialog = (category: FieldCategory) => {
    setSelectedCategoryForSubcategory(category);
    setIsSubcategoryDialogOpen(true);
  };

  const closeCategoryDialog = () => {
    setIsCategoryDialogOpen(false);
    setCategoryToEdit(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading master fields...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Failed to Load Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error.message || 'Could not connect to the API. Please check your connection.'}
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Master Fields Database</h1>
          <p className="text-muted-foreground mt-1">
            Manage categories and application form fields
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleOpenAddCategoryDialog}>
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
          <Button variant="gradient" className="gap-2" onClick={() => setIsFieldDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fields by name or label..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Empty State */}
      {categories.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">No Categories Yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first category to organize your master fields.
              </p>
              <Button onClick={() => setIsCategoryDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Category
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-colors",
                  !selectedCategory ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                All Categories ({fields.length} fields)
              </button>
              {categories.map((category) => {
                const Icon = iconMap[category.icon] || FileText;
                const fieldCount = fields.filter(f => f.categoryId === category.id).length;
                
                return (
                  <div
                    key={category.id}
                    className={cn(
                      "group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                      selectedCategory === category.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    )}
                  >
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex-1 flex items-center gap-2 text-left"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1">{category.name}</span>
                      <span className="text-xs opacity-70">{fieldCount}</span>
                    </button>
                    {category.isCustom && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                            }}
                            title="Category options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              handleOpenEditCategoryDialog(category);
                            }}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              handleDeleteCategory(category.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Fields List */}
        <div className="lg:col-span-2 space-y-4">
          {categories
            .filter(cat => !selectedCategory || cat.id === selectedCategory)
            .map((category) => {
              const Icon = iconMap[category.icon] || FileText;
              const categoryFields = getFieldsByCategory(category.id);
              const isExpanded = expandedCategories.has(category.id);
              
              if (categoryFields.length === 0 && searchTerm) return null;
              
              return (
                <Card key={category.id} className="overflow-hidden">
                  <div 
                    className="p-4 bg-gradient-subtle cursor-pointer hover:bg-accent/10 transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-background">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{categoryFields.length} fields</Badge>
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4 space-y-3">
                      {/* Add Subcategory Button */}
                      <div className="flex justify-end mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAddSubcategoryDialog(category);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Subcategory
                        </Button>
                      </div>

                      {category.subcategories ? (
                        category.subcategories.map((subcat) => {
                          const subcatFields = getFieldsByCategory(category.id, subcat.id);
                          if (subcatFields.length === 0 && searchTerm) return null;
                          
                          return (
                            <div key={subcat.id} className="space-y-2">
                              <div className="flex items-center justify-between px-2">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                  {subcat.name}
                                </h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreVertical className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleDeleteSubcategory(category.id, subcat.id)}>
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Subcategory
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="space-y-2">
                                {subcatFields.map((field) => (
                                  <div
                                    key={field.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-background-secondary hover:shadow-sm transition-all group"
                                  >
                                    <div>
                                      <p className="font-medium text-sm">{field.label}</p>
                                      <p className="text-xs text-muted-foreground">Field name: {field.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {field.required && (
                                        <Badge variant="destructive" className="text-xs">Required</Badge>
                                      )}
                                      <Badge className={getFieldTypeColor(field.type)}>
                                        {field.type}
                                      </Badge>
                                      {field.isCustom && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                          onClick={() => handleDeleteField(field.id)}
                                        >
                                          <Trash2 className="w-3 h-3 text-destructive" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="space-y-2">
                          {categoryFields.map((field) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-background-secondary hover:shadow-sm transition-all group"
                            >
                              <div>
                                <p className="font-medium text-sm">{field.label}</p>
                                <p className="text-xs text-muted-foreground">Field name: {field.name}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                                <Badge className={getFieldTypeColor(field.type)}>
                                  {field.type}
                                </Badge>
                                {field.isCustom && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                    onClick={() => handleDeleteField(field.id)}
                                  >
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
        </div>
        </div>
      )}

      {/* Dialogs */}
      <AddCategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={closeCategoryDialog}
        onAdd={handleAddCategory}
        onUpdate={handleUpdateCategory}
        initialCategory={categoryToEdit}
      />

      <AddSubcategoryDialog
        isOpen={isSubcategoryDialogOpen}
        onClose={() => {
          setIsSubcategoryDialogOpen(false);
          setSelectedCategoryForSubcategory(null);
        }}
        categoryName={selectedCategoryForSubcategory?.name || ''}
        onAdd={(subcategory) => {
          if (selectedCategoryForSubcategory) {
            handleAddSubcategory(selectedCategoryForSubcategory, subcategory);
          }
        }}
      />

      <AddFieldDialog
        isOpen={isFieldDialogOpen}
        onClose={() => setIsFieldDialogOpen(false)}
        categories={categories}
        onAdd={handleAddField}
      />
    </div>
  );
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default MasterFields;