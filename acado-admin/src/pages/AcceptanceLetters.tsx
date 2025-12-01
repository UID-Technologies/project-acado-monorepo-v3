import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Award, Mail, Eye } from 'lucide-react';
import { useApplicationSubmissions } from '@/hooks/useApplicationSubmissions';

const AcceptanceLetters: React.FC = () => {
  const { applications } = useApplicationSubmissions();

  useEffect(() => {
    document.title = 'Acceptance Letters | ACADO Admin';
  }, []);

  const acceptedApplications = useMemo(
    () => applications.filter((app) => app.status === 'accepted'),
    [applications],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Acceptance Letters</h1>
          <p className="text-muted-foreground">
            Manage generated acceptance letters and resend them to accepted applicants.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Accepted Applicants</CardTitle>
          <CardDescription>
            {acceptedApplications.length} acceptance{' '}
            {acceptedApplications.length === 1 ? 'letter' : 'letters'} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {acceptedApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No accepted applications yet. Once applicants are accepted, their letters will appear
              here.
            </p>
          ) : (
            <div className="space-y-3">
              {acceptedApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="text-sm font-medium">{application.applicantName}</h4>
                      <Badge variant="default" className="gap-1">
                        <Award className="h-3 w-3" />
                        Accepted
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {application.applicantEmail} • {application.courseName} • Submitted{' '}
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      View Letter
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Mail className="mr-2 h-4 w-4" />
                      Resend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptanceLetters;


