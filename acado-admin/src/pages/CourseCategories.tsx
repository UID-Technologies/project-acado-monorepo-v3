import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { CourseCategory } from '@/types/courseCategory';
import { AddEditCourseCategoryDialog } from '@/components/courseCategories/AddEditCourseCategoryDialog';
import { toast } from '@/hooks/use-toast';
import { courseCategoriesApi, UpsertCourseCategoryPayload } from '@/api/courseCategories.api';

export default function CourseCategories() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CourseCategory | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await courseCategoriesApi.list({ includeInactive: true });
      setCategories(data);
    } catch (error: any) {
      console.error('Failed to load course categories', error);
      toast({
        title: 'Failed to load categories',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleAdd = async (payload: UpsertCourseCategoryPayload) => {
    try {
      const created = await courseCategoriesApi.create(payload);
      setCategories((prev) => [...prev, created]);
      toast({
        title: 'Success',
        description: 'Category added successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to add category',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEdit = async (payload: UpsertCourseCategoryPayload) => {
    if (!editingCategory) return;
    try {
      const updatedCategory = await courseCategoriesApi.update(editingCategory.id, payload);
      setCategories((prev) =>
        prev.map((category) => (category.id === updatedCategory.id ? updatedCategory : category))
      );
      setEditingCategory(null);
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to update category',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await courseCategoriesApi.remove(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to delete category',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const toggleActive = async (category: CourseCategory) => {
    try {
      const updated = await courseCategoriesApi.update(category.id, {
        isActive: !category.isActive,
      });
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      toast({
        title: 'Success',
        description: 'Category status updated',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to update status',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (category: CourseCategory) => {
    setEditingCategory(category);
    setIsAddEditDialogOpen(true);
  };

  const openDeleteDialog = (category: CourseCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const buildTree = (parentId: string | null = null, level: number = 0): JSX.Element[] => {
    return categories
      .filter((c) => c.parentId === parentId)
      .map((category) => {
        const hasChildren = categories.some((c) => c.parentId === category.id);
        const isExpanded = expandedIds.has(category.id);

        return (
          <React.Fragment key={category.id}>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
                  {hasChildren ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleExpand(category.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    <div className="w-6" />
                  )}
                  <span className="font-medium">{category.name}</span>
                </div>
              </TableCell>
              <TableCell>{category.shortName}</TableCell>
              <TableCell>{category.code || '-'}</TableCell>
              <TableCell>
                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={category.isActive}
                    onCheckedChange={() => toggleActive(category)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {isExpanded && buildTree(category.id, level + 1)}
          </React.Fragment>
        );
      });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Course Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage course categories with hierarchical structure
          </p>
        </div>
        <Button onClick={() => setIsAddEditDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No categories found. Add your first category to get started.
                </TableCell>
              </TableRow>
            ) : (
              buildTree()
            )}
          </TableBody>
        </Table>
      </div>

      <AddEditCourseCategoryDialog
        isOpen={isAddEditDialogOpen}
        onClose={() => {
          setIsAddEditDialogOpen(false);
          setEditingCategory(null);
        }}
        onSave={editingCategory ? handleEdit : handleAdd}
        category={editingCategory}
        categories={categories}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
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
}

