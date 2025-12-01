import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const AdminUniversityInfo = () => {
  const { user } = useAuth();
  const assignedId = user?.universityIds?.[0];

  if (assignedId) {
    return <Navigate to={`/universities/${assignedId}/details`} replace />;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">University Information</h1>
        <p className="text-muted-foreground">
          You are not yet linked to a specific university profile. Reach out to your superadmin to assign one.
        </p>
      </div>
      <Card className="p-6 text-sm text-muted-foreground">
        Once assigned, this page will automatically show your university details.
      </Card>
    </div>
  );
};

export default AdminUniversityInfo;
