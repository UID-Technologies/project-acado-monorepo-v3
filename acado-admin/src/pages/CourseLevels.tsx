import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import { CourseLevel } from '@/types/courseLevel';
import { AddEditCourseLevelDialog } from '@/components/courseLevels/AddEditCourseLevelDialog';
import { toast } from '@/hooks/use-toast';
import { courseLevelsApi, UpsertCourseLevelPayload } from '@/api/courseLevels.api';

export default function CourseLevels() {
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<CourseLevel | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<CourseLevel | null>(null);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const data = await courseLevelsApi.list({ includeInactive: true });
      setLevels(data);
    } catch (error: any) {
      console.error('Failed to load course levels', error);
      toast({
        title: 'Failed to load course levels',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleAdd = async (payload: UpsertCourseLevelPayload) => {
    try {
      const created = await courseLevelsApi.create(payload);
      setLevels((prev) => [...prev, created]);
      toast({
        title: 'Success',
        description: 'Course level added successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to add level',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEdit = async (payload: UpsertCourseLevelPayload) => {
    if (!editingLevel) return;
    try {
      const updated = await courseLevelsApi.update(editingLevel.id, payload);
      setLevels((prev) => prev.map((level) => (level.id === updated.id ? updated : level)));
      setEditingLevel(null);
      toast({
        title: 'Success',
        description: 'Course level updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to update level',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!levelToDelete) return;
    try {
      await courseLevelsApi.remove(levelToDelete.id);
      setLevels((prev) => prev.filter((level) => level.id !== levelToDelete.id));
      toast({
        title: 'Success',
        description: 'Course level deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to delete level',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setLevelToDelete(null);
    }
  };

  const toggleActive = async (level: CourseLevel) => {
    try {
      const updated = await courseLevelsApi.update(level.id, { isActive: !level.isActive });
      setLevels((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      toast({ title: 'Success', description: 'Course level status updated' });
    } catch (error: any) {
      toast({
        title: 'Failed to update status',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (level: CourseLevel) => {
    setEditingLevel(level);
    setIsAddEditDialogOpen(true);
  };

  const openDeleteDialog = (level: CourseLevel) => {
    setLevelToDelete(level);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Course Levels</h1>
          <p className="text-muted-foreground mt-1">
            Manage course levels and degree types
          </p>
        </div>
        <Button onClick={() => setIsAddEditDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Level
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Loading course levels...
                </TableCell>
              </TableRow>
            ) : levels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No course levels available. Add your first level to get started.
                </TableCell>
              </TableRow>
            ) : (
              levels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell className="font-medium">{level.name}</TableCell>
                  <TableCell>{level.shortName}</TableCell>
                  <TableCell>{level.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={level.isActive ? 'default' : 'secondary'}>
                      {level.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={level.isActive}
                        onCheckedChange={() => toggleActive(level)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(level)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(level)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddEditCourseLevelDialog
        isOpen={isAddEditDialogOpen}
        onClose={() => {
          setIsAddEditDialogOpen(false);
          setEditingLevel(null);
        }}
        onSave={editingLevel ? handleEdit : handleAdd}
        level={editingLevel}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course Level</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{levelToDelete?.name}"? This action cannot be undone.
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

