import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  FileText,
  GripVertical,
  GraduationCap,
  Mail,
  Plus,
  Save,
  Trash2,
  Users,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useFormsData } from '@/hooks/useFormsData';

interface ProcessStep {
  id: string;
  name: string;
  type: 'interview' | 'test' | 'document-review' | 'committee-review' | 'final-decision';
  description: string;
  duration: string;
  responsible: string;
  order: number;
}

const ApplicationsProcessConfiguration: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courses } = useFormsData();

  const [selectedCourse, setSelectedCourse] = useState(courseId || '');
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const course = courses.find((c) => c.id === selectedCourse);

  useEffect(() => {
    if (courseId && courseId !== 'new') {
      loadExistingProcess(courseId);
    }
  }, [courseId]);

  const loadExistingProcess = (id: string) => {
    const mockSteps: ProcessStep[] = [
      {
        id: '1',
        name: 'Initial Screening',
        type: 'document-review',
        description: 'Admissions team reviews submitted documents.',
        duration: '2 days',
        responsible: 'Admissions Team',
        order: 1,
      },
      {
        id: '2',
        name: 'Online Assessment',
        type: 'test',
        description: 'Aptitude and domain-specific assessment.',
        duration: '1 day',
        responsible: 'Testing Center',
        order: 2,
      },
    ];
    setSteps(mockSteps);
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      name: '',
      type: 'document-review',
      description: '',
      duration: '',
      responsible: '',
      order: steps.length + 1,
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const updateStep = (stepId: string, field: keyof ProcessStep, value: any) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, [field]: value } : step)),
    );
  };

  const removeStep = (stepId: string) => {
    setSteps((prev) => {
      const filtered = prev.filter((step) => step.id !== stepId);
      return filtered.map((step, index) => ({ ...step, order: index + 1 }));
    });
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    setSteps((prev) => {
      const index = prev.findIndex((step) => step.id === stepId);
      if (index < 0) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const newSteps = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
      return newSteps.map((step, idx) => ({ ...step, order: idx + 1 }));
    });
  };

  const handleSave = async () => {
    if (!selectedCourse) {
      toast({
        title: 'Select a course',
        description: 'Please choose a course before saving the process.',
        variant: 'destructive',
      });
      return;
    }

    if (steps.length === 0) {
      toast({
        title: 'Add at least one step',
        description: 'Selection process must contain at least one step.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Selection process saved',
        description: 'Selection workflow updated successfully.',
      });
      navigate('/applications/selection-process');
    }, 800);
  };

  const getStepIcon = (type: ProcessStep['type']) => {
    switch (type) {
      case 'interview':
        return <Users className="h-4 w-4" />;
      case 'test':
        return <FileText className="h-4 w-4" />;
      case 'document-review':
        return <FileText className="h-4 w-4" />;
      case 'committee-review':
        return <Users className="h-4 w-4" />;
      case 'final-decision':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/applications/selection-process')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {courseId === 'new' ? 'Create Selection Process' : 'Edit Selection Process'}
          </h1>
          <p className="text-muted-foreground">
            Configure the multi-step selection workflow for candidates.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Selection</CardTitle>
          <CardDescription>Select the course associated with this selection process.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="course">Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((courseOption) => (
                  <SelectItem key={courseOption.id} value={courseOption.id}>
                    {courseOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {course && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{course.type}</Badge>
              {course.universityId && <Badge variant="outline">{course.universityId}</Badge>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Process Steps</CardTitle>
          <CardDescription>
            Define the sequence of evaluations an applicant must go through.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-sm text-muted-foreground">
              <Calendar className="mb-3 h-8 w-8" />
              No steps added yet. Start by adding the first step.
            </div>
          ) : (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="rounded-lg border p-4 shadow-sm transition hover:border-primary"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary">Step {index + 1}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStep(step.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStep(step.id, 'down')}
                        disabled={index === steps.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${step.id}`}>Step Name</Label>
                      <Input
                        id={`name-${step.id}`}
                        value={step.name}
                        onChange={(event) => updateStep(step.id, 'name', event.target.value)}
                        placeholder="e.g., Initial Screening"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`type-${step.id}`}>Step Type</Label>
                      <Select
                        value={step.type}
                        onValueChange={(value: ProcessStep['type']) =>
                          updateStep(step.id, 'type', value)
                        }
                      >
                        <SelectTrigger id={`type-${step.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document-review">Document Review</SelectItem>
                          <SelectItem value="test">Assessment/Test</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="committee-review">Committee Review</SelectItem>
                          <SelectItem value="final-decision">Final Decision</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`description-${step.id}`}>Description</Label>
                      <Textarea
                        id={`description-${step.id}`}
                        value={step.description}
                        onChange={(event) =>
                          updateStep(step.id, 'description', event.target.value)
                        }
                        placeholder="Describe what happens during this step"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`responsible-${step.id}`}>Responsible Team</Label>
                      <Input
                        id={`responsible-${step.id}`}
                        value={step.responsible}
                        onChange={(event) =>
                          updateStep(step.id, 'responsible', event.target.value)
                        }
                        placeholder="Admissions Team"
                      />
                      <Label htmlFor={`duration-${step.id}`} className="mt-2">
                        Duration
                      </Label>
                      <Input
                        id={`duration-${step.id}`}
                        value={step.duration}
                        onChange={(event) => updateStep(step.id, 'duration', event.target.value)}
                        placeholder="e.g., 2 days"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    {getStepIcon(step.type)}
                    <span>
                      {step.name ? step.name : 'Unnamed step'} •{' '}
                      {step.duration ? step.duration : 'Duration TBD'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button type="button" variant="outline" onClick={addStep}>
            <Plus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/applications/selection-process')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Selection Process'}
        </Button>
      </div>
    </div>
  );
};

export default ApplicationsProcessConfiguration;


