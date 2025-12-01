import { Card } from '@/components/ui/card';

const UniversityProfile = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Account Profile</h1>
      <p className="text-muted-foreground">Review account details and update branding information.</p>
    </div>
    <Card className="p-6 text-sm text-muted-foreground">
      Profile editing is on the roadmap. For now, contact support to make changes.
    </Card>
  </div>
);

export default UniversityProfile;
