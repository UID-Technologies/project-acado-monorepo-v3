import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  CheckCircle,
  Edit,
  MoreVertical,
  Plus,
  Target,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useApplicationProcess } from '@/hooks/useApplicationProcess';
import { useFormsData } from '@/hooks/useFormsData';

const ApplicationsSelectionProcess: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { criteriaConfigs, deleteCriteriaConfig } = useApplicationProcess();
  const { courses, forms } = useFormsData();

  const handleCreateNew = (courseId: string) => {
    navigate(`/applications/selection-process/${courseId}`);
  };

  const handleEdit = (courseId: string) => {
    navigate(`/applications/selection-process/${courseId}`);
  };

  const handleDelete = async (courseId: string) => {
    try {
      await deleteCriteriaConfig(courseId);
      toast({
        title: 'Criteria deleted',
        description: 'Matching criteria has been removed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Unable to delete criteria',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getCourseDetails = (courseId: string) => courses.find((course) => course.id === courseId);

  const getFormDetails = (courseId: string) => {
    const course = getCourseDetails(courseId);
    if (course?.applicationFormId) {
      return forms.find((form) => form.id === course.applicationFormId);
    }
    return null;
  };

  const coursesWithoutCriteria = courses.filter(
    (course) => !criteriaConfigs.find((config) => config.courseId === course.id),
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Selection Process</h1>
        <p className="text-muted-foreground">
          Configure evaluation criteria and selection workflow for each course.
        </p>
      </div>

      {coursesWithoutCriteria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Courses Without Selection Process</CardTitle>
            <CardDescription>
              These courses need evaluation criteria and selection steps configured before reviewing
              applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {coursesWithoutCriteria.map((course) => (
                <Card key={course.id} className="border-dashed">
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">{course.type}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-orange-500">
                        <AlertCircle className="h-3 w-3" />
                        <span>No process configured</span>
                      </div>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => handleCreateNew(course.id)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Configure Process
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configured Application Processes</CardTitle>
          <CardDescription>
            Manage evaluation criteria and selection steps for courses with active applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {criteriaConfigs.length === 0 ? (
            <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
              No selection processes configured yet. Choose a course above to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Application Form</TableHead>
                  <TableHead>Min. Score</TableHead>
                  <TableHead>Criteria Count</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteriaConfigs.map((config) => {
                  const course = getCourseDetails(config.courseId);
                  const form = getFormDetails(config.courseId);
                  const totalWeight = config.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
                  const isValid = totalWeight === 100 || config.criteria.length === 0;

                  return (
                    <TableRow key={config.courseId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course?.name || 'Unknown Course'}</p>
                          <p className="text-sm text-muted-foreground">{course?.type || '—'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {form ? (
                          <div>
                            <p className="text-sm">{form.name}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {form.fields.length} fields
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No form linked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{config.minimumScore}%</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>{config.criteria.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(config.updatedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {isValid ? (
                          <Badge className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Weight mismatch
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(config.courseId)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Criteria
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(config.courseId)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsSelectionProcess;


