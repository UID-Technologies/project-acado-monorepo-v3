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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LearningOutcome } from '@/types/learningOutcome';
import type { UpsertLearningOutcomePayload } from '@/api/learningOutcomes.api';
import { generateSlug, generateRandomCode } from '@/lib/slug';
import { CodeField } from '@/components/form/CodeField';
import { TagInput } from '@/components/form/TagInput';
import { parseKeywords, formatKeywords } from '@/lib/keywords';

interface AddEditLearningOutcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (outcome: UpsertLearningOutcomePayload) => Promise<void>;
  outcome?: LearningOutcome | null;
  outcomes: LearningOutcome[];
}

export function AddEditLearningOutcomeDialog({
  isOpen,
  onClose,
  onSave,
  outcome,
  outcomes,
}: AddEditLearningOutcomeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    code: '',
    parentId: null as string | null,
    description: '',
    keywords: [] as string[],
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (outcome) {
      setFormData({
        name: outcome.name,
        shortName: outcome.shortName,
        code: outcome.code || '',
        parentId: outcome.parentId,
        description: outcome.description || '',
        keywords: parseKeywords(outcome.keywords),
        isActive: outcome.isActive,
      });
    } else {
      setFormData({
        name: '',
        shortName: '',
        code: '',
        parentId: null,
        description: '',
        keywords: [],
        isActive: true,
      });
    }
  }, [outcome, isOpen]);

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
        code: formData.code.trim() || undefined,
        parentId: formData.parentId,
        description: formData.description.trim() || undefined,
        keywords: formatKeywords(formData.keywords),
        isActive: formData.isActive,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const getAvailableParents = () => {
    if (!outcome) return outcomes;

    const getDescendantIds = (id: string): string[] => {
      const children = outcomes.filter((o) => o.parentId === id);
      return [
        id,
        ...children.flatMap((child) => getDescendantIds(child.id)),
      ];
    };

    const excludedIds = getDescendantIds(outcome.id);
    return outcomes.filter((o) => !excludedIds.includes(o.id));
  };

  const availableParents = getAvailableParents();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{outcome ? 'Edit Learning Outcome' : 'Add Learning Outcome'}</DialogTitle>
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
                placeholder="e.g., Critical Thinking"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name (slug) *</Label>
              <Input
                id="shortName"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                placeholder="e.g., critical-thinking"
                required
              />
            </div>

            <CodeField
              id="code"
              label="Code"
              value={formData.code}
              onChange={(next) => setFormData((prev) => ({ ...prev, code: next }))}
              onGenerate={() =>
                setFormData((prev) => ({
                  ...prev,
                  code: generateRandomCode(6),
                }))
              }
              placeholder="e.g., CT"
            />

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Learning Outcome</Label>
              <Select
                value={formData.parentId || 'none'}
                onValueChange={(value) =>
                  setFormData({ ...formData, parentId: value === 'none' ? null : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {availableParents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this learning outcome"
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
              {submitting ? 'Saving…' : outcome ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

