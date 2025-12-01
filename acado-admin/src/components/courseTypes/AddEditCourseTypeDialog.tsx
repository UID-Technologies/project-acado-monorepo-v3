import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CourseType } from "@/types/courseType";
import type { UpsertCourseTypePayload } from "@/api/courseTypes.api";
import { generateSlug } from '@/lib/slug';
import { TagInput } from '@/components/form/TagInput';
import { parseKeywords, formatKeywords } from '@/lib/keywords';

interface AddEditCourseTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: UpsertCourseTypePayload) => Promise<void>;
  type?: CourseType;
}

const AddEditCourseTypeDialog = ({
  isOpen,
  onClose,
  onSave,
  type,
}: AddEditCourseTypeDialogProps) => {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (type) {
      setName(type.name);
      setShortName(type.shortName);
      setDescription(type.description || "");
      setKeywords(parseKeywords(type.keywords));
    } else {
      setName("");
      setShortName("");
      setDescription("");
      setKeywords([]);
    }
  }, [type, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortName.trim()) return;

    setSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        shortName: shortName.trim(),
        description: description.trim() || undefined,
        keywords: formatKeywords(keywords),
        isActive: type?.isActive ?? true,
      });
      setName("");
      setShortName("");
      setDescription("");
      setKeywords([]);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{type ? "Edit Course Type" : "Add Course Type"}</DialogTitle>
          <DialogDescription>
            {type
              ? "Update the course type details below."
              : "Enter the details for the new course type."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  if (!shortName.trim() && name.trim()) {
                    setShortName(generateSlug(name));
                  }
                }}
                placeholder="e.g., Full Time"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortName">
                Short Name (slug) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shortName"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g., full-time"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the course type"
                rows={3}
              />
            </div>
            <TagInput
              id="keywords"
              label="Keywords"
              value={keywords}
              onChange={setKeywords}
              placeholder="Type a keyword and press Enter"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : type ? "Update" : "Add"} Course Type
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCourseTypeDialog;

