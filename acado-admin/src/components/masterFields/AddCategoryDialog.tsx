import React, { useEffect, useState } from 'react';
import { Plus, Folder, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FieldCategory } from '@/types/application';

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Omit<FieldCategory, 'id'>) => Promise<void> | void;
  initialCategory?: FieldCategory | null;
  onUpdate?: (categoryId: string, updates: Partial<FieldCategory>) => Promise<void> | void;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialCategory = null,
  onUpdate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = Boolean(initialCategory && onUpdate);

  const iconOptions = [
    'User', 'GraduationCap', 'Briefcase', 'Lightbulb', 'Award',
    'FileText', 'PenTool', 'Users', 'DollarSign', 'Settings',
    'Folder', 'Globe', 'Heart', 'Star', 'Shield'
  ];

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon('Folder');
  };

  useEffect(() => {
    if (isOpen) {
      if (initialCategory) {
        setName(initialCategory.name || '');
        setDescription(initialCategory.description || '');
        setIcon(initialCategory.icon || 'Folder');
      } else {
        resetForm();
      }
    } else {
      resetForm();
      setSubmitting(false);
    }
  }, [isOpen, initialCategory]);

  const handleSubmit = async () => {
    if (!name.trim() || submitting) return;

    setSubmitting(true);
    try {
      if (isEditMode && initialCategory && onUpdate) {
        await onUpdate(initialCategory.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          icon,
        });
      } else {
        await onAdd({
          name: name.trim(),
          description: description.trim() || undefined,
          icon,
          order: 0, // Will be set in the hook
        });
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the category details to keep your master fields organized'
              : 'Create a new category to organize your application fields'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name *</Label>
            <Input
              id="category-name"
              placeholder="e.g., Medical Information"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              placeholder="Brief description of this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger id="category-icon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((iconName) => (
                  <SelectItem key={iconName} value={iconName}>
                    {iconName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || submitting}>
            {isEditMode ? (
              <>
                <Edit2 className="w-4 h-4 mr-1" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Add Category
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};