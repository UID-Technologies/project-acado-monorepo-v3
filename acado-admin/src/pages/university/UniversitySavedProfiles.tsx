import { Card } from '@/components/ui/card';

const UniversitySavedProfiles = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Saved Talent Profiles</h1>
      <p className="text-muted-foreground">Bookmark promising applicants and track their engagement.</p>
    </div>
    <Card className="p-6 text-sm text-muted-foreground">
      This view will surface starred candidates once the talent pipeline is connected.
    </Card>
  </div>
);

export default UniversitySavedProfiles;
