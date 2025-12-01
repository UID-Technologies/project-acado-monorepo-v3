import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { CourseType } from "@/types/courseType";
import AddEditCourseTypeDialog from "@/components/courseTypes/AddEditCourseTypeDialog";
import { courseTypesApi, UpsertCourseTypePayload } from "@/api/courseTypes.api";
import { toast } from "@/hooks/use-toast";
import { extractErrorMessage } from '@/utils/errorUtils';

const CourseTypes = () => {
  const [types, setTypes] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<CourseType | null>(null);
  const [deletingType, setDeletingType] = useState<CourseType | null>(null);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const data = await courseTypesApi.list({ includeInactive: true });
      setTypes(data);
    } catch (error: any) {
      console.error('Failed to load course types', error);
      toast({
        title: 'Failed to load course types',
        description: extractErrorMessage(error, 'Please try again later.'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAdd = async (payload: UpsertCourseTypePayload) => {
    try {
      const created = await courseTypesApi.create(payload);
      setTypes((prev) => [...prev, created]);
      toast({ title: 'Success', description: 'Course type added successfully' });
    } catch (error: any) {
      toast({
        title: 'Failed to add course type',
        description: extractErrorMessage(error, 'Please try again later.'),
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEdit = async (payload: UpsertCourseTypePayload) => {
    if (!editingType) return;
    try {
      const updated = await courseTypesApi.update(editingType.id, payload);
      setTypes((prev) => prev.map((type) => (type.id === updated.id ? updated : type)));
      setEditingType(null);
      toast({ title: 'Success', description: 'Course type updated successfully' });
    } catch (error: any) {
      toast({
        title: 'Failed to update course type',
        description: extractErrorMessage(error, 'Please try again later.'),
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deletingType) return;
    try {
      await courseTypesApi.remove(deletingType.id);
      setTypes((prev) => prev.filter((type) => type.id !== deletingType.id));
      toast({ title: 'Success', description: 'Course type deleted successfully' });
    } catch (error: any) {
      toast({
        title: 'Failed to delete course type',
        description: extractErrorMessage(error, 'Please try again later.'),
        variant: 'destructive',
      });
    } finally {
      setDeletingType(null);
    }
  };

  const toggleActive = async (type: CourseType) => {
    try {
      const updated = await courseTypesApi.update(type.id, { isActive: !type.isActive });
      setTypes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      toast({ title: 'Success', description: 'Course type status updated' });
    } catch (error: any) {
      toast({
        title: 'Failed to update status',
        description: extractErrorMessage(error, 'Please try again later.'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Course Types</h1>
          <p className="text-muted-foreground mt-1">
            Manage course types and their properties
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course Type
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Keywords</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Loading course types...
                </TableCell>
              </TableRow>
            ) : types.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No course types found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.shortName}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {type.description || "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {type.keywords || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={type.isActive ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleActive(type)}
                    >
                      {type.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingType(type)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingType(type)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddEditCourseTypeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAdd}
      />

      <AddEditCourseTypeDialog
        isOpen={!!editingType}
        onClose={() => setEditingType(null)}
        onSave={handleEdit}
        type={editingType || undefined}
      />

      <AlertDialog open={!!deletingType} onOpenChange={() => setDeletingType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course type "{deletingType?.name}".
              This action cannot be undone.
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

export default CourseTypes;

