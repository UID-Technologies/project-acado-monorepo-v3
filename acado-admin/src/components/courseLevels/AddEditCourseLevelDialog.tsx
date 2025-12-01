import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CourseLevel } from '@/types/courseLevel';
import type { UpsertCourseLevelPayload } from '@/api/courseLevels.api';
import { generateSlug } from '@/lib/slug';
import { TagInput } from '@/components/form/TagInput';
import { parseKeywords, formatKeywords } from '@/lib/keywords';

interface AddEditCourseLevelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (level: UpsertCourseLevelPayload) => Promise<void>;
  level?: CourseLevel | null;
}

export function AddEditCourseLevelDialog({
  isOpen,
  onClose,
  onSave,
  level,
}: AddEditCourseLevelDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    description: '',
    keywords: [] as string[],
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (level) {
      setFormData({
        name: level.name,
        shortName: level.shortName,
        description: level.description || '',
        keywords: parseKeywords(level.keywords),
        isActive: level.isActive,
      });
    } else {
      setFormData({
        name: '',
        shortName: '',
        description: '',
        keywords: [],
        isActive: true,
      });
    }
  }, [level, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.shortName.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        name: formData.name.trim(),
        shortName: formData.shortName.trim(),
        description: formData.description.trim() || undefined,
        keywords: formatKeywords(formData.keywords),
        isActive: formData.isActive,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{level ? 'Edit Course Level' : 'Add Course Level'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onBlur={() => {
                  if (!formData.shortName.trim() && formData.name.trim()) {
                    setFormData((prev) => ({ ...prev, shortName: generateSlug(prev.name) }));
                  }
                }}
                placeholder="e.g., Undergraduate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name (slug) *</Label>
              <Input
                id="shortName"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                placeholder="e.g., undergraduate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this level"
                rows={3}
              />
            </div>

            <TagInput
              id="keywords"
              label="Keywords"
              value={formData.keywords}
              onChange={(next) => setFormData((prev) => ({ ...prev, keywords: next }))}
              placeholder="Type a keyword and press Enter"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : level ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

