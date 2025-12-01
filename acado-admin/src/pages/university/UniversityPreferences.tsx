import { Card } from '@/components/ui/card';

const UniversityPreferences = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Preferences</h1>
      <p className="text-muted-foreground">Configure notification channels, integrations, and default workflows.</p>
    </div>
    <Card className="p-6 text-sm text-muted-foreground">
      Preference management will be configurable soon. Until then, reach out to support for adjustments.
    </Card>
  </div>
);

export default UniversityPreferences;
