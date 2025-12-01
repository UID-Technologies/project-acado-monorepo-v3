import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
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
import { LearningOutcome } from '@/types/learningOutcome';
import { AddEditLearningOutcomeDialog } from '@/components/learningOutcomes/AddEditLearningOutcomeDialog';
import { toast } from '@/hooks/use-toast';
import { learningOutcomesApi, UpsertLearningOutcomePayload } from '@/api/learningOutcomes.api';

export default function LearningOutcomes() {
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<LearningOutcome | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outcomeToDelete, setOutcomeToDelete] = useState<LearningOutcome | null>(null);

  const fetchOutcomes = async () => {
    try {
      setLoading(true);
      const data = await learningOutcomesApi.list({ includeInactive: true });
      setOutcomes(data);
    } catch (error: any) {
      console.error('Failed to load learning outcomes', error);
      toast({
        title: 'Failed to load learning outcomes',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAdd = async (payload: UpsertLearningOutcomePayload) => {
    try {
      const created = await learningOutcomesApi.create(payload);
      setOutcomes((prev) => [...prev, created]);
      toast({ title: 'Success', description: 'Learning outcome added successfully' });
    } catch (error: any) {
      toast({
        title: 'Failed to add learning outcome',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEdit = async (payload: UpsertLearningOutcomePayload) => {
    if (!editingOutcome) return;
    try {
      const updated = await learningOutcomesApi.update(editingOutcome.id, payload);
      setOutcomes((prev) => prev.map((outcome) => (outcome.id === updated.id ? updated : outcome)));
      setEditingOutcome(null);
      toast({ title: 'Success', description: 'Learning outcome updated successfully' });
    } catch (error: any) {
      toast({
        title: 'Failed to update learning outcome',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!outcomeToDelete) return;

    const hasChildren = outcomes.some((o) => o.parentId === outcomeToDelete.id);
    if (hasChildren) {
      toast({
        title: 'Error',
        description: 'Cannot delete outcome with child outcomes',
        variant: 'destructive',
      });
      setDeleteDialogOpen(false);
      return;
    }

    try {
      await learningOutcomesApi.remove(outcomeToDelete.id);
      setOutcomes((prev) => prev.filter((o) => o.id !== outcomeToDelete.id));
      toast({ title: 'Success', description: 'Learning outcome deleted successfully' });
    } catch (error: any) {
      toast({
        title: 'Failed to delete learning outcome',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setOutcomeToDelete(null);
    }
  };

  const toggleActive = async (outcome: LearningOutcome) => {
    try {
      const updated = await learningOutcomesApi.update(outcome.id, { isActive: !outcome.isActive });
      setOutcomes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      toast({ title: 'Success', description: 'Learning outcome status updated' });
    } catch (error: any) {
      toast({
        title: 'Failed to update status',
        description: error?.response?.data?.error || error?.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

const buildTree = (parentId: string | null = null, level: number = 0): JSX.Element[] => {
    return outcomes
      .filter((o) => o.parentId === parentId)
      .map((outcome) => {
        const hasChildren = outcomes.some((o) => o.parentId === outcome.id);
        const isExpanded = expandedIds.has(outcome.id);

        return (
          <React.Fragment key={outcome.id}>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
                  {hasChildren ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleExpand(outcome.id)}
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
                <span className="font-medium">{outcome.name}</span>
                </div>
              </TableCell>
              <TableCell>{outcome.shortName}</TableCell>
            <TableCell>{outcome.code || '-'}</TableCell>
              <TableCell>{outcome.description || '-'}</TableCell>
              <TableCell>
                <Badge variant={outcome.isActive ? 'default' : 'secondary'}>
                  {outcome.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={outcome.isActive}
                    onCheckedChange={() => toggleActive(outcome)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingOutcome(outcome);
                      setIsAddEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setOutcomeToDelete(outcome);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {isExpanded && buildTree(outcome.id, level + 1)}
          </React.Fragment>
        );
      });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Learning Outcomes</h1>
          <p className="text-muted-foreground mt-1">
            Define program learning outcomes and align them to courses
          </p>
        </div>
        <Button onClick={() => setIsAddEditDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Learning Outcome
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Loading learning outcomes...
                </TableCell>
              </TableRow>
            ) : outcomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No learning outcomes found. Add your first outcome to get started.
                </TableCell>
              </TableRow>
            ) : (
              buildTree()
            )}
          </TableBody>
        </Table>
      </div>

      <AddEditLearningOutcomeDialog
        isOpen={isAddEditDialogOpen}
        onClose={() => {
          setIsAddEditDialogOpen(false);
          setEditingOutcome(null);
        }}
        onSave={editingOutcome ? handleEdit : handleAdd}
        outcome={editingOutcome}
        outcomes={outcomes}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Learning Outcome</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{outcomeToDelete?.name}"? This action cannot be undone.
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

